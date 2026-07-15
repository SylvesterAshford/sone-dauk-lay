import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '../services/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const socialAuthBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const isAdmin = computed(() => {
    const roles = user.value?.roles || []
    return user.value?.role === 'admin' || roles.some((role) => role.name === 'admin' || role === 'admin')
  })

  async function login(email, password) {
    loading.value = true
    try {
      const { data } = await api.post('/login', { email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, password) {
    loading.value = true
    try {
      const { data } = await api.post('/register', { name, email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const { data } = await api.get('/user')
      user.value = data
    } catch {
      logout()
    }
  }

  async function fetchAdminOverview() {
    const { data } = await api.get('/admin/overview')
    return data
  }

  async function fetchAdminUsers(params = {}) {
    const { data } = await api.get('/admin/users', { params })
    return data
  }

  async function updateAdminUser(userId, payload) {
    const { data } = await api.patch(`/admin/users/${userId}`, payload)
    return data
  }

  async function deleteAdminUser(userId) {
    const { data } = await api.delete(`/admin/users/${userId}`)
    return data
  }

  function acceptToken(authToken) {
    token.value = authToken
    localStorage.setItem('token', authToken)
  }

  function loginWithGoogle() {
    const redirectUrl = new URL('/auth/google/redirect', socialAuthBaseUrl)
    redirectUrl.searchParams.set('frontend_url', window.location.origin)
    window.location.href = redirectUrl.toString()
  }

  function logout() {
    api.post('/logout').catch(() => {})
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    loading,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    acceptToken,
    fetchUser,
    fetchAdminOverview,
    fetchAdminUsers,
    updateAdminUser,
    deleteAdminUser,
    logout,
  }
})

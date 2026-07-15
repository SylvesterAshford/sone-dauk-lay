<template>
  <div class="min-h-screen px-5 py-8 text-slate-100 sm:px-8">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p class="text-sm font-black uppercase tracking-[0.22em] text-cyan-100/75">Admin Control</p>
          <h1 class="mt-2 text-4xl font-black text-white sm:text-5xl">Platform Overview</h1>
          <p class="mt-3 max-w-2xl text-base leading-7 text-slate-400">
            Manage prototype users, roles, and sign-in activity for the San Dauk Lay safety workspace.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <RouterLink class="rounded-xl border border-slate-700 px-5 py-3 text-base font-bold text-slate-100 hover:bg-slate-800" to="/dashboard">
            Dashboard
          </RouterLink>
          <button class="rounded-xl bg-slate-800 px-5 py-3 text-base font-bold text-white hover:bg-slate-700" @click="handleLogout">
            Logout
          </button>
        </div>
      </header>

      <p v-if="error" class="mb-6 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-base text-rose-100">
        {{ error }}
      </p>
      <p v-if="notice" class="mb-6 rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-base text-emerald-100">
        {{ notice }}
      </p>

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl shadow-black/20">
          <p class="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{{ stat.label }}</p>
          <p class="mt-4 text-4xl font-black text-white">{{ stat.value }}</p>
          <p class="mt-2 text-sm leading-6 text-slate-500">{{ stat.helper }}</p>
        </article>
      </section>

      <section class="mt-8 grid gap-6 xl:grid-cols-[1fr_26rem]">
        <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl shadow-black/20 sm:p-6">
          <div class="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 class="text-2xl font-black text-white">User Management</h2>
              <p class="mt-2 text-sm leading-6 text-slate-400">Search learners, promote admins, and remove demo accounts.</p>
            </div>
            <form class="flex w-full gap-2 md:w-auto" @submit.prevent="loadUsers(1)">
              <input
                v-model="search"
                class="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-base text-white outline-none placeholder:text-slate-600 focus:border-cyan-300 md:w-72"
                placeholder="Search users"
              />
              <button class="rounded-xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 hover:bg-cyan-200" type="submit">
                Search
              </button>
            </form>
          </div>

          <div v-if="loading" class="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-6 text-center text-slate-400">
            Loading users...
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[54rem] text-left text-base">
              <thead class="border-b border-slate-800 text-sm uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th class="py-3 pr-4">User</th>
                  <th class="py-3 pr-4">Provider</th>
                  <th class="py-3 pr-4">Joined</th>
                  <th class="py-3 pr-4">Role</th>
                  <th class="py-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                <tr v-for="account in users" :key="account.id">
                  <td class="py-4 pr-4">
                    <p class="font-bold text-white">{{ account.name }}</p>
                    <p class="mt-1 text-sm text-slate-400">{{ account.email }}</p>
                  </td>
                  <td class="py-4 pr-4 text-slate-300">{{ account.provider || 'email' }}</td>
                  <td class="py-4 pr-4 text-slate-300">{{ formatDate(account.created_at) }}</td>
                  <td class="py-4 pr-4">
                    <select
                      class="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-bold text-white outline-none focus:border-cyan-300"
                      :disabled="savingId === account.id"
                      :value="account.role"
                      @change="changeRole(account, $event.target.value)"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td class="py-4 pr-4 text-right">
                    <button
                      class="rounded-xl border border-rose-300/25 px-4 py-2 text-sm font-bold text-rose-100 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="savingId === account.id || account.id === userStore.user?.id"
                      @click="removeUser(account)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td class="py-8 text-center text-slate-400" colspan="5">No users match this search.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p class="text-sm text-slate-500">Page {{ pagination.current_page || 1 }} of {{ pagination.last_page || 1 }}</p>
            <div class="flex gap-2">
              <button class="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 disabled:cursor-not-allowed disabled:opacity-40" :disabled="!pagination.prev_page_url" @click="loadUsers((pagination.current_page || 1) - 1)">
                Previous
              </button>
              <button class="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 disabled:cursor-not-allowed disabled:opacity-40" :disabled="!pagination.next_page_url" @click="loadUsers((pagination.current_page || 1) + 1)">
                Next
              </button>
            </div>
          </div>
        </div>

        <aside class="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl shadow-black/20 sm:p-6">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-2xl font-black text-white">Recent Users</h2>
            <span class="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-bold text-cyan-100">Live</span>
          </div>
          <div class="grid gap-3">
            <article v-for="recentUser in recentUsers" :key="recentUser.id" class="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate font-black text-white">{{ recentUser.name }}</p>
                  <p class="mt-1 truncate text-sm text-slate-400">{{ recentUser.email }}</p>
                </div>
                <span class="shrink-0 rounded-full px-3 py-1 text-xs font-black" :class="recentUser.role === 'admin' ? 'bg-cyan-300 text-slate-950' : 'bg-slate-800 text-slate-300'">
                  {{ recentUser.role }}
                </span>
              </div>
              <p class="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{{ recentUser.provider || 'email' }} sign in</p>
            </article>
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const overview = ref(null)
const users = ref([])
const pagination = ref({})
const search = ref('')
const error = ref('')
const notice = ref('')
const loading = ref(false)
const savingId = ref(null)

const stats = computed(() => {
  const data = overview.value?.stats || {}

  return [
    { label: 'Users', value: data.users ?? 0, helper: 'Total accounts' },
    { label: 'Admins', value: data.admins ?? 0, helper: 'Can manage platform' },
    { label: 'Google', value: data.googleUsers ?? 0, helper: 'OAuth signups' },
    { label: 'Email', value: data.emailUsers ?? 0, helper: 'Password signups' },
    { label: 'New Week', value: data.newThisWeek ?? 0, helper: 'Recent growth' },
  ]
})

const recentUsers = computed(() => overview.value?.recentUsers || [])

onMounted(async () => {
  await refreshAdminData()
})

async function refreshAdminData(page = 1) {
  error.value = ''
  await Promise.all([loadOverview(), loadUsers(page)])
}

async function loadOverview() {
  overview.value = await userStore.fetchAdminOverview()
}

async function loadUsers(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const data = await userStore.fetchAdminUsers({ page, search: search.value })
    users.value = data.data || []
    pagination.value = data
  } catch (e) {
    error.value = e.response?.data?.message || 'Admin users could not be loaded.'
  } finally {
    loading.value = false
  }
}

async function changeRole(account, role) {
  if (role === account.role) return

  savingId.value = account.id
  notice.value = ''
  error.value = ''
  try {
    const updated = await userStore.updateAdminUser(account.id, { role })
    account.role = updated.role
    notice.value = `${account.name} is now ${updated.role}.`
    await loadOverview()
    if (account.id === userStore.user?.id) {
      await userStore.fetchUser()
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Role could not be updated.'
    await loadUsers(pagination.value.current_page || 1)
  } finally {
    savingId.value = null
  }
}

async function removeUser(account) {
  const confirmed = window.confirm(`Delete ${account.name}? This cannot be undone.`)
  if (!confirmed) return

  savingId.value = account.id
  notice.value = ''
  error.value = ''
  try {
    await userStore.deleteAdminUser(account.id)
    notice.value = `${account.name} was deleted.`
    await refreshAdminData(pagination.value.current_page || 1)
  } catch (e) {
    error.value = e.response?.data?.message || 'User could not be deleted.'
  } finally {
    savingId.value = null
  }
}

function formatDate(value) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

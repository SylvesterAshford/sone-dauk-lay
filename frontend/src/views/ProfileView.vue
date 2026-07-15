<template>
  <div class="min-h-screen px-5 py-8 text-slate-100 sm:px-8">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between">
        <RouterLink class="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-slate-800" to="/dashboard">
          Back to Dashboard
        </RouterLink>
        <button class="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700" @click="handleLogout">
          Logout
        </button>
      </div>

      <section class="myanmar-frame rounded-2xl bg-slate-950/85 p-6 shadow-2xl shadow-black/25 sm:p-8">
        <div class="relative">
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">San Dauk Lay profile</p>
          <div class="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            <img v-if="avatarUrl" class="size-20 rounded-xl object-cover" :src="avatarUrl" alt="" />
            <div v-else class="grid size-20 place-items-center rounded-xl bg-cyan-300 text-2xl font-black text-slate-950">
              {{ initials }}
            </div>
            <div>
              <h1 class="text-3xl font-black text-white">{{ displayName }}</h1>
              <p class="mt-2 text-slate-400">{{ userStore.user?.email || 'Email will appear after Google login' }}</p>
            </div>
          </div>

          <dl class="mt-8 grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              <dt class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Role</dt>
              <dd class="mt-2 font-black text-white">{{ userStore.isAdmin ? 'Admin' : 'User' }}</dd>
            </div>
            <div class="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              <dt class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Provider</dt>
            <dd class="mt-2 font-black text-white">{{ userStore.user?.provider || 'Email / Google ready' }}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const router = useRouter()

const displayName = computed(() => userStore.user?.name || 'Detective')
const avatarUrl = computed(() => userStore.user?.avatar || userStore.user?.picture || userStore.user?.google_avatar)
const initials = computed(() => displayName.value.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase())

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

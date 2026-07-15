<template>
  <div class="min-h-screen text-slate-100">
    <aside class="fixed inset-y-0 left-0 hidden w-24 border-r border-slate-800 bg-slate-950/95 px-4 py-5 lg:block">
      <RouterLink class="mx-auto grid size-12 place-items-center rounded-xl bg-cyan-300 text-xs font-black text-slate-950" to="/">
        SDL
      </RouterLink>
      <nav class="mt-8 grid gap-3">
        <RouterLink class="grid size-12 place-items-center rounded-xl bg-cyan-300/15 text-xs font-black text-cyan-100" to="/dashboard">Home</RouterLink>
        <RouterLink class="grid size-12 place-items-center rounded-xl text-xs font-black text-slate-400 hover:bg-slate-900 hover:text-white" to="/safety-check">Safe</RouterLink>
        <RouterLink class="grid size-12 place-items-center rounded-xl text-xs font-black text-slate-400 hover:bg-slate-900 hover:text-white" to="/academy">Learn</RouterLink>
        <RouterLink class="grid size-12 place-items-center rounded-xl text-xs font-black text-slate-400 hover:bg-slate-900 hover:text-white" to="/profile">Me</RouterLink>
        <RouterLink v-if="userStore.isAdmin" class="grid size-12 place-items-center rounded-xl text-xs font-black text-slate-400 hover:bg-slate-900 hover:text-white" to="/admin">Admin</RouterLink>
      </nav>
    </aside>

    <div class="lg:pl-24">
      <header class="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 px-5 py-4 backdrop-blur sm:px-8">
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="text-sm font-bold uppercase tracking-[0.2em] text-cyan-100/70">San Dauk Lay</p>
            <h1 class="truncate text-2xl font-black text-white">Hi, {{ displayName }}</h1>
          </div>

          <div class="flex items-center gap-3">
            <RouterLink class="hidden rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-slate-800 sm:inline-flex" to="/profile">
              Profile
            </RouterLink>
            <RouterLink v-if="userStore.isAdmin" class="hidden rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-200 sm:inline-flex" to="/admin">
              Admin
            </RouterLink>
            <button class="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700" @click="handleLogout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main class="px-5 py-7 sm:px-8">
        <section>
          <div class="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 class="text-4xl font-black text-white">Your safety tools</h2>
              <p class="mt-3 max-w-2xl text-base leading-7 text-slate-400">
                All prototype modules are available for the presentation.
              </p>
            </div>
            <span class="w-fit rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
              Prototype workspace
            </span>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="module in userModules"
              :key="module.title"
              class="group rounded-2xl border border-slate-800 bg-slate-950/75 p-5 shadow-xl shadow-black/20 hover:border-cyan-300/35 hover:bg-slate-900/80"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="grid size-14 place-items-center rounded-xl text-base font-black" :class="module.badgeClass">
                  {{ module.code }}
                </div>
                <span class="rounded-full px-3 py-1 text-xs font-bold" :class="module.statusClass">{{ module.status }}</span>
              </div>
              <h3 class="mt-5 text-xl font-black text-white">{{ module.title }}</h3>
              <p class="mt-3 min-h-20 text-base leading-7 text-slate-400">{{ module.description }}</p>
              <RouterLink
                class="mt-5 inline-flex rounded-xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 hover:bg-cyan-200"
                :to="module.path"
              >
                Open
              </RouterLink>
            </article>
          </div>
        </section>

        <section v-if="userStore.isAdmin" class="mt-10">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-2xl font-black text-white">Admin Modules</h2>
            <span class="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">Admin only</span>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <RouterLink v-for="module in adminModules" :key="module.title" class="rounded-2xl border border-slate-800 bg-slate-950/75 p-5 hover:border-cyan-300/35" :to="module.path">
              <div class="grid size-12 place-items-center rounded-xl bg-cyan-300/15 text-sm font-black text-cyan-100">{{ module.code }}</div>
              <h3 class="mt-5 font-black text-white">{{ module.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-400">{{ module.description }}</p>
            </RouterLink>
          </div>
        </section>
      </main>
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

const userModules = [
  {
    code: 'SC',
    title: 'Safety Check',
    description: 'A quick checklist for suspicious messages, links, and money requests.',
    path: '/safety-check',
    status: 'Ready',
    badgeClass: 'bg-cyan-300 text-slate-950',
    statusClass: 'bg-emerald-300/10 text-emerald-100',
  },
  {
    code: 'AI',
    title: 'AI Detective',
    description: 'Paste a suspicious message and highlight scam warning signs.',
    path: '/ai-detective',
    status: 'Ready',
    badgeClass: 'bg-fuchsia-300 text-slate-950',
    statusClass: 'bg-emerald-300/10 text-emerald-100',
  },
  {
    code: 'AC',
    title: 'Academy',
    description: 'Follow short lessons for passwords, links, and suspicious requests.',
    path: '/academy',
    status: 'Ready',
    badgeClass: 'bg-amber-200 text-slate-950',
    statusClass: 'bg-emerald-300/10 text-emerald-100',
  },
  {
    code: 'CW',
    title: 'Community Watch',
    description: 'Draft a local awareness report preview for scam patterns.',
    path: '/community-watch',
    status: 'Ready',
    badgeClass: 'bg-emerald-300 text-slate-950',
    statusClass: 'bg-emerald-300/10 text-emerald-100',
  },
]

const adminModules = [
  { code: 'UM', title: 'User Management', description: 'Manage learners, roles, and access.', path: '/admin' },
  { code: 'CM', title: 'Content Review', description: 'Review academy and report prototype content.', path: '/academy' },
  { code: 'RP', title: 'Reports', description: 'Preview community reports and safety patterns.', path: '/community-watch' },
]

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen text-slate-100">
    <header class="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <RouterLink to="/" class="flex items-center gap-3" aria-label="San Dauk Lay home">
        <span class="grid size-11 place-items-center rounded-xl bg-cyan-300 text-xs font-black text-slate-950 shadow-lg shadow-cyan-950/30">
          SDL
        </span>
        <span>
          <span class="block text-lg font-black tracking-wide text-white">San Dauk Lay</span>
          <span class="block text-sm font-semibold text-slate-400">စုံထောက်လေး</span>
        </span>
      </RouterLink>

      <nav class="flex items-center gap-2">
        <RouterLink class="rounded-xl border border-slate-700 px-4 py-2.5 text-base font-bold text-slate-100 hover:bg-slate-800" to="/">
          Home
        </RouterLink>
        <RouterLink class="hidden rounded-xl bg-slate-800 px-4 py-2.5 text-base font-bold text-white hover:bg-slate-700 sm:inline-flex" to="/register">
          Register
        </RouterLink>
      </nav>
    </header>

    <main class="flex min-h-[calc(100vh-5.5rem)] items-center justify-center px-5 pb-12 pt-4 sm:px-8">
      <section class="w-full max-w-lg">
      <div class="rounded-2xl border border-slate-800 bg-slate-950/90 p-7 shadow-2xl shadow-black/45 sm:p-9">
        <div class="relative">
          <div class="mx-auto grid size-12 place-items-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30">
            SDL
          </div>

          <div class="mt-6 text-center">
            <h1 class="text-4xl font-black leading-tight text-white">Login</h1>
            <p class="mt-3 text-base leading-7 text-slate-400">
              Sign in to continue your safety practice.
            </p>
          </div>

          <button
            class="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 hover:bg-cyan-200"
            type="button"
            @click="userStore.loginWithGoogle"
          >
            <span class="grid size-7 place-items-center rounded-full bg-white text-sm font-black text-slate-950">G</span>
            Continue with Google
          </button>

          <div class="my-7 flex items-center gap-3">
            <span class="h-px flex-1 bg-slate-700" />
            <span class="text-xs font-black uppercase tracking-[0.18em] text-slate-500">email</span>
            <span class="h-px flex-1 bg-slate-700" />
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <label class="block">
              <span class="mb-2 block text-base font-bold text-slate-300">Email</span>
              <input
                v-model="email"
                class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-base text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"
                type="email"
                placeholder="name@example.com"
                required
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-base font-bold text-slate-300">Password</span>
              <input
                v-model="password"
                class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-base text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"
                type="password"
                placeholder="Enter your password"
                required
              />
            </label>

            <button
              class="w-full rounded-xl bg-white px-5 py-4 text-base font-black text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              :disabled="userStore.loading"
            >
              {{ userStore.loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>

          <p v-if="error" class="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
            {{ error }}
          </p>
        </div>
      </div>
    </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    await userStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || e.response?.data?.errors?.email?.[0] || 'Login failed'
  }
}
</script>

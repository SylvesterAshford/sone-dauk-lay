<template>
  <main class="flex min-h-screen items-center justify-center px-5 py-10 text-slate-100 sm:px-8">
    <section class="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/90 p-7 shadow-2xl shadow-black/45 sm:p-9">
      <div class="mx-auto grid size-12 place-items-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30">
        SDL
      </div>

      <div class="mt-6 text-center">
        <h1 class="text-4xl font-black leading-tight text-white">Create Account</h1>
        <p class="mt-3 text-base leading-7 text-slate-400">Start your safety practice workspace.</p>
      </div>

      <form class="mt-7 space-y-5" @submit.prevent="handleRegister">
        <label class="block">
          <span class="mb-2 block text-base font-bold text-slate-300">Full Name</span>
          <input
            v-model="name"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-base text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"
            placeholder="Your name"
            required
          />
        </label>

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
            placeholder="Minimum 8 characters"
            required
          />
        </label>

        <button
          class="w-full rounded-xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          :disabled="userStore.loading"
        >
          {{ userStore.loading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <p class="mt-5 text-center text-sm text-slate-400">
        Already have an account?
        <RouterLink class="font-black text-cyan-100 hover:text-white" to="/login">Login</RouterLink>
      </p>

      <p v-if="error" class="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
        {{ error }}
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function handleRegister() {
  error.value = ''
  try {
    await userStore.register(name.value, email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.errors?.email?.[0] || 'Registration failed'
  }
}
</script>

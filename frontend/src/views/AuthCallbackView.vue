<template>
  <main class="flex min-h-screen items-center justify-center px-5 py-12 text-slate-100 sm:px-8">
    <section class="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/90 p-7 text-center shadow-2xl shadow-black/45 sm:p-9">
      <div class="relative">
        <div class="mx-auto grid size-12 place-items-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30">
          SDL
        </div>
        <h1 class="mt-6 text-4xl font-black leading-tight text-white">{{ title }}</h1>
        <p class="mx-auto mt-4 max-w-md text-base leading-7 text-slate-400">{{ message }}</p>
        <p v-if="errorCode" class="mx-auto mt-4 max-w-sm rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
          Error: {{ errorCode }}
        </p>
      </div>
      <RouterLink
        v-if="error"
        class="relative mt-7 inline-flex rounded-xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 hover:bg-cyan-200"
        to="/login"
      >
        Back to Login
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const error = ref('')
const errorCode = computed(() => error.value ? error.value.replaceAll('_', ' ') : '')

const title = computed(() => (error.value ? 'Google login failed' : 'Finishing sign in'))
const message = computed(() => {
  if (error.value === 'email_required') {
    return 'Google did not return an email address. Please use an account with a verified email.'
  }

  if (error.value === 'google_not_configured') {
    return 'Google login needs a Client ID and Client Secret in the Laravel .env file first.'
  }

  if (error.value === 'google_ssl_failed') {
    return 'Laravel could not verify Google HTTPS. The local PHP certificate file has been configured; go back and start a fresh Google login.'
  }

  if (error.value === 'missing_token') {
    return 'The login callback did not include a session token. Please try again.'
  }

  if (error.value) {
    return 'Google reached the app, but Laravel could not finish the sign in. Please try again after the local SSL fix.'
  }

  return 'Securing your session and opening your dashboard.'
})

onMounted(async () => {
  const authError = route.query.error
  const authToken = route.query.token

  if (typeof authError === 'string') {
    error.value = authError
    return
  }

  if (typeof authToken !== 'string' || !authToken) {
    error.value = 'missing_token'
    return
  }

  userStore.acceptToken(authToken)
  await userStore.fetchUser()
  router.replace('/dashboard')
})
</script>

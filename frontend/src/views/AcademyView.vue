<template>
  <div class="min-h-screen px-5 py-8 text-slate-100 sm:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="mb-6 flex items-center justify-between">
        <RouterLink class="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-slate-800" to="/dashboard">
          Back
        </RouterLink>
        <RouterLink class="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700" to="/profile">
          Profile
        </RouterLink>
      </div>

      <header class="mb-8">
        <p class="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Learning path</p>
        <h1 class="mt-3 text-4xl font-black text-white">Safety Academy</h1>
        <p class="mt-3 max-w-2xl leading-7 text-slate-400">Short lessons for common online scam situations. Check lessons off as you present the prototype.</p>
      </header>

      <section class="grid gap-4 md:grid-cols-2">
        <label v-for="lesson in lessons" :key="lesson.title" class="flex cursor-pointer gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 hover:border-cyan-300/35">
          <input v-model="completed" class="mt-1 size-5 accent-cyan-300" type="checkbox" :value="lesson.title" />
          <span>
            <span class="block text-xl font-black text-white">{{ lesson.title }}</span>
            <span class="mt-2 block text-sm leading-6 text-slate-400">{{ lesson.description }}</span>
          </span>
        </label>
      </section>

      <aside class="mt-8 rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Progress</p>
            <p class="mt-2 text-3xl font-black text-white">{{ completed.length }} / {{ lessons.length }} lessons</p>
          </div>
          <button class="rounded-xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 hover:bg-cyan-200" @click="completed = []">
            Reset
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const completed = ref([])
const lessons = [
  { title: 'Check the sender', description: 'Compare names, phone numbers, and domains before trusting a message.' },
  { title: 'Protect OTP codes', description: 'One-time passwords are keys. Never share them in chat or over a phone call.' },
  { title: 'Pause money pressure', description: 'Urgent transfer requests should be verified with another trusted channel.' },
  { title: 'Inspect links', description: 'Look for misspellings, strange endings, and shortened links before clicking.' },
  { title: 'Save evidence', description: 'Screenshots and timestamps help trusted adults, banks, or support teams review scams.' },
  { title: 'Report safely', description: 'Use official platform report tools and avoid arguing with suspicious accounts.' },
]
</script>

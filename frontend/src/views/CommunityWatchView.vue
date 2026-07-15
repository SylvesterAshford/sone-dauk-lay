<template>
  <div class="min-h-screen px-5 py-8 text-slate-100 sm:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="mb-6 flex items-center justify-between">
        <RouterLink class="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-slate-800" to="/dashboard">
          Back
        </RouterLink>
        <RouterLink class="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700" to="/ai-detective">
          AI Detective
        </RouterLink>
      </div>

      <section class="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Community prototype</p>
          <h1 class="mt-3 text-4xl font-black text-white">Community Watch</h1>
          <p class="mt-3 max-w-2xl leading-7 text-slate-400">Create a local awareness report preview. This stays on your screen only for the prototype demo.</p>

          <form class="mt-8 grid gap-4" @submit.prevent>
            <label class="block">
              <span class="mb-2 block text-base font-bold text-slate-300">Scam type</span>
              <select v-model="type" class="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-base text-white outline-none focus:border-cyan-300">
                <option>Fake shop</option>
                <option>Phishing link</option>
                <option>OTP request</option>
                <option>Money emergency</option>
                <option>Prize message</option>
              </select>
            </label>
            <label class="block">
              <span class="mb-2 block text-base font-bold text-slate-300">Where it appeared</span>
              <input v-model="channel" class="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-base text-white outline-none focus:border-cyan-300" placeholder="SMS, Facebook, Telegram, email" />
            </label>
            <label class="block">
              <span class="mb-2 block text-base font-bold text-slate-300">What happened</span>
              <textarea v-model="details" class="min-h-40 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-base text-white outline-none focus:border-cyan-300" placeholder="Short summary for awareness" />
            </label>
          </form>
        </div>

        <aside class="h-fit rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-black/25">
          <p class="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Report Preview</p>
          <h2 class="mt-3 text-2xl font-black text-white">{{ type }}</h2>
          <p class="mt-2 text-sm font-bold text-cyan-100">{{ channel || 'Channel not added yet' }}</p>
          <p class="mt-5 min-h-32 whitespace-pre-wrap rounded-xl bg-slate-900/70 p-4 text-sm leading-6 text-slate-300">{{ details || 'Add details to preview a community awareness report.' }}</p>
          <p class="mt-4 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
            Prototype note: reports are not submitted to a live database yet.
          </p>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const type = ref('Phishing link')
const channel = ref('')
const details = ref('')
</script>

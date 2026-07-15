<template>
  <div class="min-h-screen px-5 py-8 text-slate-100 sm:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="mb-6 flex items-center justify-between">
        <RouterLink class="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-slate-800" to="/dashboard">
          Back
        </RouterLink>
        <RouterLink class="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700" to="/safety-check">
          Safety Check
        </RouterLink>
      </div>

      <section class="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Prototype module</p>
          <h1 class="mt-3 text-4xl font-black text-white">AI Detective</h1>
          <p class="mt-3 max-w-2xl leading-7 text-slate-400">
            Paste a suspicious message and the prototype highlights common warning signs. This is rule-based for demo safety, not a real AI judgment.
          </p>

          <label class="mt-8 block">
            <span class="mb-2 block text-base font-bold text-slate-300">Suspicious message</span>
            <textarea
              v-model="message"
              class="min-h-56 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-base text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"
              placeholder="Paste SMS, chat, email, or social message here"
            />
          </label>

          <div class="mt-4 flex flex-wrap gap-3">
            <button class="rounded-xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 hover:bg-cyan-200" @click="loadExample">
              Load Example
            </button>
            <button class="rounded-xl border border-slate-700 px-5 py-3 text-base font-bold text-slate-100 hover:bg-slate-800" @click="message = ''">
              Clear
            </button>
          </div>
        </div>

        <aside class="h-fit rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-black/25">
          <p class="text-sm font-bold text-slate-300">Detected signs</p>
          <div class="mt-5 text-6xl font-black" :class="result.colorClass">{{ matches.length }}</div>
          <p class="mt-2 text-xl font-black text-white">{{ result.title }}</p>
          <p class="mt-3 text-sm leading-6 text-slate-400">{{ result.message }}</p>

          <div class="mt-6 grid gap-2">
            <span v-for="match in matches" :key="match.label" class="rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-cyan-100">
              {{ match.label }}
            </span>
            <span v-if="matches.length === 0" class="rounded-xl bg-slate-900 px-3 py-2 text-sm text-slate-500">
              No warning words found yet.
            </span>
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const message = ref('')

const rules = [
  { label: 'Urgent pressure', pattern: /urgent|today|immediately|limited|expire|now/i },
  { label: 'Money request', pattern: /money|transfer|fee|gift card|loan|payment|bank/i },
  { label: 'Private code request', pattern: /otp|password|pin|verification code|login code/i },
  { label: 'Suspicious link', pattern: /http|www\.|\.click|bit\.ly|tinyurl/i },
  { label: 'Prize or reward bait', pattern: /winner|prize|reward|bonus|free/i },
]

const matches = computed(() => rules.filter((rule) => rule.pattern.test(message.value)))

const result = computed(() => {
  if (matches.value.length >= 3) {
    return {
      title: 'High risk',
      message: 'Stop before replying. Verify through an official channel and do not send money or codes.',
      colorClass: 'text-red-200',
    }
  }

  if (matches.value.length >= 1) {
    return {
      title: 'Needs review',
      message: 'There are warning signs. Slow down and ask someone trusted to check it with you.',
      colorClass: 'text-yellow-200',
    }
  }

  return {
    title: 'No signs found',
    message: 'This simple prototype did not find obvious warning words. Still verify before trusting it.',
    colorClass: 'text-emerald-200',
  }
})

function loadExample() {
  message.value = 'URGENT: Your bank account will expire today. Click http://secure-bank.example.click and send your OTP to receive a reward.'
}
</script>

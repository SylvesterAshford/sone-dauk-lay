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

      <section class="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">San Dauk Lay module</p>
          <h1 class="mt-3 text-4xl font-black text-white">Safety Check</h1>
          <p class="mt-3 max-w-2xl leading-7 text-slate-400">
            Before you reply, pay, click, or share information, check the message against these common scam signs.
          </p>

          <div class="mt-8 grid gap-3">
            <label
              v-for="item in checks"
              :key="item.id"
              class="flex cursor-pointer gap-4 rounded-xl border border-slate-800 bg-slate-950/75 p-4 hover:border-cyan-300/35"
            >
              <input v-model="selected" class="mt-1 size-5 accent-cyan-300" type="checkbox" :value="item.id" />
              <span>
                <span class="block font-black text-white">{{ item.title }}</span>
                <span class="mt-1 block text-sm leading-6 text-slate-400">{{ item.description }}</span>
              </span>
            </label>
          </div>
        </div>

        <aside class="myanmar-frame h-fit rounded-2xl bg-slate-950/90 p-6 shadow-2xl shadow-black/25">
          <div class="relative">
            <p class="text-sm font-bold text-slate-300">Risk score</p>
            <div class="mt-5 text-6xl font-black" :class="result.colorClass">{{ selected.length }}</div>
            <p class="mt-2 text-xl font-black text-white">{{ result.title }}</p>
            <p class="mt-3 text-sm leading-6 text-slate-400">{{ result.message }}</p>

            <button class="mt-6 w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200" @click="reset">
              Reset Check
            </button>
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const selected = ref([])

const checks = [
  {
    id: 'urgent',
    title: 'They pressure you to act now',
    description: 'Scammers often use fear, deadlines, or fake emergencies.',
  },
  {
    id: 'money',
    title: 'They ask for money or gift cards',
    description: 'Unusual payment requests are a strong danger sign.',
  },
  {
    id: 'link',
    title: 'The link or sender looks strange',
    description: 'Check spelling, domains, and unknown shortened links.',
  },
  {
    id: 'private',
    title: 'They request passwords, OTP, or private data',
    description: 'Real services should not ask for your one-time code or password.',
  },
  {
    id: 'too-good',
    title: 'The offer feels too good to be true',
    description: 'Prizes, jobs, loans, and discounts can be bait.',
  },
]

const result = computed(() => {
  if (selected.value.length >= 3) {
    return {
      title: 'High risk',
      message: 'Do not continue yet. Save evidence, avoid payment, and ask someone trusted to review it.',
      colorClass: 'text-red-200',
    }
  }

  if (selected.value.length >= 1) {
    return {
      title: 'Be careful',
      message: 'Something needs checking. Slow down, verify the sender, and avoid clicking unknown links.',
      colorClass: 'text-yellow-200',
    }
  }

  return {
    title: 'No signs selected',
    message: 'Still verify the sender before trusting the message. Safe habits work best when repeated.',
    colorClass: 'text-emerald-200',
  }
})

function reset() {
  selected.value = []
}
</script>

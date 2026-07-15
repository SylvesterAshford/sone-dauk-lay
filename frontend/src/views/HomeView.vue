<template>
  <div class="min-h-screen overflow-hidden text-slate-100">
    <header class="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
      <RouterLink to="/" class="flex items-center gap-3" aria-label="San Dauk Lay home">
        <span class="grid size-11 place-items-center rounded-xl bg-cyan-300 text-xs font-black text-slate-950 shadow-lg shadow-cyan-950/30">
          SDL
        </span>
        <span>
          <span class="block text-lg font-black tracking-wide">San Dauk Lay</span>
          <span class="block text-sm font-semibold text-slate-400">စုံထောက်လေး</span>
        </span>
      </RouterLink>

      <nav class="flex items-center gap-2">
        <RouterLink class="rounded-xl px-4 py-2.5 text-base font-bold text-slate-300 hover:bg-slate-800 hover:text-white" to="/">
          Home
        </RouterLink>
        <RouterLink class="rounded-xl bg-cyan-300 px-5 py-2.5 text-base font-black text-slate-950 hover:bg-cyan-200" to="/login">
          Login
        </RouterLink>
      </nav>
    </header>

    <main class="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1fr_0.9fr]">
      <section class="max-w-3xl">
        <p class="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-cyan-100">
          Myanmar digital safety
        </p>
        <h1 class="text-6xl font-black leading-tight text-white sm:text-8xl">
          San Dauk Lay
        </h1>
        <p class="mt-4 text-3xl font-black text-cyan-100 sm:text-4xl">
          စုံထောက်လေး
        </p>
        <p class="mt-7 max-w-2xl text-xl leading-9 text-slate-300">
          A friendly scam-safety workspace for students and everyday users. Learn warning signs, practice quick checks, and build safer habits one small module at a time.
        </p>
        <div class="mt-9 flex flex-wrap gap-3">
          <RouterLink class="rounded-xl bg-cyan-300 px-6 py-4 text-base font-black text-slate-950 hover:bg-cyan-200" to="/login">
            Start Safety Check
          </RouterLink>
          <a class="rounded-xl border border-slate-700 px-6 py-4 text-base font-black text-slate-100 hover:bg-slate-800" href="#preview">
            Preview Dashboard
          </a>
        </div>
      </section>

      <section id="preview" class="myanmar-frame rounded-2xl bg-slate-950/75 p-6 shadow-2xl shadow-black/30">
        <div class="relative">
          <div class="rounded-2xl bg-slate-900/70 p-6">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-black uppercase tracking-[0.2em] text-cyan-100/70">Dashboard preview</p>
                <h2 class="mt-2 text-3xl font-black text-white">Simple. Safe. Local.</h2>
              </div>
              <span class="rounded-full bg-emerald-300/15 px-4 py-1.5 text-sm font-black text-emerald-100">Ready</span>
            </div>

            <div class="mt-7 grid gap-4">
              <article v-for="step in steps" :key="step.title" class="flex gap-4 rounded-xl border border-slate-700/80 bg-slate-950/55 p-5">
                <span class="grid size-12 shrink-0 place-items-center rounded-lg bg-cyan-300/15 text-base font-black text-cyan-100">
                  {{ step.code }}
                </span>
                <span>
                  <span class="block text-lg font-black text-white">{{ step.title }}</span>
                  <span class="mt-1 block text-base leading-7 text-slate-400">{{ step.description }}</span>
                </span>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
const steps = [
  { code: '1', title: 'Open a module', description: 'Start with the quick Safety Check tool.' },
  { code: '2', title: 'Mark warning signs', description: 'Choose signs like urgent pressure, strange links, or OTP requests.' },
  { code: '3', title: 'Get a simple result', description: 'See whether to continue, slow down, or stop immediately.' },
]
</script>

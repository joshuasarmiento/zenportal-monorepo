<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Zap, HeartHandshake, ArrowRight, TrendingUp, ShieldCheck, Flag } from 'lucide-vue-next'
import { useHead } from '@unhead/vue'

useHead({
  title: 'About Us - Built by Filipinos for the Global Economy',
  meta: [
    { name: 'description', content: 'ZenPortal was built to help Filipino VAs and freelancers command higher rates and trust. Learn about our mission and story.' },
    { property: 'og:title', content: 'About ZenPortal - Our Mission' },
    { property: 'og:description', content: 'We believe Filipino talent is world-class. The tools we use should be too.' },
  ]
})
</script>

<template>
  <div
    class="min-h-screen font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">

    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      <div class="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]"></div>
      <div
        class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay">
      </div>
    </div>

    <section class="relative pt-32 pb-20 z-10">
      <div class="max-w-5xl mx-auto px-6 text-center">

        <div class="flex justify-center mb-8">
          <Badge variant="outline"
            class="rounded-full px-4 py-1 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-widest shadow-sm">
            Our Mission
          </Badge>
        </div>

        <h1
          class="text-5xl md:text-7xl font-semibold tracking-tighter text-zinc-900 dark:text-white mb-8 text-balance leading-[0.95]">
          Built by Filipinos, <br />
          for the <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Global
            Economy.</span>
        </h1>

        <p class="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed text-balance">
          We believe Filipino talent is world-class. The tools we use to manage that talent should be too.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 mb-32 relative z-10">
      <div class="grid md:grid-cols-2 gap-12 items-start">

        <div class="space-y-8 sticky top-24">
          <div class="space-y-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            <h2 class="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">The Story</h2>
            <p>
              For years, the standard for remote work in the Philippines was <span
                class="text-zinc-900 dark:text-white font-medium">low trust</span>. Clients demanded screenshots every
              10 minutes. Freelancers were treated like commodities, not partners.
            </p>
            <p>
              We built ZenPortal to break that cycle. We wanted a way to prove our value to clients in New York, London,
              and Sydney without sacrificing our dignity, privacy, or <span
                class="text-zinc-900 dark:text-white font-medium underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4">monthly
                earnings on expensive software.</span>
            </p>
            <p>
              It started as a simple internal tool for a small dev team in Bicol. Today, it's helping thousands of VAs
              transition from "employee" to "consultant" by using smart, free tools to look professional.
            </p>
          </div>

          <div class="pt-4">
            <div
              class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Flag class="w-4 h-4 text-blue-600" />
              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Headquartered in Bicol,
                Philippines</span>
            </div>
          </div>
        </div>

        <div class="relative space-y-6">
          <div
            class="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/50 to-purple-500/50 hidden md:block">
          </div>

          <Card
            class="relative ml-0 md:ml-12 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
            <CardContent class="p-6 flex items-start gap-5">
              <div
                class="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50 group-hover:scale-110 transition-transform duration-500">
                <MapPin class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="font-bold text-zinc-900 dark:text-white mb-2 text-lg">Local Roots, Global Reach</h3>
                <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Proudly developed in the province. We understand the unique challenges of PH internet infrastructure,
                  power outages, and time zones.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            class="relative ml-0 md:ml-12 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
            <CardContent class="p-6 flex items-start gap-5">
              <div
                class="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/50 group-hover:scale-110 transition-transform duration-500">
                <Zap class="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="font-bold text-zinc-900 dark:text-white mb-2 text-lg">Pinoy "Diskarte"</h3>
                <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  We integrate with free tools like <strong class="text-zinc-900 dark:text-white font-medium">Google
                    Drive & Screenity</strong> so you don't need to pay for Loom or Dropbox just to look professional.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            class="relative ml-0 md:ml-12 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
            <CardContent class="p-6 flex items-start gap-5">
              <div
                class="h-12 w-12 rounded-2xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center shrink-0 border border-pink-100 dark:border-pink-900/50 group-hover:scale-110 transition-transform duration-500">
                <HeartHandshake class="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 class="font-bold text-zinc-900 dark:text-white mb-2 text-lg">Partner, not Employee</h3>
                <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Our UI is designed to make you look like a premium agency, allowing you to justify higher rates and
                  gain client respect.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section
      class="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 py-20 relative z-10">
      <div class="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-center">
        <div class="group">
          <div
            class="text-4xl md:text-5xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
            100%</div>
          <div class="text-sm font-medium uppercase tracking-widest text-zinc-500">Free for Starters</div>
        </div>
        <div class="group">
          <div
            class="text-4xl md:text-5xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-red-500 transition-colors">
            0</div>
          <div class="text-sm font-medium uppercase tracking-widest text-zinc-500">Screenshots Taken</div>
        </div>
        <div class="group">
          <div
            class="text-4xl md:text-5xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-green-500 transition-colors">
            24/7</div>
          <div class="text-sm font-medium uppercase tracking-widest text-zinc-500">Portal Uptime</div>
        </div>
        <div class="group">
          <div
            class="text-4xl md:text-5xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-yellow-500 transition-colors">
            PH</div>
          <div class="text-sm font-medium uppercase tracking-widest text-zinc-500">Made with Pride</div>
        </div>
      </div>
    </section>

    <section class="py-32 px-6 bg-zinc-950 text-white text-center relative overflow-hidden">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-purple-600/20 blur-[100px] pointer-events-none rounded-full">
      </div>

      <div class="relative z-10 max-w-3xl mx-auto">
        <h2 class="text-4xl md:text-6xl font-semibold tracking-tighter mb-8">Join the movement.</h2>
        <p class="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
          Stop letting clients treat you like a robot. Start managing your work like a legitimate business.
        </p>

        <div class="flex flex-col items-center gap-6">
          <Button size="lg"
            class="h-12 px-10 rounded-full bg-white text-black hover:bg-zinc-200 text-base font-medium transition-transform hover:scale-105"
            as-child>
            <router-link to="/sign-up">Create Free Account
              <ArrowRight class="ml-2 h-4 w-4" />
            </router-link>
          </Button>
          <div class="flex items-center gap-6 text-sm text-zinc-500">
            <span class="flex items-center gap-2">
              <ShieldCheck class="w-4 h-4" /> No spyware
            </span>
            <span class="flex items-center gap-2">
              <TrendingUp class="w-4 h-4" /> Increase earnings
            </span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
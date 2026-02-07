<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { SpeedInsights } from '@vercel/speed-insights/vue';
import { useHead } from '@unhead/vue'
import { Motion, AnimatePresence } from 'motion-v'

useHead({
  title: 'ZenPortal - Modern Client Portal Solution',
  titleTemplate: '%s | ZenPortal',
  meta: [
    { name: 'description', content: 'Transform your client experience with ZenPortal. A modern, secure, and customizable client portal for your business.' },
    { property: 'og:site_name', content: 'ZenPortal' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>

<template>
  <SpeedInsights />
  <div class="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50">
    <div class="pointer-events-none fixed inset-0 z-100 h-full w-full opacity-20 mix-blend-overlay">
      <div
        class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100 brightness-100 contrast-150">
      </div>
    </div>

    <AppHeader />

    <main class="relative z-10">
      <router-view v-slot="{ Component }">
        <AnimatePresence mode="wait">
          <Motion
            v-if="Component"
            :key="$route.path"
            :initial="{ opacity: 0, y: 10, filter: 'blur(10px)' }"
            :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
            :exit="{ opacity: 0, y: -10, filter: 'blur(10px)' }"
            :transition="{ duration: 0.3, ease: 'easeOut' }"
          >
            <component :is="Component" />
          </Motion>
        </AnimatePresence>
      </router-view>
    </main>

    <AppFooter />
  </div>
</template>
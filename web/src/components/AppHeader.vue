<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import ModeToggle from '@/components/ModeToggle.vue'
import { Zap } from 'lucide-vue-next'

const isScrolled = ref(false)

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
}

const appUrl = import.meta.env.VITE_APP_URL
</script>

<template>
  <nav :class="['fixed top-0 w-full z-50 transition-all duration-300', isScrolled ? 'border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/60 backdrop-blur-xl' : 'bg-transparent border-transparent']">
    <div class="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
      <router-link to="/" class="flex items-center gap-2 font-bold text-xl tracking-tighter">
        <div class="bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg p-1.5 text-white shadow-lg shadow-blue-500/20">
          <Zap class="h-5 w-5 fill-white" />
        </div>
        <span class="bg-clip-text text-transparent bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">ZenPortal</span>
      </router-link>
      <div class="flex items-center gap-4 md:gap-6">
        <ModeToggle />
        <a :href="`${appUrl}`" target="__blank" class="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white transition hidden sm:block">Log in</a>
        <Button class="rounded-full px-6 font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg shadow-zinc-500/20 dark:shadow-none" as-child>
          <router-link to="/pricing">Simulan Mo Na</router-link>
        </Button>
      </div>
    </div>
  </nav>
</template>

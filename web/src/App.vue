<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50">
    <div class="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-20 mix-blend-overlay">
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100 brightness-100 contrast-150"></div>
    </div>
    
    <AppHeader />
    
    <main class="relative z-10">
      <router-view />
    </main>
    
    <AppFooter />
  </div>
</template>
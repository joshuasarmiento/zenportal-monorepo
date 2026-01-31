<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-30 mix-blend-overlay">
    <div class="absolute inset-0 bg-[url('@/assets/grain.svg')] opacity-50 brightness-100 contrast-150"></div>
  </div>
  <AppHeader />
  <main>
    <router-view />
  </main>
  <AppFooter />
</template>

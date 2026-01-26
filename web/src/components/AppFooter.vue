<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
</script>

<template>
  <footer class="py-12 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-center relative z-10">
    <div class="flex items-center justify-center gap-2 font-bold text-xl tracking-tight mb-8 text-zinc-500 dark:text-zinc-600">
        <Zap class="h-5 w-5 fill-zinc-400 dark:fill-zinc-600" /> ZenPortal
    </div>
    <div class="flex justify-center flex-wrap gap-8 mb-8 text-sm font-medium text-zinc-600 dark:text-zinc-500">
      <router-link to="/features" class="hover:text-blue-600 dark:hover:text-white transition">Features</router-link>
      <router-link to="/pricing" class="hover:text-blue-600 dark:hover:text-white transition">Pricing</router-link>
      <router-link to="/about" class="hover:text-blue-600 dark:hover:text-white transition">About</router-link>
      <router-link to="/privacy-policy" class="hover:text-blue-600 dark:hover:text-white transition">Privacy Policy</router-link>
      <router-link to="/terms" class="hover:text-blue-600 dark:hover:text-white transition">Terms & Condition</router-link>
    </div>
    <p class="text-sm text-zinc-500 dark:text-zinc-600 mb-6">
      <!-- Made with <Heart class="inline h-3 w-3 text-red-500 fill-red-500 mx-1" /> by <span class="font-semibold text-zinc-700 dark:text-zinc-400">Joshua</span>. -->
      <br class="block sm:hidden" /> &copy; {{ new Date().getFullYear() }} ZenPortal.
    </p>
    <div class="flex justify-center gap-4 text-xs text-zinc-400 dark:text-zinc-700 font-mono uppercase tracking-widest">
      <span>Manila</span> • <span>Cebu</span> • <span>Davao</span> • <span>Bicol</span> • <span>Global</span>
    </div>
  </footer>
</template>

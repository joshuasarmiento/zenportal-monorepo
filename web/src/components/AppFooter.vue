<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
</script>

<template>
  <footer class="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-center relative z-10 overflow-hidden">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-500/5 blur-[100px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="flex flex-col items-center justify-center mb-12">
        <div class="flex items-center gap-2 font-bold text-2xl tracking-tighter text-zinc-900 dark:text-white mb-2">
            <div class="bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-lg">
               <Zap class="h-5 w-5 fill-zinc-900 dark:fill-white text-zinc-900 dark:text-white" />
            </div>
            ZenPortal
        </div>
        <p class="text-zinc-500 text-sm">Empowering the Filipino Gig Economy.</p>
      </div>

      <nav class="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        <router-link to="/features" class="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</router-link>
        <router-link to="/pricing" class="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</router-link>
        <router-link to="/about" class="hover:text-zinc-900 dark:hover:text-white transition-colors">About</router-link>
        <router-link to="/privacy-policy" class="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</router-link>
        <router-link to="/terms" class="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</router-link>
      </nav>

      <div class="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-100 dark:border-zinc-900 gap-4">
        <p class="text-xs text-zinc-400 dark:text-zinc-600 font-mono">
          &copy; {{ new Date().getFullYear() }} ZenPortal. All rights reserved.
        </p>
        <div class="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-700 font-mono select-none">
          <span>MNL</span>
          <span>CEB</span>
          <span>DVO</span>
          <span>LGP</span>
          <span>NYC</span>
        </div>
      </div>
    </div>
  </footer>
</template>
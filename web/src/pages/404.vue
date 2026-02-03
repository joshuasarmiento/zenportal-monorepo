<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-vue-next'
import BackgroundNoise from '@/components/ui/background-noise/BackgroundNoise.vue'
</script>

<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-zinc-950 text-center px-6 relative overflow-hidden font-sans">
    
    <BackgroundNoise />

    <div class="relative z-10">
      <h1 class="text-[10rem] md:text-[12rem] font-black tracking-tighter leading-none bg-gradient-to-b from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent bg-clip-text text-transparent select-none">
        404
      </h1>
      <div class="-mt-12 mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">Page not found</h2>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-balance">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div class="flex items-center justify-center gap-4">
        <Button variant="outline" size="lg" class="rounded-full border-zinc-200 dark:border-zinc-800" @click="$router.back()">
           <ArrowLeft class="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Button size="lg" class="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200" as-child>
           <router-link to="/">
             <Home class="mr-2 h-4 w-4" /> Go Home
           </router-link>
        </Button>
      </div>
    </div>
  </div>
</template>
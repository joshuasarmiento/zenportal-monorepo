<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-vue-next'
import BackgroundNoise from '@/components/ui/background-noise/BackgroundNoise.vue'
</script>

<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-background text-center px-6 relative overflow-hidden font-sans">
    
    <BackgroundNoise />

    <div class="relative z-10">
      <h1 class="text-[10rem] md:text-[12rem] font-black tracking-tighter leading-none bg-linear-to-b from-foreground/20 to-transparent bg-clip-text text-transparent select-none">
        404
      </h1>
      <div class="-mt-12 mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-foreground mb-3">Page not found</h2>
        <p class="text-muted-foreground max-w-md mx-auto text-balance">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div class="flex items-center justify-center gap-4">
        <Button variant="outline" size="lg" class="rounded-full border-border" @click="$router.back()">
           <ArrowLeft class="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Button size="lg" class="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" as-child>
           <router-link to="/">
             <Home class="mr-2 h-4 w-4" /> Go Home
           </router-link>
        </Button>
      </div>
    </div>
  </div>
</template>
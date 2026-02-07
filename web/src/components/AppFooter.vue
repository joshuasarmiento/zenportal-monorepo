<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
</script>

<template>
  <footer class="py-20 border-t border-border bg-background text-center relative z-10 overflow-hidden">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-500/5 blur-[100px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="flex flex-col items-center justify-center mb-12">
        <div class="flex items-center gap-2 font-bold text-2xl tracking-tighter text-foreground mb-2">
            <div class="bg-muted p-1.5 rounded-lg">
               <Zap class="h-5 w-5 fill-foreground text-foreground" />
            </div>
            ZenPortal
        </div>
        <p class="text-muted-foreground text-sm">Empowering the Filipino Gig Economy.</p>
      </div>

      <nav class="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 text-sm font-medium text-muted-foreground">
        <router-link to="/features" class="hover:text-foreground transition-colors">Features</router-link>
        <router-link to="/pricing" class="hover:text-foreground transition-colors">Pricing</router-link>
        <router-link to="/about" class="hover:text-foreground transition-colors">About</router-link>
        <router-link to="/privacy-policy" class="hover:text-foreground transition-colors">Privacy Policy</router-link>
        <router-link to="/terms" class="hover:text-foreground transition-colors">Terms of Service</router-link>
      </nav>

      <div class="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
        <p class="text-xs text-muted-foreground font-mono">
          &copy; {{ new Date().getFullYear() }} ZenPortal. All rights reserved.
        </p>
        <div class="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 font-mono select-none">
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
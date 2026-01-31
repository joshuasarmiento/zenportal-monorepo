<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import ModeToggle from '@/components/ModeToggle.vue'
import { Zap, Menu, X } from 'lucide-vue-next'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Lock body scroll when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Close menu when a link is clicked
const closeMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const appUrl = import.meta.env.VITE_APP_URL
</script>

<template>
  <nav 
    :class="[
      'fixed top-0 w-full z-50 transition-all duration-500 ease-in-out', 
      isScrolled ? 'border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60' : 'bg-transparent border-transparent py-4'
    ]"
  >
    <div class="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
      
      <router-link to="/" class="flex items-center gap-2.5 group relative z-50" @click="closeMenu">
        <div class="bg-zinc-900 dark:bg-white text-white dark:text-black p-1.5 rounded-lg shadow-lg shadow-zinc-500/20 dark:shadow-white/20 transition-transform group-hover:scale-105 group-hover:rotate-3 duration-300">
          <Zap class="h-4 w-4 fill-current" />
        </div>
        <span class="font-bold text-xl tracking-tighter text-zinc-900 dark:text-white">ZenPortal</span>
      </router-link>

      <div class="hidden md:flex items-center gap-6">
        <div class="flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
           <router-link to="/features" class="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</router-link>
           <router-link to="/pricing" class="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</router-link>
        </div>
        
        <div class="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></div>

        <ModeToggle />
        
        <a :href="`${appUrl}`" target="__blank" class="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          Log in
        </a>
        
        <Button class="rounded-full h-10 px-6 text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]" as-child>
          <router-link to="/pricing">Get Started</router-link>
        </Button>
      </div>

      <div class="flex md:hidden items-center gap-4 relative z-50">
        <ModeToggle />
        <Button variant="ghost" size="icon" class="rounded-full" @click="toggleMobileMenu">
           <Menu v-if="!isMobileMenuOpen" class="w-5 h-5 text-zinc-900 dark:text-white" />
           <X v-else class="w-5 h-5 text-zinc-900 dark:text-white" />
        </Button>
      </div>

    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-white dark:bg-zinc-950 pt-28 px-6 md:hidden overflow-y-auto">
         <div class="flex flex-col space-y-2">
            <router-link to="/features" @click="closeMenu" class="text-2xl font-semibold text-zinc-900 dark:text-white py-4 border-b border-zinc-100 dark:border-zinc-800">Features</router-link>
            <router-link to="/pricing" @click="closeMenu" class="text-2xl font-semibold text-zinc-900 dark:text-white py-4 border-b border-zinc-100 dark:border-zinc-800">Pricing</router-link>
            <router-link to="/about" @click="closeMenu" class="text-2xl font-semibold text-zinc-900 dark:text-white py-4 border-b border-zinc-100 dark:border-zinc-800">About</router-link>
            
            <div class="pt-8 space-y-4">
              <a :href="`${appUrl}`" class="block text-center w-full py-3 text-zinc-600 dark:text-zinc-400 font-medium">Log in</a>
              <Button class="w-full rounded-full h-12 text-base font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-lg" as-child>
                <router-link to="/pricing" @click="closeMenu">Get Started</router-link>
              </Button>
            </div>
         </div>
      </div>
    </Transition>
  </nav>
</template>
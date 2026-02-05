<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { Toaster } from '@/components/ui/sonner'
import { Zap } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'
import 'vue-sonner/style.css'

// Initialize Theme: Dark by default
useColorMode({
  initialValue: 'dark',
})

const userStore = useUserStore()
</script>

<template>
  <div id="app"
    class="min-h-screen font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
    <div v-if="userStore.loading" class="min-h-screen flex flex-col items-center justify-center relative z-10">
      <div class="relative">
        <div class="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
        <div class="relative bg-zinc-900 dark:bg-white rounded-xl p-3 shadow-2xl animate-pulse">
          <Zap class="h-8 w-8 text-white dark:text-zinc-900 fill-current" />
        </div>
      </div>
    </div>

    <div v-else class="relative z-0">
      <router-view />
    </div>

    <Toaster position="bottom-right" theme="system" :toastOptions="{
      class: 'font-sans rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl',
    }" />
  </div>
</template>
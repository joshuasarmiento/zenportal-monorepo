<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { Toaster } from '@/components/ui/sonner'
import { Loader2, Zap } from 'lucide-vue-next'
import 'vue-sonner/style.css'

const userStore = useUserStore()
</script>

<template>
  <div id="app">
    <div v-if="userStore.loading" class="min-h-screen flex flex-col items-center justify-center bg-background">
      <div class="bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg animate-bounce p-1.5 text-white shadow-lg shadow-blue-500/20">
        <Zap class="h-6 w-6 fill-white" />
      </div>  
    </div>

    <div v-else class="min-h-screen bg-background text-foreground font-sans">
      <router-view />
    </div>
    
    <Toaster />
  </div>
</template> 
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { Toaster } from '@/components/ui/sonner'
import { Loader2 } from 'lucide-vue-next'
import 'vue-sonner/style.css'

const userStore = useUserStore()
</script>

<template>
  <div id="app">
    <div v-if="userStore.loading" class="min-h-screen flex items-center justify-center bg-background">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else class="min-h-screen bg-background text-foreground font-sans">
      <router-view />
    </div>
    
    <Toaster />
  </div>
</template> 
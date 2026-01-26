<script setup lang="ts">
import { useRoute } from 'vue-router'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/vue'
import { computed } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

const route = useRoute()

const isPublicPage = computed(() => route.meta.public)
</script>

<template>
  <div id="app">
    <div v-if="isPublicPage" class="min-h-screen bg-background text-foreground font-sans">
      <router-view />
    </div>

    <template v-else>
      <SignedIn>
        <div class="min-h-screen bg-background text-foreground font-sans">
          <router-view />
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </template>
    
    <Toaster />
  </div>
</template>
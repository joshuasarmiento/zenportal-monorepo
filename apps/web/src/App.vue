<script setup lang="ts">
import { useRoute } from 'vue-router'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/vue'
import { computed } from 'vue' 

const route = useRoute()

const isPublicPage = computed(() => route.meta.public)
</script>

<template>
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
</template>
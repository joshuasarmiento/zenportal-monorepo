<script setup lang="ts">
import { useRoute } from 'vue-router'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/vue'
import { computed } from 'vue' 

const route = useRoute()

const isPublicPage = computed(() => route.meta.public)
</script>

<template>
  <div v-if="isPublicPage" class="min-h-screen bg-gray-50">
    <router-view />
  </div>

  <template v-else>
    <SignedIn>
      <router-view />
    </SignedIn>

    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </template>
</template>
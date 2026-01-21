<script setup lang="ts">
import Sidebar from './components/layout/Sidebar.vue'
import { useRoute } from 'vue-router'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/vue'
import { computed } from 'vue' 

const route = useRoute()

const isPublicPage = computed(() => route.meta.public)
</script>

<template>
  <div v-if="isPublicPage" class="bg-gray-50 min-h-screen">
    <router-view />
  </div>

  <div v-else class="flex min-h-screen bg-gray-50 font-inter text-gray-800">
    <SignedIn>
      <Sidebar class="hidden md:flex" />
      <main class="flex-1 flex flex-col h-screen overflow-hidden">
        <div class="flex-1 overflow-y-auto">
           <router-view />
        </div>
      </main>
    </SignedIn>

    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </div>
</template>
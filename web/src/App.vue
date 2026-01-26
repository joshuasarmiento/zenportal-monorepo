<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <main class="pt-40">
    <router-view />
  </main>
  <AppFooter />
</template>

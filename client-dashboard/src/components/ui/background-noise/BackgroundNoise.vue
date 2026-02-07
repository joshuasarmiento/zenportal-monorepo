<script setup lang="ts">
import Noise from './Noise.vue'
</script>

<template>
  <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]"></div>
      <Noise class="opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
    </div>
</template>

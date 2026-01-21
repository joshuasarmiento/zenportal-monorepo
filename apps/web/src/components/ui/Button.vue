<script setup lang="ts">
defineProps<{ variant?: 'primary' | 'secondary' | 'danger' }>()
</script>

<template>
  <button 
    class="px-5 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition disabled:opacity-50"
    :class="{
      'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary' || !variant,
      'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50': variant === 'secondary',
      'bg-red-50 text-red-600 hover:bg-red-100': variant === 'danger'
    }"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ url: string }>()

const isLoom = computed(() => props.url.includes('loom.com/share'))
const embedUrl = computed(() => props.url.replace('/share/', '/embed/'))
</script>

<template>
  <div v-if="url" class="rounded-xl overflow-hidden bg-gray-900 shadow-sm border border-gray-200">
    
    <div v-if="isLoom" class="aspect-video w-full">
      <iframe 
        :src="embedUrl" 
        class="w-full h-full" 
        frameborder="0" 
        allowfullscreen
      ></iframe>
    </div>

    <a v-else :href="url" target="_blank" class="block p-6 hover:bg-gray-800 transition group">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white group-hover:bg-blue-600 transition">
          <i class="ph ph-play text-2xl"></i>
        </div>
        <div>
          <p class="font-bold text-white">Watch Video Attachment</p>
          <p class="text-xs text-gray-400 truncate max-w-md">{{ url }}</p>
        </div>
      </div>
    </a>
  </div>
</template>
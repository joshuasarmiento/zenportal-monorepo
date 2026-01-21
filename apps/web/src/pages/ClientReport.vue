<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchApi } from '../lib/api'
import LoomPlayer from '../components/video/LoomPlayer.vue'

const route = useRoute()
const token = route.params.token as string

const data = ref<any>(null)
const error = ref('')

onMounted(async () => {
  try {
    // Note: We use the full URL here or ensure api.ts handles public routes correctly
    // Since this is public, we might use standard fetch if we don't want to attach Clerk tokens
    // But our API wrapper is safe to use as it just attaches token IF it exists.
    // However, for public routes, we usually don't need the Clerk token.
    const res = await fetch(`${import.meta.env.VITE_API_URL}/public/report/${token}`)
    if (!res.ok) throw new Error('Report not found')
    data.value = await res.json()
  } catch (err) {
    error.value = 'This report link is invalid or expired.'
  }
})
</script>

<template>
  <div v-if="error" class="h-screen flex items-center justify-center text-center p-4">
    <div class="max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div class="text-4xl mb-4">🤔</div>
      <h1 class="text-xl font-bold mb-2">Link Not Found</h1>
      <p class="text-gray-500">{{ error }}</p>
    </div>
  </div>

  <div v-else-if="data" class="max-w-3xl mx-auto px-6 py-10 space-y-12">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-6">
      <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
        {{ data.client.owner.fullName?.[0] || 'V' }}
      </div>
      <div>
        <h1 class="font-bold text-gray-900 text-lg">{{ data.client.owner.fullName }}'s Updates</h1>
        <p class="text-sm text-gray-500">For: {{ data.client.companyName }}</p>
      </div>
    </div>

    <section v-for="log in data.logs" :key="log.id" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <LoomPlayer v-if="log.videoUrl" :url="log.videoUrl" />

      <div class="p-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-gray-800 text-lg">Update for {{ log.date }}</h3>
          <span v-if="log.isBlocked" class="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Action Required</span>
        </div>

        <div v-if="log.isBlocked" class="mb-6 bg-red-50 border border-red-100 p-4 rounded-lg flex gap-3">
          <i class="ph ph-warning-octagon text-red-500 text-xl"></i>
          <p class="text-red-800 text-sm font-medium">{{ log.blockerDetails }}</p>
        </div>

        <p class="text-gray-600 whitespace-pre-line leading-relaxed">{{ log.summary }}</p>
      </div>
    </section>
  </div>
</template>
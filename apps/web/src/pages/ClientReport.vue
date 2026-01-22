<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import LoomPlayer from '../components/video/LoomPlayer.vue'

const route = useRoute()
const token = route.params.token as string

const data = ref<any>(null)
const error = ref('')
const loading = ref(true)

// --- 1. Define Color Maps (Matches your Settings Page) ---
const bgColors: Record<string, string> = {
  indigo: 'bg-indigo-600',
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  rose: 'bg-rose-600',
  gray: 'bg-gray-900'
}

const textColors: Record<string, string> = {
  indigo: 'text-indigo-600',
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  rose: 'text-rose-600',
  gray: 'text-gray-900'
}

// --- 2. Computed Styles based on Owner Settings ---
const accentBg = computed(() => {
  const color = data.value?.client?.owner?.accentColor || 'indigo'
  return bgColors[color] || 'bg-indigo-600'
})

const accentText = computed(() => {
  const color = data.value?.client?.owner?.accentColor || 'indigo'
  return textColors[color] || 'text-indigo-600'
})

// Helper functions
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(date)
}

const formatSummary = (text: string) => {
  if (!text) return []
  return text.split('\n').filter(line => line.trim().length > 0)
}

const sortedLogs = computed(() => {
  if (!data.value?.logs) return []
  return [...data.value.logs].sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/public/report/${token}`)
    if (!res.ok) throw new Error('Report not found')
    data.value = await res.json()
  } catch (err) {
    error.value = 'This report link is invalid or expired.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="h-screen flex items-center justify-center bg-[#FAFAFA]">
    <div class="animate-spin w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full"></div>
  </div>

  <div v-else-if="error" class="h-screen flex items-center justify-center text-center p-4 bg-[#FAFAFA]">
    <div class="max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div class="text-4xl mb-4">🤔</div>
      <h1 class="text-xl font-bold mb-2">Link Not Found</h1>
      <p class="text-gray-500">{{ error }}</p>
    </div>
  </div>

  <div v-else-if="data" class="min-h-screen bg-[#FAFAFA] font-inter text-gray-800 pb-20">
    
    <div class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          
          <img 
            v-if="data.client.owner.avatarUrl" 
            :src="data.client.owner.avatarUrl" 
            class="w-10 h-10 rounded-lg object-cover border border-gray-100"
          >
          <div 
            v-else 
            class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
            :class="accentBg"
          >
             {{ data.client.owner.fullName?.[0] || 'A' }}
          </div>
          
          <div>
            <h1 class="font-bold text-gray-900 text-sm leading-tight">{{ data.client.owner.fullName }}'s Updates</h1>
            <p class="text-xs text-gray-500">For: {{ data.client.companyName }}</p>
          </div>
        </div>
        
        <a 
          :href="`mailto:${data.client.owner.email}`" 
          class="text-sm font-medium hover:opacity-80 transition flex items-center gap-2"
          :class="accentText"
        >
          <i class="ph ph-envelope-simple text-lg"></i> <span class="hidden sm:inline">Reply</span>
        </a>
      </div>
    </div>

    <main class="max-w-3xl mx-auto px-6 py-10 space-y-12">
      
      <div v-if="sortedLogs.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 text-3xl">
          📝
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">No Updates Yet</h2>
        <p class="text-gray-500 max-w-sm mx-auto">
          {{ data.client.owner.fullName }} hasn't posted any work logs for {{ data.client.companyName }} yet. Check back later!
        </p>
      </div>

      <section v-else v-for="log in sortedLogs" :key="log.id">
        
        <div v-if="log.isBlocked" class="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm animate-pulse">
            <div class="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                <i class="ph ph-warning-octagon text-2xl"></i>
            </div>
            <div class="flex-1">
                <h3 class="text-red-900 font-bold text-lg">Input Required</h3>
                <p class="text-red-800 mt-1 text-sm font-medium">{{ log.blockerDetails }}</p>
            </div>
        </div>

        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ formatDate(log.date) }}</h2>
            <span v-if="!log.isBlocked" class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">On Track</span>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition hover:shadow-md">
            
            <div v-if="log.videoUrl" class="bg-gray-900 border-b border-gray-100">
               <LoomPlayer :url="log.videoUrl" />
            </div>

            <div class="p-8">
                <h3 class="font-bold text-gray-800 text-lg mb-4">Accomplishments</h3>
                
                <ul class="space-y-4">
                    <li v-for="(line, i) in formatSummary(log.summary)" :key="i" class="flex gap-3">
                        <i class="ph ph-check-circle text-xl flex-shrink-0 mt-0.5" :class="accentText"></i>
                        <span class="text-gray-600 leading-relaxed">{{ line }}</span>
                    </li>
                </ul>

                <div class="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-2">
                      <i class="ph ph-clock text-lg"></i>
                      Logged: <span class="font-bold text-gray-900">{{ log.hoursWorked }} Hours</span>
                    </span>
                    
                    <span v-if="log.attachmentUrl" class="flex items-center gap-2">
                      <i class="ph ph-paperclip text-lg"></i>
                      Attachment: 
                      <a 
                        :href="log.attachmentUrl" 
                        target="_blank" 
                        class="font-medium hover:underline flex items-center gap-1"
                        :class="accentText"
                      >
                        View File <i class="ph ph-arrow-square-out"></i>
                      </a>
                    </span>
                </div>
            </div>
        </div>
      </section>

    </main>

    <footer class="text-center py-8 text-gray-400 text-sm">
      <p v-if="!data.client.owner.tier || data.client.owner.tier === 'free'">
          Report generated via <a href="/" class="font-medium hover:underline" :class="accentText">ZenPortal</a>
      </p>
      
      <p v-else class="text-gray-300 text-xs">
          &copy; {{ new Date().getFullYear() }} {{ data.client.owner.fullName }}
      </p>
    </footer>

  </div>
</template>
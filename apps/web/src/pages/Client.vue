<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchApi } from '../lib/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const clients = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')

onMounted(async () => {
  try {
    clients.value = await fetchApi('/clients')
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value
  return clients.value.filter(c => 
    c.companyName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const copyLink = (token: string) => {
  const url = `${window.location.origin}/c/${token}`
  navigator.clipboard.writeText(url)
  alert('Magic Link copied to clipboard!')
}

const goToAdd = () => router.push('/clients/new')
</script>

<template>
  <div class="h-full flex flex-col font-inter bg-[#F3F4F6]">
    
    <header class="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">My Clients</h2>
        <p class="text-sm text-gray-500">Manage access and view client details.</p>
      </div>
      <button @click="goToAdd" class="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition">
        <i class="ph ph-user-plus text-lg"></i>
        Add Client
      </button>
    </header>

    <div class="p-8 max-w-6xl mx-auto w-full space-y-6">

      <div class="flex gap-4 mb-4">
        <div class="relative flex-1 max-w-md">
          <i class="ph ph-magnifying-glass absolute left-3 top-3.5 text-gray-400"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search companies..." 
            class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
        </div>
        <select class="bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none cursor-pointer text-gray-700">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Archived</option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-400">Loading clients...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div v-for="(c, index) in filteredClients" :key="c.id" class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] rounded-xl p-6 hover:shadow-md transition group">
          <div class="flex justify-between items-start mb-4">
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
              :class="index % 2 === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'"
            >
              {{ c.companyName.substring(0, 2).toUpperCase() }}
            </div>
            <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Active</span>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900">{{ c.companyName }}</h3>
          <p class="text-sm text-gray-500 mb-6">Contact: {{ c.contactName || 'N/A' }}</p>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Rate</span>
              <span class="font-medium">${{ c.hourlyRate }}/hr</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Last Log</span>
              <span class="font-medium">2 days ago</span> 
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex gap-2">
            <button @click="copyLink(c.accessToken)" class="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex justify-center items-center gap-2 transition">
              <i class="ph ph-link"></i> Copy Link
            </button>
            <button class="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
              <i class="ph ph-pencil-simple"></i>
            </button>
          </div>
        </div>

        <button @click="goToAdd" class="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer min-h-[280px] group">
          <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition">
            <i class="ph ph-plus text-2xl"></i>
          </div>
          <span class="font-medium">Add New Client</span>
        </button>

      </div>
    </div>
  </div>
</template>
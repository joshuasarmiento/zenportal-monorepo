<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../lib/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const clients = ref<any[]>([])
const loading = ref(true)
const { fetchApi } = useApi()

// Filters & Sort State
const searchQuery = ref('')
const statusFilter = ref('All Statuses') // 'All Statuses' | 'active' | 'archived'
const sortBy = ref('newest')             // 'newest' | 'name'

onMounted(async () => {
  try {
    clients.value = await fetchApi('/clients')
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Powerful Computed Property for Search + Filter + Sort
const processedClients = computed(() => {
  let result = [...clients.value]

  // 1. Filter by Status
  if (statusFilter.value !== 'All Statuses') {
    result = result.filter(c => c.status === statusFilter.value.toLowerCase())
  }

  // 2. Filter by Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => c.companyName.toLowerCase().includes(q))
  }

  // 3. Sort
  result.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.companyName.localeCompare(b.companyName)
    }
    // Default: Newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return result
})

const copyLink = (token: string) => {
  if (!token) return alert('Error: No token found')
  const url = `${window.location.origin}/c/${token}`
  navigator.clipboard.writeText(url)
  alert('Magic Link copied!')
}

const goToAdd = () => router.push('/clients/new')
const goToEdit = (id: string) => router.push(`/clients/${id}/edit`)
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

      <div class="flex flex-col md:flex-row gap-4 mb-4">
        <div class="relative flex-1">
          <i class="ph ph-magnifying-glass absolute left-3 top-3.5 text-gray-400"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search companies..." 
            class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
          >
        </div>
        
        <select v-model="statusFilter" class="bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none cursor-pointer text-gray-700 shadow-sm min-w-35.7">
          <option>All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>

        <select v-model="sortBy" class="bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none cursor-pointer text-gray-700 shadow-sm min-w-35.7">
          <option value="newest">Newest First</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-400">Loading clients...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div v-for="(c, index) in processedClients" :key="c.id" class="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition group relative">
          
          <div class="flex justify-between items-start mb-4">
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
              :class="index % 2 === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'"
            >
              {{ c.companyName.substring(0, 2).toUpperCase() }}
            </div>
            
            <span 
              class="text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide"
              :class="c.status === 'archived' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'"
            >
              {{ c.status || 'Active' }}
            </span>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900">{{ c.companyName }}</h3>
          <p class="text-sm text-gray-500 mb-6 truncate">{{ c.contactEmail || c.contactName || 'No contact info' }}</p>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Rate</span>
              <span class="font-medium">${{ c.hourlyRate }}/hr</span>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex gap-2">
            <button @click="copyLink(c.accessToken)" class="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex justify-center items-center gap-2 transition">
              <i class="ph ph-link"></i> Copy Link
            </button>
            
            <button @click="goToEdit(c.id)" class="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition border border-transparent hover:border-blue-200">
              <i class="ph ph-pencil-simple text-lg"></i>
            </button>
          </div>
        </div>

        <button @click="goToAdd" class="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer min-h-62.5 group">
          <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition">
            <i class="ph ph-plus text-2xl"></i>
          </div>
          <span class="font-medium">Add New Client</span>
        </button>

      </div>
    </div>
  </div>
</template>
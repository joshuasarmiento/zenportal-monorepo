<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const { fetchApi } = useApi()
const loading = ref(false)

const form = ref({
  companyName: '',
  contactName: '',
  contactEmail: '',
  hourlyRate: 25.00
})

const submit = async () => {
  loading.value = true
  try {
    // Call the Hono Backend
    await fetchApi('/clients', {
      method: 'POST',
      body: JSON.stringify(form.value)
    })
    // Redirect back to the list on success
    router.push('/clients')
  } catch (err) {
    alert('Failed to create client.')
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div class="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="font-bold text-lg text-gray-800">Add New Client</h2>
        <button @click="router.back()" class="text-gray-400 hover:text-gray-600 transition">
          <i class="ph ph-x text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="submit" class="p-6 space-y-6">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
          <input 
            v-model="form.companyName" 
            type="text" 
            required
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" 
            placeholder="e.g. Alpha Corp"
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Contact Name (Optional)</label>
            <input 
              v-model="form.contactName" 
              type="text" 
              class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" 
              placeholder="e.g. Jim Halpert"
            >
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Contact Email (Optional)</label>
            <input 
              v-model="form.contactEmail" 
              type="email" 
              class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" 
              placeholder="jim@alpha.com"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (USD)</label>
          <div class="relative">
            <span class="absolute left-3 top-3 text-gray-400 font-bold">$</span>
            <input 
              v-model="form.hourlyRate" 
              type="number" 
              step="0.01"
              class="w-full pl-8 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" 
              placeholder="25.00"
            >
          </div>
          <p class="text-xs text-gray-400 mt-1">Used to calculate your earnings estimates.</p>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-50">
          <Button variant="primary" :disabled="loading">
            <span v-if="loading">Saving...</span>
            <span v-else class="flex items-center gap-2">
              <i class="ph ph-check-circle text-lg"></i> Create Client
            </span>
          </Button>
        </div>

      </form>
    </div>
  </div>
</template>
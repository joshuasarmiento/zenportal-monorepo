<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApi } from '../lib/api'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const route = useRoute()
const { fetchApi } = useApi()

const loading = ref(true)
const saving = ref(false)
const clientId = route.params.id as string

const form = ref({
  companyName: '',
  contactName: '',
  contactEmail: '',
  hourlyRate: 0,
  status: 'active'
})

// Fetch existing data
onMounted(async () => {
  try {
    const data = await fetchApi(`/clients/${clientId}`)
    form.value = {
      companyName: data.companyName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      hourlyRate: data.hourlyRate,
      status: data.status || 'active'
    }
  } catch (err) {
    alert('Could not load client')
    router.push('/clients')
  } finally {
    loading.value = false
  }
})

const submit = async () => {
  saving.value = true
  try {
    await fetchApi(`/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(form.value)
    })
    router.push('/clients')
  } catch (err) {
    alert('Failed to update client.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div class="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="font-bold text-lg text-gray-800">Edit Client</h2>
        <button @click="router.back()" class="text-gray-400 hover:text-gray-600 transition">
          <i class="ph ph-x text-xl"></i>
        </button>
      </div>

      <div v-if="loading" class="p-10 text-center text-gray-400">Loading...</div>

      <form v-else @submit.prevent="submit" class="p-6 space-y-6">
        
        <div class="grid grid-cols-2 gap-6">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input v-model="form.companyName" type="text" required class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
            </div>
             <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select v-model="form.status" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
            <input v-model="form.contactName" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
            <input v-model="form.contactEmail" type="email" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate</label>
          <div class="relative">
            <span class="absolute left-3 top-3 text-gray-400 font-bold">$</span>
            <input v-model="form.hourlyRate" type="number" step="0.01" class="w-full pl-8 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-50">
          <Button variant="primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Update Client' }}
          </Button>
        </div>

      </form>
    </div>
  </div>
</template>
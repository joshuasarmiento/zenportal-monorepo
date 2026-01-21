<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const { fetchApi } = useApi()
const clients = ref<any[]>([])
const loading = ref(false)

const form = ref({
  clientId: '',
  date: new Date().toISOString().split('T')[0],
  summary: '',
  hoursWorked: 0,
  videoUrl: '',
  attachmentUrl: '', // <--- NEW FIELD
  isBlocked: false,
  blockerDetails: ''
})

onMounted(async () => {
  try {
    clients.value = await fetchApi('/clients')
    if (clients.value.length > 0) form.value.clientId = clients.value[0].id
  } catch (e) { console.error(e) }
})

const submit = async () => {
  loading.value = true
  try {
    await fetchApi('/logs', {
      method: 'POST',
      body: JSON.stringify(form.value)
    })
    router.push('/dashboard')
  } catch (err) {
    alert('Failed to save log.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="font-bold text-lg">Log New Work</h2>
        <button @click="router.back()" class="text-gray-400 hover:text-gray-600"><i class="ph ph-x text-xl"></i></button>
      </div>

      <form @submit.prevent="submit" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Select Client</label>
          <select v-model="form.clientId" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.companyName }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Accomplishments (One per line)</label>
          <textarea v-model="form.summary" rows="5" placeholder="- Fixed the homepage bug&#10;- Sent 50 cold emails" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Video Link (Loom)</label>
            <input v-model="form.videoUrl" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://loom.com/...">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Attachment Link</label>
            <input v-model="form.attachmentUrl" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="GDrive / Dropbox Link">
          </div>
        </div>

        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Hours Worked</label>
            <input v-model="form.hoursWorked" type="number" step="0.5" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div class="bg-red-50 rounded-lg p-4 border border-red-100">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="form.isBlocked" class="w-4 h-4 text-red-600 rounded focus:ring-red-500">
            <span class="font-bold text-red-700 text-sm">I am Blocked / Stuck</span>
          </label>
          <div v-if="form.isBlocked" class="mt-3">
             <input v-model="form.blockerDetails" type="text" class="w-full p-2 bg-white border border-red-200 rounded text-sm outline-none focus:border-red-500" placeholder="What do you need from the client?">
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <Button variant="primary" :disabled="loading">
             {{ loading ? 'Saving...' : 'Save Log' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
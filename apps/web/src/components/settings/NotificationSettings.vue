<script setup lang="ts">
import { ref } from 'vue'
import Button from '../ui/Button.vue'

const settings = ref({
  clientViewReport: true,
  weeklyRecap: true,
  marketing: false
})

const loading = ref(false)

const save = async () => {
  loading.value = true
  setTimeout(() => loading.value = false, 800)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="mb-6 pb-6 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-900">Email Alerts</h3>
      <p class="text-sm text-gray-500">Control when ZenPortal sends you emails.</p>
    </div>

    <div class="space-y-6">
      
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-bold text-gray-800">Client Views Report</p>
          <p class="text-xs text-gray-500">Get notified when a client opens your magic link.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="settings.clientViewReport" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-bold text-gray-800">Weekly Earnings Recap</p>
          <p class="text-xs text-gray-500">Receive a Sunday summary of hours logged.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="settings.weeklyRecap" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-bold text-gray-800">Marketing & Tips</p>
          <p class="text-xs text-gray-500">News about new features and freelance tips.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="settings.marketing" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

    </div>
    
    <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
      <Button variant="secondary" @click="save" :disabled="loading">
        {{ loading ? 'Updating...' : 'Update Preferences' }}
      </Button>
    </div>
  </div>
</template>
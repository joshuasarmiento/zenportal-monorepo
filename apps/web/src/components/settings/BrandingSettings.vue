<script setup lang="ts">
import { ref } from 'vue'
import Button from '../ui/Button.vue' // Assuming you have your UI button

const portalLink = ref('juan-cruz')
const loading = ref(false)

const save = async () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => loading.value = false, 1000)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="mb-6 pb-6 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-900">Portal Appearance</h3>
      <p class="text-sm text-gray-500">Customize how clients see your work logs.</p>
    </div>

    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Portal Link</label>
        <div class="flex">
          <span class="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-500 text-sm flex items-center">portal.app/</span>
          <input 
            v-model="portalLink" 
            type="text" 
            class="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-800"
          >
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Agency Logo</label>
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">JD</div>
          <div>
            <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Upload New</button>
            <p class="text-xs text-gray-500 mt-1">Recommended size: 200x200px</p>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-600 cursor-pointer ring-2 ring-offset-2 ring-indigo-600"></div>
          <div class="w-8 h-8 rounded-full bg-blue-500 cursor-pointer hover:opacity-80"></div>
          <div class="w-8 h-8 rounded-full bg-emerald-500 cursor-pointer hover:opacity-80"></div>
          <div class="w-8 h-8 rounded-full bg-rose-500 cursor-pointer hover:opacity-80"></div>
          <div class="w-8 h-8 rounded-full bg-gray-900 cursor-pointer hover:opacity-80"></div>
        </div>
      </div>
    </div>
    
    <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
      <Button variant="primary" @click="save" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </Button>
    </div>
  </div>
</template>
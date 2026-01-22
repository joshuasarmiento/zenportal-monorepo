<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import Button from '../ui/Button.vue'

const { fetchApi } = useApi()
const userStore = useUserStore()
const saving = ref(false)
const copied = ref(false)

const form = ref({
  portalSlug: '',
  accentColor: 'indigo'
})

// Define available colors
const colors = [
  { name: 'indigo', hex: 'bg-indigo-600' },
  { name: 'blue', hex: 'bg-blue-600' },
  { name: 'emerald', hex: 'bg-emerald-600' },
  { name: 'rose', hex: 'bg-rose-600' },
  { name: 'gray', hex: 'bg-gray-900' }
]

const isPro = computed(() => userStore.user?.tier === 'pro')

onMounted(async () => {
  await userStore.fetchUser()
  if (userStore.user) {
    form.value.portalSlug = userStore.user.portalSlug || ''
    form.value.accentColor = userStore.user.accentColor || 'indigo'
  }
})

const save = async () => {
  saving.value = true
  try {
    const updatedUser = await fetchApi('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(form.value)
    })
    userStore.user = { ...userStore.user, ...updatedUser }
    alert('Branding saved!')
  } catch (err) {
    alert('Error saving settings')
  } finally {
    saving.value = false
  }
}

const copyLink = () => {
  if (!form.value.portalSlug) return

  // Construct the URL (adjust the domain if needed)
  const url = `/p/${form.value.portalSlug}`

  navigator.clipboard.writeText(url).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">

    <div v-if="!isPro"
      class="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
      <div class="bg-white p-6 rounded-xl shadow-xl border border-blue-100 max-w-sm">
        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ph ph-lock-key text-2xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Unlock Branding</h3>
        <p class="text-sm text-gray-500 mb-6">Use your own logo and colors with Agency Pro.</p>
        <button class="bg-blue-600 text-white w-full py-2.5 rounded-lg font-bold hover:bg-blue-700 transition">
          Upgrade for $12/mo
        </button>
      </div>
    </div>

    <div class="mb-6 pb-6 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-900">Portal Appearance</h3>
      <p class="text-sm text-gray-500">Customize how clients see your work logs.</p>
    </div>

    <div class="space-y-6">

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Portal Link</label>
        <div class="flex">
          <span
            class="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-500 text-sm flex items-center">
            portal.app/
          </span>
          <input v-model="form.portalSlug" type="text" placeholder="your-agency" :disabled="!isPro"
            class="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-800 disabled:bg-gray-50">
        </div>
        <button @click="copyLink" :disabled="!isPro || !form.portalSlug"
          class="p-2.5 rounded-lg border border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :title="copied ? 'Copied!' : 'Copy Link'">
          <i v-if="copied" class="ph ph-check text-green-600 text-lg"></i>
          <i v-else class="ph ph-copy text-lg"></i>
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
        <div class="flex gap-3">
          <button v-for="color in colors" :key="color.name" @click="form.accentColor = color.name" :disabled="!isPro"
            class="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition focus:outline-none disabled:cursor-not-allowed"
            :class="[
              color.hex,
              form.accentColor === color.name ? 'ring-2 ring-offset-2 ring-gray-400' : ''
            ]"></button>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
      <Button variant="primary" @click="save" :disabled="saving || !isPro">
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import Button from '../ui/Button.vue'

const { fetchApi } = useApi()
const userStore = useUserStore()
const loading = ref(false)

const isPro = computed(() => userStore.user?.tier === 'pro')

onMounted(() => {
  userStore.fetchUser()
})

// 1. Upgrade Flow
const handleUpgrade = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/billing/checkout', { method: 'POST' })
    if (res.url) {
      window.location.href = res.url // Redirect to Stripe
    }
  } catch (err) {
    alert('Failed to start checkout')
  } finally {
    loading.value = false
  }
}

// 2. Manage Subscription Flow
const handlePortal = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/billing/portal', { method: 'POST' })
    if (res.url) {
      window.location.href = res.url // Redirect to Stripe Portal
    }
  } catch (err) {
    alert('Failed to open portal')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="mb-6 pb-6 border-b border-gray-100 flex justify-between items-start">
      <div>
        <h3 class="text-lg font-bold text-gray-900">Subscription</h3>
        <p class="text-sm text-gray-500">Manage your plan and payment methods.</p>
      </div>
      <span 
        class="text-xs font-bold px-3 py-1 rounded-full uppercase"
        :class="isPro ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
      >
        {{ isPro ? 'Active' : 'Free Plan' }}
      </span>
    </div>

    <div v-if="isPro" class="bg-slate-900 text-white rounded-xl p-6 mb-8 relative overflow-hidden">
      <div class="relative z-10">
        <div class="flex justify-between items-center mb-4">
          <span class="text-blue-400 font-bold text-sm tracking-wider uppercase">Agency Pro</span>
          <span class="text-2xl font-bold">$12<span class="text-sm text-slate-400 font-normal">/mo</span></span>
        </div>
        <ul class="text-sm text-slate-300 space-y-2 mb-6">
          <li class="flex items-center gap-2"><i class="ph ph-check text-blue-400"></i> Unlimited Clients</li>
          <li class="flex items-center gap-2"><i class="ph ph-check text-blue-400"></i> Video Integrations</li>
          <li class="flex items-center gap-2"><i class="ph ph-check text-blue-400"></i> Priority Support</li>
        </ul>
        <div class="flex gap-3">
          <Button variant="secondary" @click="handlePortal" :disabled="loading">
             {{ loading ? 'Loading...' : 'Manage Billing' }}
          </Button>
        </div>
      </div>
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none">
        <i class="ph ph-crown text-9xl -mr-4 -mt-4"></i>
      </div>
    </div>

    <div v-else class="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-center">
      <h4 class="text-blue-900 font-bold text-lg mb-2">Upgrade to Pro</h4>
      <p class="text-blue-700 text-sm mb-4">Get unlimited clients, video uploads, and custom branding.</p>
      <Button variant="primary" @click="handleUpgrade" :disabled="loading">
        {{ loading ? 'Redirecting...' : 'Upgrade Now ($12/mo)' }}
      </Button>
    </div>

  </div>
</template>
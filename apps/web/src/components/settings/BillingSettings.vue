<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, CreditCard, Loader2 } from 'lucide-vue-next'

const { fetchApi } = useApi()
const userStore = useUserStore()
const loading = ref(false)

const isPro = computed(() => userStore.user?.tier === 'pro')

onMounted(() => {
  userStore.fetchUser()
})

const handleUpgrade = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/billing/checkout', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (err) {
    alert('Failed to start checkout')
  } finally {
    loading.value = false
  }
}

const handlePortal = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/billing/portal', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (err) {
    alert('Failed to open portal')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader class="border-b border-border pb-6 flex flex-row justify-between items-start">
      <div class="space-y-1">
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Manage your plan and payment methods.</CardDescription>
      </div>
      <Badge :variant="isPro ? 'default' : 'secondary'" class="uppercase">
        {{ isPro ? 'Active' : 'Free Plan' }}
      </Badge>
    </CardHeader>

    <CardContent class="pt-6">
      
      <div v-if="isPro" class="bg-slate-950 text-white rounded-xl p-6 relative overflow-hidden">
        <div class="relative z-10">
          <div class="flex justify-between items-center mb-4">
            <span class="text-blue-400 font-bold text-sm tracking-wider uppercase">Agency Pro</span>
            <span class="text-2xl font-bold">$12<span class="text-sm text-slate-400 font-normal">/mo</span></span>
          </div>
          <ul class="text-sm text-slate-300 space-y-2 mb-6">
            <li class="flex items-center gap-2"><Check class="h-4 w-4 text-blue-400" /> Unlimited Clients</li>
            <li class="flex items-center gap-2"><Check class="h-4 w-4 text-blue-400" /> Video Integrations</li>
            <li class="flex items-center gap-2"><Check class="h-4 w-4 text-blue-400" /> Priority Support</li>
          </ul>
          <Button variant="secondary" @click="handlePortal" :disabled="loading">
             <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
             {{ loading ? 'Loading...' : 'Manage Billing' }}
          </Button>
        </div>
        <div class="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Crown class="h-32 w-32 -mr-4 -mt-4 text-white" />
        </div>
      </div>

      <div v-else class="bg-blue-50/50 border border-blue-200 rounded-xl p-6 text-center">
        <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
           <Crown class="h-6 w-6" />
        </div>
        <h4 class="text-blue-900 font-bold text-lg mb-2">Upgrade to Pro</h4>
        <p class="text-blue-700/80 text-sm mb-6 max-w-sm mx-auto">Get unlimited clients, video uploads, and custom branding to scale your agency.</p>
        <Button size="lg" @click="handleUpgrade" :disabled="loading" class="bg-blue-600 hover:bg-blue-700">
          <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          {{ loading ? 'Redirecting...' : 'Upgrade Now ($12/mo)' }}
        </Button>
      </div>

    </CardContent>
  </Card>
</template>
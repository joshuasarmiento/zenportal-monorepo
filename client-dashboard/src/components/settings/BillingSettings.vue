<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useApi } from '@/lib/api'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, Crown, Loader2, ExternalLink, AlertTriangle } from 'lucide-vue-next'
import { toast } from 'vue-sonner' 

const { fetchApi } = useApi()
const userStore = useUserStore()
const loading = ref(false)
const transactions = ref<any[]>([])
const subscription = ref<any>(null)
const loadingHistory = ref(true) // Start true for better initial load
const loadingSubscription = ref(true) // Add specific loading state for sub

const isPro = computed(() => userStore.user?.tier === 'pro')

onMounted(() => {
  userStore.fetchUser()
  fetchTransactions()
  fetchSubscription()
})

const fetchSubscription = async () => {
  loadingSubscription.value = true
  try {
    const res = await fetchApi('/billing/subscription')
    subscription.value = res.subscription
  } catch (err) {
    console.error(err)
  } finally {
    loadingSubscription.value = false
  }
}

const fetchTransactions = async () => {
  loadingHistory.value = true
  try {
    const res = await fetchApi('/billing/invoices')
    transactions.value = res.invoices || []
  } catch (err) {
    console.error('Failed to load invoices', err)
  } finally {
    loadingHistory.value = false
  }
}

const handleUpgrade = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/billing/checkout', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (err) {
    toast.error('Failed to start checkout')
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
    toast.error('Failed to open portal')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: number) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-6">
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

      <CardContent>
        <div v-if="loadingSubscription" class="bg-card border rounded-xl p-6">
           <div class="flex justify-between items-center mb-6">
              <Skeleton class="h-4 w-24" />
              <Skeleton class="h-8 w-24" />
           </div>
           <div class="space-y-4 mb-8">
              <Skeleton class="h-4 w-full max-w-sm" />
              <Skeleton class="h-4 w-full max-w-xs" />
              <Skeleton class="h-4 w-full max-w-[200px]" />
           </div>
           <Skeleton class="h-10 w-32" />
        </div>

        <div v-else>
          <div v-if="subscription?.status === 'active' && (subscription?.cancel_at_period_end || subscription?.cancel_at)" 
            class="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-6 mb-6">
            <div class="flex items-start gap-4">
              <div class="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                <AlertTriangle class="h-6 w-6 text-amber-600 dark:text-amber-500" />
              </div>
              <div>
                <h4 class="text-amber-900 dark:text-amber-100 font-bold text-lg">Subscription Cancelled</h4>
                <p class="text-amber-800/80 dark:text-amber-200/70 text-sm mt-1 mb-4">
                  Your plan is set to cancel on <strong>{{ formatDate(subscription.cancel_at || subscription.current_period_end) }}</strong>. You will lose access to premium features after this date.
                </p>
                <Button variant="outline" size="sm" @click="handlePortal" class="bg-white hover:bg-amber-50 dark:bg-transparent dark:hover:bg-amber-900/20 border-amber-300 text-amber-800 dark:text-amber-100">
                  Reactivate Plan
                </Button>
              </div>
            </div>
          </div>

          <div v-else-if="isPro" class="bg-slate-950 text-white rounded-xl p-6 relative overflow-hidden dark:border dark:border-slate-800">
            <div class="relative z-10">
              <div class="flex justify-between items-center mb-4">
                <span class="text-indigo-400 font-bold text-sm tracking-wider uppercase">Agency Pro</span>
                <span class="text-2xl font-bold">$12<span class="text-sm text-slate-400 font-normal">/mo</span></span>
              </div>
              <ul class="text-sm text-slate-300 space-y-2 mb-6">
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-indigo-400" /> Unlimited Clients </li>
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-indigo-400" /> Loom & Drive Embeds </li>
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-indigo-400" /> Custom Branding & Colors </li>
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-indigo-400" /> Unlimited History </li>
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-indigo-400" /> Export to PDF/CSV </li>
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-indigo-400" /> Programmatic API Access </li>
                <li class="flex items-center gap-2"><Check class="h-4 w-4 text-indigo-400" /> Priority Support</li>
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

          <div v-else class="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 text-center">
            <div class="bg-indigo-100 dark:bg-indigo-900/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
              <Crown class="h-6 w-6" />
            </div>
            <h4 class="text-indigo-900 dark:text-indigo-100 font-bold text-lg mb-2">Upgrade to Pro</h4>
            <p class="text-indigo-700/80 dark:text-indigo-300/80 text-sm mb-6 max-w-sm mx-auto">
              Get unlimited clients, video uploads, and custom branding to scale your agency.
            </p>
            <Button size="lg" @click="handleUpgrade" :disabled="loading" class="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
              {{ loading ? 'Redirecting...' : 'Upgrade Now ($12/mo)' }}
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View your recent payments and invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loadingHistory">
          <Table>
             <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="i in 3" :key="i">
                <TableCell><Skeleton class="h-4 w-24" /></TableCell>
                <TableCell><Skeleton class="h-4 w-16" /></TableCell>
                <TableCell><Skeleton class="h-6 w-20 rounded-full" /></TableCell>
                <TableCell class="text-right flex justify-end"><Skeleton class="h-4 w-12" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div v-else-if="transactions.length === 0" class="text-center py-8 text-muted-foreground">
          No transactions found.
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="invoice in transactions" :key="invoice.id">
              <TableCell class="font-medium">{{ formatDate(invoice.date) }}</TableCell>
              <TableCell>${{ invoice.amount.toFixed(2) }}</TableCell>
              <TableCell>
                <Badge variant="outline" class="capitalize" :class="{
                  'bg-green-50 text-green-700 border-green-200': invoice.status === 'paid',
                  'bg-red-50 text-red-700 border-red-200': invoice.status === 'open' || invoice.status === 'void'
                }">
                  {{ invoice.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <a :href="invoice.url" target="_blank" class="inline-flex items-center text-indigo-600 hover:underline text-sm">
                  View
                  <ExternalLink class="ml-1 h-3 w-3" />
                </a>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
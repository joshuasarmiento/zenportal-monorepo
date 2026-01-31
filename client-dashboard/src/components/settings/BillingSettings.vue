<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Crown, Loader2, AlertCircle, XCircle, ArrowRight, FileText, CheckCircle2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const loading = ref(false)
const loadingSubscription = ref(true)
const canceling = ref(false)
const subscription = ref<any>(null)
const transactions = ref<any[]>([]) 

const pendingSession = ref<{ id: string; url: string; status: string } | null>(null)

const isPro = computed(() => 
  subscription.value?.status === 'active' && 
  subscription.value?.plan?.includes('pro') 
)

onMounted(async () => {
  await Promise.all([
    fetchSubscription(),
    fetchTransactions(),
    checkPendingSession()
  ])
})

const fetchAuth = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers }
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed')
  return res.json()
}

const fetchSubscription = async () => {
  loadingSubscription.value = true
  try {
    const data = await fetchAuth('/api/billing/subscription')
    if (data.subscription) subscription.value = data.subscription
  } catch (err) { console.error(err) } 
  finally { loadingSubscription.value = false }
}

const fetchTransactions = async () => {
  try {
    const data = await fetchAuth('/api/billing/transactions')
    transactions.value = data.transactions || []
  } catch (err) {
    console.error("Failed to load transactions", err)
  }
}

const checkPendingSession = async () => {
  const savedId = localStorage.getItem('pending_checkout_id')
  if (!savedId) return

  try {
    const res = await fetchAuth(`/api/billing/session/${savedId}`)
    const session = res.data

    if (session.attributes.status === 'active') {
      pendingSession.value = {
        id: session.id,
        url: session.attributes.checkout_url,
        status: 'active'
      }
    } else if (session.attributes.status === 'paid') {
      localStorage.removeItem('pending_checkout_id')
      toast.success("Payment verified!")
      await fetchSubscription()
      await fetchTransactions()
    } else {
      localStorage.removeItem('pending_checkout_id')
    }
  } catch (err) {
    localStorage.removeItem('pending_checkout_id')
  }
}

const handleUpgrade = async () => {
  loading.value = true
  try {
    const response = await fetchAuth('/api/billing/subscribe', { method: 'POST' })
    const session = response.data
    if (session?.attributes?.checkout_url) {
      localStorage.setItem('pending_checkout_id', session.id)
      window.location.href = session.attributes.checkout_url
    }
  } catch (err: any) {
    toast.error('Failed to start checkout', { description: err.message })
  } finally {
    loading.value = false
  }
}

const cancelPendingPayment = async () => {
  if (!pendingSession.value) return
  canceling.value = true
  try {
    await fetchAuth(`/api/billing/session/${pendingSession.value.id}/expire`, { method: 'POST' })
    localStorage.removeItem('pending_checkout_id')
    pendingSession.value = null
    toast.success("Transaction cancelled")
  } catch (err: any) {
    toast.error("Could not cancel transaction", { description: err.message })
  } finally {
    canceling.value = false
  }
}

const handlePortal = async () => {
  toast.info("Manage Subscription", { description: "Contact support to modify your plan." })
}

const formatDate = (dateInput: string | number | Date) => {
  if (!dateInput) return '-'
  return new Date(dateInput).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}
</script>

<template>
  <div class="space-y-8">
    
    <div v-if="pendingSession && !isPro" class="animate-in fade-in slide-in-from-top-4 duration-500">
      <Alert variant="default" class="border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
        <AlertCircle class="h-4 w-4 text-orange-600 dark:text-orange-500" />
        <AlertTitle class="text-orange-800 dark:text-orange-500 font-bold tracking-tight">
          Pending Transaction Detected
        </AlertTitle>
        <AlertDescription class="text-orange-700 dark:text-orange-400 mt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p class="text-sm font-medium">
            You have an unfinished checkout session. Would you like to continue payment or cancel it?
          </p>
          <div class="flex gap-2 w-full sm:w-auto">
            <Button size="sm" variant="outline" 
              class="border-orange-200 hover:bg-orange-100 text-orange-800 dark:border-orange-800 dark:hover:bg-orange-900/50 dark:text-orange-400 h-8"
              @click="cancelPendingPayment" :disabled="canceling">
              <Loader2 v-if="canceling" class="mr-2 h-3 w-3 animate-spin" />
              <XCircle v-else class="mr-2 h-3 w-3" />
              Cancel
            </Button>
            
            <Button size="sm" class="bg-orange-600 hover:bg-orange-700 text-white border-0 h-8 font-bold" as-child>
              <a :href="pendingSession.url">
                Pay Now <ArrowRight class="ml-2 h-3 w-3" />
              </a>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>

    <Card class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <CardHeader class="border-b border-zinc-100 dark:border-zinc-800 pb-6 flex flex-row justify-between items-start">
        <div class="space-y-1">
          <CardTitle class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Subscription</CardTitle>
          <CardDescription class="text-zinc-500">Manage your plan and billing details.</CardDescription>
        </div>
        <Badge :variant="isPro ? 'default' : 'secondary'" class="uppercase tracking-widest text-[10px] font-bold px-3 py-1">
          {{ isPro ? 'Active' : 'Free Plan' }}
        </Badge>
      </CardHeader>

      <CardContent class="pt-6">
        <div v-if="loadingSubscription" class="space-y-6">
          <div class="flex justify-between items-center">
            <Skeleton class="h-4 w-24 bg-zinc-100 dark:bg-zinc-800" />
            <Skeleton class="h-8 w-24 bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div class="space-y-4">
            <Skeleton class="h-4 w-full max-w-sm bg-zinc-100 dark:bg-zinc-800" />
            <Skeleton class="h-4 w-full max-w-xs bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <Skeleton class="h-10 w-32 bg-zinc-100 dark:bg-zinc-800" />
        </div>

        <div v-else>
          <div v-if="isPro"
            class="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl p-8 relative overflow-hidden shadow-xl">
            <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="p-1 rounded bg-white/20 dark:bg-zinc-900/10">
                     <Crown class="h-4 w-4 text-white dark:text-zinc-900" />
                  </div>
                  <span class="font-bold text-sm tracking-widest uppercase">Agency Pro</span>
                </div>
                <p class="text-zinc-300 dark:text-zinc-600 text-sm max-w-lg mb-1">
                  You have access to all premium features.
                </p>
                <p class="text-zinc-400 dark:text-zinc-500 text-xs" v-if="subscription?.period_end">
                   Renews on {{ formatDate(subscription.period_end) }}
                </p>
              </div>
              
              <Button variant="secondary" @click="handlePortal" :disabled="loading" class="bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 font-medium border-0">
                Manage Billing
              </Button>
            </div>
            <div class="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          </div>

          <div v-else
            class="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center relative overflow-hidden group">
            
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            
            <div class="relative z-10">
                <div class="bg-white dark:bg-zinc-800 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-zinc-100 dark:border-zinc-700">
                  <Crown class="h-6 w-6 text-zinc-900 dark:text-white" />
                </div>
                <h4 class="text-zinc-900 dark:text-white font-bold text-xl mb-3 tracking-tight">Upgrade to Agency Pro</h4>
                <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                  Remove limits and look professional with custom branding, unlimited clients, and video uploads.
                </p>
                <Button size="lg" @click="handleUpgrade" :disabled="loading || !!pendingSession"
                  class="h-12 px-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold transition-all hover:scale-105 shadow-lg shadow-zinc-500/20 dark:shadow-none">
                  <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                  {{ loading ? 'Processing...' : 'Subscribe for ₱2,000/mo' }}
                </Button>
                <div class="mt-6 flex flex-col items-center gap-1">
                    <span class="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Secure payment via PayMongo</span>
                    <span v-if="pendingSession" class="text-xs text-orange-600 font-medium animate-pulse">
                      * You have a pending transaction above.
                    </span>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <CardHeader class="border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <CardTitle class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Transaction History</CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <div v-if="transactions.length === 0" class="text-center py-16 text-zinc-500">
          <div class="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3">
             <FileText class="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
          </div>
          <p class="text-sm font-medium">No transactions found.</p>
        </div>

        <Table v-else>
          <TableHeader class="bg-zinc-50/50 dark:bg-zinc-900/50">
            <TableRow class="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800">
              <TableHead class="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-6">Date</TableHead>
              <TableHead class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</TableHead>
              <TableHead class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Amount</TableHead>
              <TableHead class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</TableHead>
              <TableHead class="text-xs font-bold text-zinc-400 uppercase tracking-wider text-right pr-6">Ref ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in transactions" :key="item.id" class="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
              <TableCell class="pl-6 font-medium text-zinc-600 dark:text-zinc-400">{{ formatDate(item.createdAt) }}</TableCell>
              <TableCell class="font-medium text-zinc-900 dark:text-white">
                {{ item.plan === 'pro' ? 'Agency Pro Plan' : item.plan }}
              </TableCell>
              <TableCell class="text-zinc-600 dark:text-zinc-300 font-mono">{{ formatCurrency(2000) }}</TableCell>
              <TableCell>
                <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30 capitalize gap-1 pl-1.5 pr-2.5 py-0.5 rounded-full font-bold text-[10px]">
                  <CheckCircle2 class="w-3 h-3" /> {{ item.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-right pr-6 font-mono text-xs text-zinc-400">
                {{ item.id.slice(0, 8) }}...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
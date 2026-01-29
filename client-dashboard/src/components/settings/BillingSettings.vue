<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Crown, Loader2, AlertCircle, XCircle, ArrowRight, FileText } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const loading = ref(false)
const loadingSubscription = ref(true)
const canceling = ref(false)
const subscription = ref<any>(null)
const transactions = ref<any[]>([]) // [NEW] State for history

const pendingSession = ref<{ id: string; url: string; status: string } | null>(null)

const isPro = computed(() => 
  subscription.value?.status === 'active' && 
  subscription.value?.plan?.includes('pro') 
)

onMounted(async () => {
  await Promise.all([
    fetchSubscription(),
    fetchTransactions(), // [NEW] Fetch history on load
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

// [NEW] Fetch Transaction History
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
      await fetchTransactions() // Refresh history
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
  <div class="space-y-6">
    
    <div v-if="pendingSession && !isPro" class="animate-in fade-in slide-in-from-top-4 duration-500">
      <Alert variant="default" class="border-amber-500/50 bg-amber-50 dark:bg-amber-950/30">
        <AlertCircle class="h-4 w-4 text-amber-600 dark:text-amber-500" />
        <AlertTitle class="text-amber-800 dark:text-amber-500 font-semibold">
          Pending Transaction Detected
        </AlertTitle>
        <AlertDescription class="text-amber-700 dark:text-amber-400 mt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p class="text-sm">
            You have an unfinished checkout session. Would you like to continue payment or cancel it?
          </p>
          <div class="flex gap-2 w-full sm:w-auto">
            <Button size="sm" variant="outline" 
              class="border-amber-200 hover:bg-amber-100 text-amber-800 dark:border-amber-800 dark:hover:bg-amber-900 dark:text-amber-400"
              @click="cancelPendingPayment" :disabled="canceling">
              <Loader2 v-if="canceling" class="mr-2 h-3 w-3 animate-spin" />
              <XCircle v-else class="mr-2 h-3 w-3" />
              Cancel
            </Button>
            
            <Button size="sm" class="bg-amber-600 hover:bg-amber-700 text-white border-0" as-child>
              <a :href="pendingSession.url">
                Pay Now <ArrowRight class="ml-2 h-3 w-3" />
              </a>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>

    <Card>
      <CardHeader class="border-b border-border pb-6 flex flex-row justify-between items-start">
        <div class="space-y-1">
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your plan and billing.</CardDescription>
        </div>
        <Badge :variant="isPro ? 'default' : 'secondary'" class="uppercase">
          {{ isPro ? 'Active' : 'Free Plan' }}
        </Badge>
      </CardHeader>

      <CardContent>
        <div v-if="loadingSubscription" class="bg-card border rounded-xl p-6 mt-6">
          <div class="flex justify-between items-center mb-6">
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-8 w-24" />
          </div>
          <div class="space-y-4 mb-8">
            <Skeleton class="h-4 w-full max-w-sm" />
            <Skeleton class="h-4 w-full max-w-xs" />
          </div>
          <Skeleton class="h-10 w-32" />
        </div>

        <div v-else class="mt-6">
          <div v-if="isPro"
            class="bg-slate-950 text-white rounded-xl p-6 relative overflow-hidden dark:border dark:border-slate-800">
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-3">
                <Crown class="h-5 w-5 text-indigo-400" />
                <span class="text-indigo-400 font-bold text-sm tracking-wider uppercase">Plan Active</span>
              </div>
              <p class="text-slate-300 text-base mb-6 max-w-lg">
                You are currently subscribed to the <strong>Agency Pro</strong> plan. 
                <span v-if="subscription?.period_end">Next renewal date: {{ formatDate(subscription.period_end) }}</span>
              </p>
              <Button variant="secondary" @click="handlePortal" :disabled="loading">
                Manage Subscription
              </Button>
            </div>
            <div class="absolute right-0 top-0 opacity-10 pointer-events-none">
              <Crown class="h-32 w-32 -mr-4 -mt-4 text-white" />
            </div>
          </div>

          <div v-else
            class="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 text-center">
            <div class="bg-indigo-100 dark:bg-indigo-900/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
              <Crown class="h-6 w-6" />
            </div>
            <h4 class="text-indigo-900 dark:text-indigo-100 font-bold text-lg mb-2">Upgrade to Pro</h4>
            <p class="text-indigo-700/80 dark:text-indigo-300/80 text-sm mb-6 max-w-sm mx-auto">
              Get unlimited clients, video uploads, and custom branding.
            </p>
            <Button size="lg" @click="handleUpgrade" :disabled="loading || !!pendingSession"
              class="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50">
              <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
              {{ loading ? 'Processing...' : 'Subscribe Now (₱2,000/mo)' }}
            </Button>
            <div class="mt-4 flex flex-col items-center gap-1">
                <span class="text-xs text-muted-foreground">Secure payment via PayMongo</span>
                <span v-if="pendingSession" class="text-xs text-amber-600 font-medium">
                  Please complete or cancel your pending transaction above.
                </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View your past payments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="transactions.length === 0" class="text-center py-8 text-muted-foreground">
          <FileText class="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p class="text-sm">No transactions found.</p>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Ref ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in transactions" :key="item.id">
              <TableCell>{{ formatDate(item.createdAt) }}</TableCell>
              <TableCell class="font-medium">
                {{ item.plan === 'pro' ? 'Pro Plan Subscription' : item.plan }}
              </TableCell>
              <TableCell>{{ formatCurrency(2000) }}</TableCell>
              <TableCell>
                <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 capitalize">
                  {{ item.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-right font-mono text-xs text-muted-foreground">
                {{ item.id.slice(0, 12) }}...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
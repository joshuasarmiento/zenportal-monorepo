<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Crown, Loader2, FileText, CheckCircle2, XCircle, Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { env } from '@/env'
import { authClient } from '@/lib/auth-client'
import { useRoute, useRouter } from 'vue-router'

const API_URL = env.VITE_API_URL
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const loadingSubscription = ref(true)
const subscription = ref<any>(null)
const transactions = ref<any[]>([]) 
const billingInterval = ref<'monthly' | 'yearly'>('monthly')

const upgradeButtonText = computed(() => billingInterval.value === 'monthly' ? '$12/mo' : '$120/year')


const isPro = computed(() => 
  subscription.value?.status === 'active' || 
  subscription.value?.plan?.includes('pro') 
)

onMounted(async () => {
  if (route.query.success) {
    toast.success("Subscription updated successfully!")
    // Remove query param
    router.replace({ query: {} })
  }
  
  await Promise.all([
    fetchSubscription(),
    fetchTransactions(),
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

const handleUpgrade = async () => {
  loading.value = true
  try {
      const { data, error } = await authClient.dodopayments.checkoutSession({
          product_cart: [{
            product_id: billingInterval.value === 'monthly' ? env.VITE_DODO_PRODUCT_ID_MONTHLY : env.VITE_DODO_PRODUCT_ID_YEARLY,
            quantity: 1
          }]
      })


      if (error) {
           toast.error(error.message || "Failed to start checkout")
           return
      }

      if (data?.url) {
          window.location.href = data.url
      }
  } catch (err: any) {
    toast.error('Failed to start checkout', { description: err.message })
  } finally {
    loading.value = false
  }
}

const handlePortal = async () => {
    loading.value = true;
    try {
        const { data, error } = await authClient.dodopayments.customer.portal()
        
        if (error) {
            toast.error(error.message || "Failed to open portal")
            return
        }

        if (data?.url) {
             window.location.href = data.url
        }
    } catch(err) {
        toast.error("Failed to redirect to portal")
    } finally {
        loading.value = false
    }
}

const formatDate = (dateInput: string | number | Date) => {
  if (!dateInput) return '-'
  return new Date(dateInput).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)
}
</script>

<template>
  <div class="space-y-8">
    <Card class="border border-border bg-card shadow-sm">
      <CardHeader class="border-b border-border pb-6 flex flex-row justify-between items-start">
        <div class="space-y-1">
          <CardTitle class="text-lg font-bold tracking-tight text-foreground">Subscription</CardTitle>
          <CardDescription class="text-muted-foreground">Manage your plan and billing details.</CardDescription>
        </div>
        <Badge :variant="isPro ? 'default' : 'secondary'" class="uppercase tracking-widest text-[10px] font-bold px-3 py-1">
          {{ isPro ? 'Active' : 'Free Plan' }}
        </Badge>
      </CardHeader>

      <CardContent class="pt-6">
        <div v-if="loadingSubscription" class="space-y-6">
          <div class="flex justify-between items-center">
            <Skeleton class="h-4 w-24 bg-muted" />
            <Skeleton class="h-8 w-24 bg-muted" />
          </div>
          <div class="space-y-4">
            <Skeleton class="h-4 w-full max-w-sm bg-muted" />
            <Skeleton class="h-4 w-full max-w-xs bg-muted" />
          </div>
          <Skeleton class="h-10 w-32 bg-muted" />
        </div>

        <div v-else>
          <div v-if="isPro"
            class="bg-foreground text-background rounded-2xl p-8 relative overflow-hidden shadow-xl">
            <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="p-1 rounded bg-background/20">
                     <Crown class="h-4 w-4 text-background" />
                  </div>
                  <span class="font-bold text-sm tracking-widest uppercase">Agency Pro</span>
                </div>
                <p class="text-background/80 text-sm max-w-lg mb-1">
                  You have access to all premium features.
                </p>
                <p class="text-background/60 text-xs" v-if="subscription?.period_end">
                   Renews on {{ formatDate(subscription.period_end) }}
                </p>
              </div>
              
              <Button variant="secondary" @click="handlePortal" :disabled="loading" class="bg-background text-foreground hover:bg-background/90 font-medium border-0">
                <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                Manage Billing
              </Button>
            </div>
            <div class="absolute right-0 top-0 w-64 h-64 bg-linear-to-br from-white/5 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          </div>

          <div v-else
            class="bg-muted/50 border border-border rounded-2xl p-8 text-center relative overflow-hidden group">
            
            <div class="relative z-10">
                <div class="bg-card w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-border">
                  <Crown class="h-6 w-6 text-foreground" />
                </div>
                <h4 class="text-foreground font-bold text-xl mb-3 tracking-tight">Upgrade to Agency Pro</h4>
                <p class="text-muted-foreground text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                  Remove limits and look professional with custom branding, unlimited clients, and video uploads.
                </p>

                <div class="flex justify-center mb-6">
                  <div class="flex items-center gap-3 bg-muted p-1 rounded-full border border-border/50">
                    <span class="text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer"
                      :class="billingInterval === 'monthly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'"
                      @click="billingInterval = 'monthly'">
                      Monthly
                    </span>
                    <span class="text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-2"
                      :class="billingInterval === 'yearly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'"
                      @click="billingInterval = 'yearly'">
                      Yearly <span class="text-[9px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">Save 17%</span>
                    </span>
                  </div>
                </div>

                <Button size="lg" @click="handleUpgrade" :disabled="loading"
                  class="h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all hover:scale-105 shadow-lg shadow-primary/20">
                  <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                  {{ loading ? 'Processing...' : `Subscribe for ${upgradeButtonText}` }}
                </Button>

                <div class="mt-6 flex flex-col items-center gap-1">
                    <span class="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Secure payment via Dodo</span>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="border border-border bg-card shadow-sm">
      <CardHeader class="border-b border-border pb-6">
        <CardTitle class="text-lg font-bold tracking-tight text-foreground">Transaction History</CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <div v-if="transactions.length === 0" class="text-center py-16 text-muted-foreground">
          <div class="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
             <FileText class="h-5 w-5 text-muted-foreground" />
          </div>
          <p class="text-sm font-medium">No transactions found.</p>
        </div>

        <Table v-else>
          <TableHeader class="bg-muted/50">
            <TableRow class="hover:bg-transparent border-b border-border">
              <TableHead class="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-6">Date</TableHead>
              <TableHead class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</TableHead>
              <TableHead class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</TableHead>
              <TableHead class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</TableHead>
              <TableHead class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Payment Method</TableHead>
              <TableHead class="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right pr-6">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in transactions" :key="item.payment_id || item.id" class="border-b border-border hover:bg-muted/50 transition-colors">
              <TableCell class="pl-6 font-medium text-muted-foreground">{{ formatDate(item.created_at || item.createdAt) }}</TableCell>
              <TableCell class="font-medium text-foreground">
                {{ item.product_name || 'ZenPortal Pro' }}
              </TableCell>
              <TableCell class="text-muted-foreground font-mono">{{ formatCurrency(item.total_amount || item.amount || 0, item.currency) }}</TableCell>
              <TableCell>
                <Badge variant="outline" :class="{
                  'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30': item.status === 'succeeded',
                  'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30': item.status === 'failed',
                  'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30': item.status === 'pending' || item.status === 'processing'
                }" class="capitalize gap-1 pl-1.5 pr-2.5 py-0.5 rounded-full font-bold text-[10px]">
                  <CheckCircle2 v-if="item.status === 'succeeded'" class="w-3 h-3" /> 
                  <XCircle v-else-if="item.status === 'failed'" class="w-3 h-3" />
                  <Loader2 v-else class="w-3 h-3 animate-spin" />
                  {{ item.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-muted-foreground text-xs capitalize">
                {{ (item.payment_method_type || item.payment_method || 'Card').replace(/_/g, ' ') }}
              </TableCell>
              <TableCell class="text-right pr-6">
                <Button v-if="item.invoice_url" variant="ghost" size="sm" as-child class="h-8 w-8 p-0 rounded-full hover:bg-muted">
                  <a :href="item.invoice_url" target="_blank" title="Download Invoice">
                    <Download class="h-4 w-4 text-muted-foreground" />
                  </a>
                </Button>
                <span v-else class="text-muted-foreground text-xs">-</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
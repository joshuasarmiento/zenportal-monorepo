<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useApi } from '../lib/api'
import { useAuth } from '@clerk/vue'
import { useUserStore } from '@/stores/userStore'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, DollarSign, AlertTriangle, Loader2, Lock } from 'lucide-vue-next'
// Note: If you don't have vue-sonner installed, replace `toast` calls with `alert()` or `console.log`
import { toast } from 'vue-sonner' 

// Import Shadcn Chart Components
import { VisXYContainer, VisGroupedBar, VisAxis } from '@unovis/vue'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// --- Types ---
interface RevenueItem {
  period: string
  amount: number
}

interface ClientItem {
  name: string
  amount: number
  percent: number
}

interface StatsData {
  totalEarnings: number
  blockedRevenue: number
  pendingBlockersCount: number
  goalPercent: number
  goalTarget: number
  revenueHistory: RevenueItem[]
  topClients: ClientItem[]
}

const { fetchApi } = useApi()
const { getToken } = useAuth()
const userStore = useUserStore()

// State
const loading = ref(true)
const exporting = ref(false)
const selectedRange = ref('6m') // Default to 6 months for better initial data probability

const stats = ref<StatsData>({ 
  totalEarnings: 0, 
  blockedRevenue: 0, 
  pendingBlockersCount: 0, 
  goalPercent: 0, 
  goalTarget: 2000, 
  revenueHistory: [], 
  topClients: [] 
})

// Configuration for Shadcn/Unovis Chart
const chartConfig = {
  amount: { 
    label: 'Revenue', 
    // FIX: Use specific HEX color. CSS vars like 'hsl(var(--primary))' can fail in some JS chart libs
    color: '#3b82f6' 
  }
}

const isPro = computed(() => userStore.user?.tier === 'pro')

const ranges = computed(() => [
  { label: 'Last 24 Hours', value: '24h', pro: false },
  { label: 'Last 7 Days', value: '7d', pro: false },
  { label: 'Last 30 Days', value: '30d', pro: true },
  { label: 'Last 90 Days', value: '90d', pro: true },
  { label: 'Last 6 Months', value: '6m', pro: false },
])

// --- Actions ---

const loadStats = async () => {
  loading.value = true
  try {
    const data = await fetchApi<StatsData>(`/stats?range=${selectedRange.value}`)
    stats.value = data
  } catch (err) { 
    console.error("Stats load error:", err)
    toast.error("Failed to load earnings data")
  } finally { 
    loading.value = false 
  }
}

const exportCSV = async () => {
  exporting.value = true
  try {
    const token = await getToken.value()
    const response = await fetch(`${import.meta.env.VITE_API_URL}/stats/export`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!response.ok) throw new Error('Export failed')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `earnings-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    toast.success("Export downloaded successfully")
  } catch (err) {
    console.error(err)
    toast.error("Failed to export CSV.")
  } finally {
    exporting.value = false
  }
}

const getInitials = (name: string) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

// Lifecycle
onMounted(async () => {
  if (!userStore.user) await userStore.fetchUser()
  loadStats()
})

watch(selectedRange, () => loadStats())
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="#">Platform</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Earnings</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="ml-auto flex items-center gap-2">
          
          <Select v-model="selectedRange">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem 
                v-for="range in ranges" 
                :key="range.value" 
                :value="range.value"
                :disabled="range.pro && !isPro"
              >
                <div class="flex items-center justify-between w-full gap-2">
                  <span>{{ range.label }}</span>
                  <div v-if="range.pro && !isPro" class="flex items-center gap-1 text-muted-foreground bg-muted px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                    <Lock class="h-3 w-3" /> Pro
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" class="gap-2" @click="exportCSV" :disabled="exporting || loading">
            <Loader2 v-if="exporting" class="h-4 w-4 animate-spin" />
            <Download v-else class="h-4 w-4" /> 
            Export
          </Button>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        
        <div class="max-w-6xl w-full mx-auto space-y-6">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card class="relative overflow-hidden">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle class="text-sm font-medium text-muted-foreground">Total Earnings (Month)</CardTitle>
                <DollarSign class="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent class="relative z-10">
                <div v-if="loading" class="h-8 w-24 bg-muted animate-pulse rounded"></div>
                <div v-else class="text-2xl font-bold">${{ stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
              </CardContent>
              <div class="absolute right-0 bottom-0 opacity-5 text-green-600 pointer-events-none">
                <DollarSign class="h-24 w-24 -mr-6 -mb-6" />
              </div>
            </Card>

            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium text-muted-foreground">Blocked Revenue</CardTitle>
                <AlertTriangle class="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div v-if="loading" class="h-8 w-24 bg-muted animate-pulse rounded"></div>
                <template v-else>
                  <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    ${{ stats.blockedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ stats.pendingBlockersCount }} blocked tasks require attention
                  </p>
                </template>
              </CardContent>
            </Card>

            <Card class="bg-slate-900 text-white border-slate-800 shadow-lg dark:bg-slate-950">
              <CardContent class="p-6">
                <div class="flex justify-between items-end mb-2">
                  <p class="text-sm text-slate-300 font-medium">Monthly Goal</p>
                  <div v-if="loading" class="h-6 w-12 bg-slate-800 animate-pulse rounded"></div>
                  <p v-else class="text-lg font-bold text-white">{{ stats.goalPercent }}%</p>
                </div>
                
                <div class="w-full bg-slate-800 rounded-full h-3 mb-4">
                  <div 
                    class="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: loading ? '0%' : `${stats.goalPercent}%` }"
                  ></div>
                </div>
                
                <p class="text-xs text-slate-400">Target: ${{ stats.goalTarget.toLocaleString() }}</p>
              </CardContent>
            </Card>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <Card class="lg:col-span-2 flex flex-col min-h-[400px]">
              <CardHeader>
                <CardTitle>Revenue History</CardTitle>
              </CardHeader>
              <CardContent class="flex-1">
                <div v-if="loading" class="w-full h-[300px] flex items-end gap-2 px-4">
                  <div v-for="i in 6" :key="i" class="bg-muted animate-pulse rounded-t w-full" :style="{ height: `${Math.random() * 80 + 20}%` }"></div>
                </div>
                
                <div v-else-if="stats.revenueHistory && stats.revenueHistory.length > 0" class="w-full h-[300px]">
                  <ChartContainer :config="chartConfig" class="h-full w-full">
                    <VisXYContainer :data="stats.revenueHistory" :margin="{ left: 10, right: 10, top: 10, bottom: 0 }">
                      
                      <VisGroupedBar 
                        :x="(d: RevenueItem) => d.period" 
                        :y="(d: RevenueItem) => d.amount" 
                        :color="chartConfig.amount.color" 
                        :rounded-corners="4"
                      />
                      
                      <VisAxis 
                        type="x" 
                        :x="(d: RevenueItem) => d.period" 
                        :tick-line="false" 
                        :grid-line="false" 
                        :domain-line="false" 
                        class="text-muted-foreground text-xs"
                      />
                      <VisAxis 
                        type="y" 
                        :tick-line="false" 
                        :grid-line="false" 
                        :domain-line="false" 
                        :tick-format="(d: number) => `$${d}`"
                        :num-ticks="5"
                        class="text-muted-foreground text-xs"
                      />

                      <ChartTooltip 
                        :cursor="{ stroke: 'var(--border)', strokeWidth: 1 }"
                        :content="{
                          component: ChartTooltipContent,
                          props: {
                            formatter: (value: any) => `$${Number(value).toLocaleString()}`
                          }
                        }"
                      />
                    </VisXYContainer>
                  </ChartContainer>
                </div>
                
                <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                  <div class="p-4 bg-muted/50 rounded-full mb-2">
                    <DollarSign class="h-6 w-6 opacity-50" />
                  </div>
                  <p>No revenue data found for this period.</p>
                </div>
              </CardContent>
            </Card>

            <Card class="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Top Clients</CardTitle>
              </CardHeader>
              <CardContent class="flex-1">
                <div v-if="loading" class="space-y-6">
                   <div v-for="i in 3" :key="i" class="space-y-2">
                     <div class="flex justify-between"><div class="h-4 w-24 bg-muted animate-pulse rounded"></div><div class="h-4 w-12 bg-muted animate-pulse rounded"></div></div>
                     <div class="h-2 w-full bg-muted animate-pulse rounded"></div>
                   </div>
                </div>

                <div v-else-if="stats.topClients.length > 0" class="space-y-6">
                  <div v-for="(client, index) in stats.topClients" :key="client.name">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0"
                          :class="index === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'">
                          {{ getInitials(client.name) }}
                        </div>
                        <span class="text-sm font-medium text-foreground truncate max-w-[120px]" :title="client.name">{{ client.name }}</span>
                      </div>
                      <span class="text-sm font-bold text-foreground">${{ client.amount.toLocaleString() }}</span>
                    </div>
                    <div class="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500" 
                        :class="index === 0 ? 'bg-primary' : 'bg-orange-400'"
                        :style="{ width: `${client.percent}%` }"></div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center py-10 text-muted-foreground text-sm">
                  No client activity found.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
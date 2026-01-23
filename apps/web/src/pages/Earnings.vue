<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useApi } from '../lib/api'
import { useAuth } from '@clerk/vue'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'vue-sonner' 

// Components
import AppSidebar from '@/components/AppSidebar.vue'
import EarningsHeader from '@/components/earnings/EarningsHeader.vue'
import EarningsStats from '@/components/earnings/EarningsStats.vue'
import RevenueChart from '@/components/earnings/RevenueChart.vue'
import TopClients from '@/components/earnings/TopClients.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

// --- Types ---
interface RevenueItem { period: string; amount: number; rawDate: string }
interface ClientItem { name: string; amount: number; percent: number }
interface StatsData {
  totalEarnings: number
  blockedRevenue: number
  pendingBlockersCount: number
  goalPercent: number
  goalTarget: number
  revenueHistory: RevenueItem[]
  topClients: ClientItem[]
}

// Logic / State
const { fetchApi } = useApi()
const { getToken } = useAuth()
const userStore = useUserStore()

const loading = ref(true)
const exporting = ref(false)
const selectedRange = ref('6m')

const stats = ref<StatsData>({ 
  totalEarnings: 0, 
  blockedRevenue: 0, 
  pendingBlockersCount: 0, 
  goalPercent: 0, 
  goalTarget: 2000, 
  revenueHistory: [], 
  topClients: [] 
})

const isPro = computed(() => userStore.user?.tier === 'pro')

const ranges = computed(() => [
  { label: 'Last 24 Hours', value: '24h', pro: false },
  { label: 'Last 7 Days', value: '7d', pro: false },
  { label: 'Last 30 Days', value: '30d', pro: true },
  { label: 'Last 90 Days', value: '90d', pro: true },
  { label: 'Last 6 Months', value: '6m', pro: false },
])

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
    // Append range filter to export to keep consistency
    const response = await fetch(`${import.meta.env.VITE_API_URL}/stats/export?range=${selectedRange.value}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!response.ok) throw new Error('Export failed')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `earnings-report-${selectedRange.value}-${new Date().toISOString().split('T')[0]}.csv`
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
      
      <EarningsHeader 
        :loading="loading" 
        :exporting="exporting"
        @export="exportCSV" 
      />

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        <div class="max-w-6xl w-full mx-auto space-y-6">
          
          <EarningsStats 
            :loading="loading"
            :stats="stats"
          />

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <RevenueChart 
              v-model:selected-range="selectedRange"
              :loading="loading"
              :revenue-history="stats.revenueHistory"
              :ranges="ranges"
              :is-pro="isPro"
            />

            <TopClients 
              :loading="loading"
              :clients="stats.topClients"
            />
            
          </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
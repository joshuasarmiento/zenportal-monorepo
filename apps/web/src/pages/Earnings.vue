<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../lib/api'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import AppSidebar from '@/components/AppSidebar.vue'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, DollarSign, CreditCard, Loader2 } from 'lucide-vue-next'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { fetchApi } = useApi()
const loading = ref(true)

const stats = ref({
  totalEarnings: 0,
  pending: 0,
  goalPercent: 0,
  goalTarget: 2000
})

const revenueHistory = ref<any[]>([])
const topClients = ref<any[]>([])

const chartData = computed(() => ({
  labels: revenueHistory.value.map(r => r.month),
  datasets: [{
    label: 'Revenue',
    data: revenueHistory.value.map(r => r.amount),
    backgroundColor: '#3b82f6', 
    borderRadius: 6,
    hoverBackgroundColor: '#2563eb'
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context: any) => `$${context.raw}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#f3f4f6' },
      ticks: { callback: (value: any) => `$${value}` }
    },
    x: { grid: { display: false } }
  }
}

onMounted(async () => {
  try {
    const data = await fetchApi('/stats')
    stats.value = {
      totalEarnings: data.totalEarnings,
      pending: data.pending,
      goalPercent: data.goalPercent,
      goalTarget: data.goalTarget
    }
    revenueHistory.value = data.revenueHistory
    topClients.value = data.topClients
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">Platform</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Earnings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div class="ml-auto">
           <Button variant="outline" size="sm" class="gap-2">
            <Download class="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-[#F3F4F6] overflow-y-auto">
        
        <div v-if="loading" class="flex-1 flex flex-col items-center justify-center">
           <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>

        <div v-else class="max-w-6xl w-full mx-auto space-y-6">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card class="relative overflow-hidden">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle class="text-sm font-medium text-muted-foreground">Total Earnings (Month)</CardTitle>
                <DollarSign class="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent class="relative z-10">
                <div class="text-2xl font-bold">${{ stats.totalEarnings.toLocaleString() }}</div>
              </CardContent>
              <div class="absolute right-0 bottom-0 opacity-10 text-green-600 pointer-events-none">
                <DollarSign class="h-24 w-24 -mr-6 -mb-6" />
              </div>
            </Card>

            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium text-muted-foreground">Pending Payment</CardTitle>
                <CreditCard class="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">${{ stats.pending.toFixed(2) }}</div>
                <p class="text-xs text-muted-foreground mt-1">Based on unpaid invoices</p>
              </CardContent>
            </Card>

            <Card class="bg-slate-900 text-white border-slate-800 shadow-lg">
              <CardContent class="p-6">
                <div class="flex justify-between items-end mb-2">
                  <p class="text-sm text-slate-300 font-medium">Monthly Goal</p>
                  <p class="text-lg font-bold text-white">{{ stats.goalPercent }}%</p>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-3 mb-4">
                  <div class="bg-blue-500 h-3 rounded-full transition-all duration-1000" :style="{ width: `${stats.goalPercent}%` }"></div>
                </div>
                <p class="text-xs text-slate-400">
                   Target: ${{ stats.goalTarget.toLocaleString() }}
                </p>
              </CardContent>
            </Card>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <Card class="lg:col-span-2 flex flex-col">
              <CardHeader>
                <CardTitle>Revenue History</CardTitle>
              </CardHeader>
              <CardContent class="flex-1 min-h-[300px]">
                <Bar v-if="revenueHistory.length > 0" :data="chartData" :options="chartOptions" />
                <div v-else class="h-full flex items-center justify-center text-muted-foreground">
                   No data available yet.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clients (All Time)</CardTitle>
              </CardHeader>
              <CardContent>
                <div v-if="topClients.length > 0" class="space-y-6">
                  <div v-for="(client, index) in topClients" :key="client.name">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-3">
                        <div 
                          class="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                          :class="index === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'"
                        >
                          {{ getInitials(client.name) }}
                        </div>
                        <span class="text-sm font-medium text-foreground truncate max-w-[120px]">{{ client.name }}</span>
                      </div>
                      <span class="text-sm font-bold text-foreground">${{ client.amount.toLocaleString() }}</span>
                    </div>
                    
                    <div class="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full"
                        :class="index === 0 ? 'bg-indigo-500' : 'bg-orange-400'" 
                        :style="{ width: `${client.percent}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-10 text-muted-foreground text-sm">
                   No clients found.
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
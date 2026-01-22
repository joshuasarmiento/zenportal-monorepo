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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { fetchApi } = useApi()
const loading = ref(true)

// State matching the API response
const stats = ref({
  totalEarnings: 0,
  pending: 0,
  goalPercent: 0,
  goalTarget: 2000
})

const revenueHistory = ref<any[]>([])
const topClients = ref<any[]>([])

// Chart Configuration
const chartData = computed(() => ({
  labels: revenueHistory.value.map(r => r.month),
  datasets: [{
    label: 'Revenue',
    data: revenueHistory.value.map(r => r.amount),
    backgroundColor: '#3b82f6', // Tailwind blue-500
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
    x: {
      grid: { display: false }
    }
  }
}

// Fetch Data
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

// Helper for Initials (e.g., "Alpha Corp" -> "AC")
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
</script>

<template>
  <div class="h-full flex flex-col font-inter bg-[#F3F4F6]">
    
    <header class="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Financials</h2>
        <p class="text-sm text-gray-500">Track your income and hours.</p>
      </div>
      <button class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition flex items-center">
        <i class="ph ph-download-simple mr-1"></i> Export CSV
      </button>
    </header>

    <div v-if="loading" class="p-10 flex justify-center">
       <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>

    <div v-else class="p-8 max-w-6xl mx-auto w-full space-y-8">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-sm text-gray-500 font-medium">Total Earnings (This Month)</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">${{ stats.totalEarnings.toLocaleString() }}</p>
          </div>
          <div class="absolute right-0 bottom-0 opacity-10 text-green-600 pointer-events-none">
            <i class="ph ph-currency-dollar text-8xl -mb-4 -mr-4"></i>
          </div>
        </div>

        <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl">
          <p class="text-sm text-gray-500 font-medium">Pending Payment</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">${{ stats.pending.toFixed(2) }}</p>
          <p class="text-xs text-gray-400 mt-2">Based on unpaid invoices</p>
        </div>

        <div class="p-6 rounded-xl bg-slate-900 text-white shadow-lg">
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
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl lg:col-span-2 flex flex-col">
          <h3 class="text-lg font-bold text-gray-800 mb-6">Revenue History</h3>
          <div class="flex-1 min-h-[300px]">
            <Bar v-if="revenueHistory.length > 0" :data="chartData" :options="chartOptions" />
            <div v-else class="h-full flex items-center justify-center text-gray-400">
               No data available yet.
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Top Clients (All Time)</h3>
          
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
                  <span class="text-sm font-medium text-gray-700 truncate max-w-[120px]">{{ client.name }}</span>
                </div>
                <span class="text-sm font-bold text-gray-900">${{ client.amount.toLocaleString() }}</span>
              </div>
              
              <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full"
                  :class="index === 0 ? 'bg-indigo-500' : 'bg-orange-400'" 
                  :style="{ width: `${client.percent}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10 text-gray-400 text-sm">
             No clients found.
          </div>
          
        </div>

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'

// Mock Data Structure
const stats = ref({
  totalEarnings: 1850.00,
  pending: 420.00,
  pendingCount: 2,
  goalPercent: 92,
  goalTarget: 2000
})

// Data for the Chart
const revenueHistory = ref([
  { month: 'Jun', amount: 800 },
  { month: 'Jul', amount: 1200 },
  { month: 'Aug', amount: 600 },
  { month: 'Sep', amount: 1500 },
  { month: 'Oct', amount: 1850, isCurrent: true }
])

// Data for Top Clients
const topClients = ref([
  { name: 'Alpha Corp', initials: 'AC', amount: 1200, color: 'indigo', percent: 65 },
  { name: 'Beta LLC', initials: 'BL', amount: 650, color: 'orange', percent: 35 }
])

// Helper: Calculate max value for dynamic graph height
const maxRevenue = computed(() => Math.max(...revenueHistory.value.map(r => r.amount)))

// Helper: Get bar height percentage
const getBarHeight = (amount: number) => {
  return `${(amount / maxRevenue.value) * 100}%`
}
</script>

<template>
  <div class="h-full flex flex-col font-inter bg-[#F3F4F6]">
    
    <header class="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Financials</h2>
        <p class="text-sm text-gray-500">Track your income and hours.</p>
      </div>
      <div class="flex items-center gap-3">
        <select class="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none cursor-pointer text-gray-700 hover:border-gray-300 transition">
          <option>This Month (Oct)</option>
          <option>Last Month (Sep)</option>
          <option>This Year</option>
        </select>
        <button class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition flex items-center">
          <i class="ph ph-download-simple mr-1"></i> Export CSV
        </button>
      </div>
    </header>

    <div class="p-8 max-w-6xl mx-auto w-full space-y-8">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-sm text-gray-500 font-medium">Total Earnings (Oct)</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">${{ stats.totalEarnings.toLocaleString() }}</p>
            <div class="flex items-center mt-2 text-green-600 text-sm font-medium">
              <i class="ph ph-trend-up mr-1"></i> +12% vs last month
            </div>
          </div>
          <div class="absolute right-0 bottom-0 opacity-10 text-green-600 pointer-events-none">
            <i class="ph ph-currency-dollar text-8xl -mb-4 -mr-4"></i>
          </div>
        </div>

        <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl">
          <p class="text-sm text-gray-500 font-medium">Pending Payment</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">${{ stats.pending.toFixed(2) }}</p>
          <div class="flex items-center mt-2 text-gray-400 text-sm">
            <span class="w-2 h-2 rounded-full bg-orange-400 mr-2"></span> {{ stats.pendingCount }} Invoices Unpaid
          </div>
        </div>

        <div class="p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg">
          <div class="flex justify-between items-end mb-2">
            <p class="text-sm text-slate-300 font-medium">Monthly Goal</p>
            <p class="text-lg font-bold text-white">{{ stats.goalPercent }}%</p>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-3 mb-4">
            <div class="bg-blue-500 h-3 rounded-full transition-all duration-1000" :style="{ width: `${stats.goalPercent}%` }"></div>
          </div>
          <p class="text-xs text-slate-400">
            You are only <span class="text-white font-bold">${{ stats.goalTarget - stats.totalEarnings }}</span> away from your ${{ stats.goalTarget.toLocaleString() }} goal! 🚀
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl lg:col-span-2">
          <h3 class="text-lg font-bold text-gray-800 mb-6">Revenue History</h3>
          
          <div class="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
            <div 
              v-for="item in revenueHistory" 
              :key="item.month" 
              class="flex flex-col items-center gap-2 flex-1 group w-full"
            >
              <div 
                class="relative w-full rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-80"
                :class="item.isCurrent ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-blue-100 group-hover:bg-blue-200'"
                :style="{ height: getBarHeight(item.amount) }"
              >
                <div 
                  class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded transition-opacity duration-200 whitespace-nowrap z-10"
                  :class="item.isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                >
                  ${{ item.amount }}
                </div>
              </div>
              
              <span 
                class="text-xs"
                :class="item.isCurrent ? 'font-bold text-blue-600' : 'text-gray-500'"
              >
                {{ item.month }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 rounded-xl">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Top Clients</h3>
          
          <div class="space-y-6">
            <div v-for="client in topClients" :key="client.name">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                    :class="client.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'"
                  >
                    {{ client.initials }}
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ client.name }}</span>
                </div>
                <span class="text-sm font-bold text-gray-900">${{ client.amount.toLocaleString() }}</span>
              </div>
              
              <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full"
                  :class="client.color === 'indigo' ? 'bg-indigo-500' : 'bg-orange-400'" 
                  :style="{ width: `${client.percent}%` }"
                ></div>
              </div>
            </div>
          </div>
          
          <button class="w-full mt-8 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition">
            View Detailed Report
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
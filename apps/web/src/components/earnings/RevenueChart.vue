<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, DollarSign, Lock } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

const props = defineProps<{
  loading: boolean
  revenueHistory: { period: string; amount: number }[]
  selectedRange: string
  ranges: { label: string; value: string; pro: boolean }[]
  isPro: boolean
}>()

const emit = defineEmits(['update:selectedRange'])

// Chart Logic
const chartSeries = computed(() => [{
  name: 'Revenue',
  data: props.revenueHistory.map(item => item.amount)
}])

const chartOptions = computed<ApexOptions>(() => {
  const isDark = document.documentElement.classList.contains('dark')

  return {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', background: 'transparent' },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '45%', distributed: false } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: props.revenueHistory.map(item => item.period),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: isDark ? '#94a3b8' : '#64748b', fontSize: '12px' } }
    },
    yaxis: {
      labels: {
        style: { colors: isDark ? '#94a3b8' : '#64748b', fontSize: '12px' },
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },
    grid: {
      borderColor: isDark ? '#1e293b' : '#e2e8f0', 
      strokeDashArray: 4, 
      xaxis: { lines: { show: false } }
    },
    fill: { opacity: 1, colors: ['#3b82f6'] },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: { formatter: (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }
    }
  }
})
</script>

<template>
  <Card class="lg:col-span-2 flex flex-col min-h-[400px]">
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle>Revenue History</CardTitle>
      <Select 
        :model-value="selectedRange" 
        @update:model-value="emit('update:selectedRange', $event)"
      >
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
    </CardHeader>
    <CardContent class="flex-1">
      <div v-if="loading" class="w-full h-[300px] flex items-center justify-center">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>
      
      <div v-else-if="revenueHistory.length > 0" class="w-full h-[300px]">
        <VueApexCharts
          type="bar"
          height="300"
          width="100%"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
      
      <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
        <div class="p-4 bg-muted/50 rounded-full mb-2">
          <DollarSign class="h-6 w-6 opacity-50" />
        </div>
        <p class="text-lg font-medium">No revenue data yet</p>
        <p class="text-sm mt-1">Complete some tasks to see your earnings trend.</p>
      </div>
    </CardContent>
  </Card>
</template>
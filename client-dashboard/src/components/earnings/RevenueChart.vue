<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, BarChart2, Lock } from 'lucide-vue-next'
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
    plotOptions: { bar: { borderRadius: 4, columnWidth: '40%', distributed: false } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: props.revenueHistory.map(item => item.period),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: isDark ? '#a1a1aa' : '#71717a', fontSize: '11px', fontWeight: 500 } }
    },
    yaxis: {
      labels: {
        style: { colors: isDark ? '#a1a1aa' : '#71717a', fontSize: '11px', fontWeight: 500 },
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },
    grid: {
      borderColor: isDark ? '#27272a' : '#f4f4f5', 
      strokeDashArray: 4, 
      xaxis: { lines: { show: false } }
    },
    fill: { opacity: 1, colors: [isDark ? '#e4e4e7' : '#18181b'] }, // Zinc-200 on dark, Zinc-900 on light
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: { formatter: (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }
    }
  }
})
</script>

<template>
  <Card class="lg:col-span-2 flex flex-col min-h-[400px] border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
    <CardHeader class="flex flex-row items-center justify-between border-b border-border pb-4">
      <CardTitle class="text-base font-semibold text-foreground">Revenue History</CardTitle>
      <Select 
        :model-value="selectedRange" 
        @update:model-value="emit('update:selectedRange', $event)"
      >
        <SelectTrigger class="w-[160px] h-9 text-xs font-medium bg-background border-border rounded-lg">
          <SelectValue placeholder="Select Range" />
        </SelectTrigger>
        <SelectContent class="border-border bg-popover">
          <SelectItem 
            v-for="range in ranges" 
            :key="range.value" 
            :value="range.value"
            :disabled="range.pro && !isPro"
            class="text-xs focus:bg-muted"
          >
            <div class="flex items-center justify-between w-full gap-2">
              <span>{{ range.label }}</span>
              <div v-if="range.pro && !isPro" class="flex items-center gap-1 text-muted-foreground bg-muted px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">
                <Lock class="h-2.5 w-2.5" /> Pro
              </div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </CardHeader>
    <CardContent class="flex-1 pt-6">
      <div v-if="loading" class="w-full h-[300px] flex items-center justify-center">
        <Loader2 class="h-6 w-6 animate-spin text-foreground" />
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
        <div class="p-4 bg-muted rounded-2xl mb-3 border border-border">
          <BarChart2 class="h-6 w-6 opacity-50" />
        </div>
        <p class="text-sm font-medium text-muted-foreground">No revenue data available</p>
        <p class="text-xs text-muted-foreground mt-1">Start logging work to see your growth.</p>
      </div>
    </CardContent>
  </Card>
</template>
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, AlertTriangle } from 'lucide-vue-next'

defineProps<{
  loading: boolean
  stats: {
    totalEarnings: number
    blockedRevenue: number
    pendingBlockersCount: number
    goalPercent: number
    goalTarget: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card class="relative overflow-hidden">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle class="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
        <DollarSign class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent class="relative z-10">
        <div v-if="loading" class="h-8 w-24 bg-muted animate-pulse rounded"></div>
        <div v-else class="text-2xl font-bold">
          ${{ stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </div>
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
</template>
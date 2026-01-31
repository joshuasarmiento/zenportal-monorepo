<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, AlertTriangle, Target } from 'lucide-vue-next'

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
    <Card class="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all duration-300">
      <div class="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle class="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Earnings</CardTitle>
        <div class="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
           <DollarSign class="h-4 w-4 text-zinc-900 dark:text-white" />
        </div>
      </CardHeader>
      <CardContent class="relative z-10 pt-2">
        <div v-if="loading" class="h-8 w-24 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded"></div>
        <div v-else class="text-3xl font-semibold tracking-tighter text-zinc-900 dark:text-white">
          ${{ stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </div>
      </CardContent>
    </Card>

    <Card class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-xs font-bold text-zinc-400 uppercase tracking-widest">Blocked Revenue</CardTitle>
        <div class="h-8 w-8 rounded-lg flex items-center justify-center border transition-colors"
             :class="stats.pendingBlockersCount > 0 
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800' 
                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'">
           <AlertTriangle class="h-4 w-4" :class="stats.pendingBlockersCount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-400'" />
        </div>
      </CardHeader>
      <CardContent class="pt-2">
        <div v-if="loading" class="h-8 w-24 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded"></div>
        <template v-else>
          <div class="text-3xl font-semibold tracking-tighter" :class="stats.blockedRevenue > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-900 dark:text-white'">
            ${{ stats.blockedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
          <p class="text-xs text-zinc-500 mt-2 font-medium" v-if="stats.pendingBlockersCount > 0">
            {{ stats.pendingBlockersCount }} blocked tasks require attention
          </p>
        </template>
      </CardContent>
    </Card>

    <Card class="border border-zinc-900 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-950 text-white shadow-lg shadow-zinc-900/10 dark:shadow-none">
      <CardContent class="p-6">
        <div class="flex justify-between items-center mb-4">
          <p class="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
             <Target class="h-4 w-4" /> Monthly Goal
          </p>
          <div v-if="loading" class="h-6 w-12 bg-zinc-800 animate-pulse rounded"></div>
          <p v-else class="text-2xl font-bold tracking-tighter">{{ stats.goalPercent }}%</p>
        </div>
        
        <div class="w-full bg-zinc-800 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            class="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: loading ? '0%' : `${stats.goalPercent}%` }"
          ></div>
        </div>
        
        <p class="text-xs text-zinc-500 font-mono">Target: ${{ stats.goalTarget.toLocaleString() }}</p>
      </CardContent>
    </Card>
  </div>
</template>
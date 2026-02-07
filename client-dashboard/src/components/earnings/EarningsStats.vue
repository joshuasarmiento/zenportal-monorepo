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
    <Card class="relative overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
      <div class="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Earnings</CardTitle>
        <div class="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border">
           <DollarSign class="h-4 w-4 text-foreground" />
        </div>
      </CardHeader>
      <CardContent class="relative z-10 pt-2">
        <div v-if="loading" class="h-8 w-24 bg-muted animate-pulse rounded"></div>
        <div v-else class="text-3xl font-semibold tracking-tighter text-foreground">
          ${{ stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </div>
      </CardContent>
    </Card>

    <Card class="border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Blocked Revenue</CardTitle>
        <div class="h-8 w-8 rounded-lg flex items-center justify-center border transition-colors"
             :class="stats.pendingBlockersCount > 0 
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800' 
                : 'bg-muted border-border'">
           <AlertTriangle class="h-4 w-4" :class="stats.pendingBlockersCount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'" />
        </div>
      </CardHeader>
      <CardContent class="pt-2">
        <div v-if="loading" class="h-8 w-24 bg-muted animate-pulse rounded"></div>
        <template v-else>
          <div class="text-3xl font-semibold tracking-tighter" :class="stats.blockedRevenue > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'">
            ${{ stats.blockedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
          <p class="text-xs text-muted-foreground mt-2 font-medium" v-if="stats.pendingBlockersCount > 0">
            {{ stats.pendingBlockersCount }} blocked tasks require attention
          </p>
        </template>
      </CardContent>
    </Card>

    <Card class="border border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/10">
      <CardContent class="p-6">
        <div class="flex justify-between items-center mb-4">
          <p class="text-xs font-bold text-primary-foreground/70 uppercase tracking-widest flex items-center gap-2">
             <Target class="h-4 w-4" /> Monthly Goal
          </p>
          <div v-if="loading" class="h-6 w-12 bg-primary-foreground/20 animate-pulse rounded"></div>
          <p v-else class="text-2xl font-bold tracking-tighter">{{ stats.goalPercent }}%</p>
        </div>
        
        <div class="w-full bg-primary-foreground/20 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            class="bg-primary-foreground h-2 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: loading ? '0%' : `${stats.goalPercent}%` }"
          ></div>
        </div>
        
        <p class="text-xs text-primary-foreground/70 font-mono">Target: ${{ stats.goalTarget.toLocaleString() }}</p>
      </CardContent>
    </Card>
  </div>
</template>
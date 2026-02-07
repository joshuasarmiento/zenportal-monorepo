<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Briefcase, AlertTriangle } from 'lucide-vue-next'

defineProps<{
  stats: {
    hoursThisMonth: number
    activeClients: number
    pendingBlockersCount: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card class="border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent class="p-6 flex items-start justify-between">
        <div>
           <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Hours</p>
           <div class="text-3xl font-semibold tracking-tighter text-foreground">
             {{ stats.hoursThisMonth }} <span class="text-lg text-muted-foreground font-medium">h</span>
           </div>
        </div>
        <div class="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800">
           <Clock class="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      </CardContent>
    </Card>

    <Card class="border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent class="p-6 flex items-start justify-between">
        <div>
           <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Clients</p>
           <div class="text-3xl font-semibold tracking-tighter text-foreground">
             {{ stats.activeClients }}
           </div>
        </div>
        <div class="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center border border-green-100 dark:border-green-800">
           <Briefcase class="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
      </CardContent>
    </Card>

    <Card class="border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent class="p-6 flex items-start justify-between">
        <div>
           <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Blockers</p>
           <div class="text-3xl font-semibold tracking-tighter" :class="stats.pendingBlockersCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-foreground'">
             {{ stats.pendingBlockersCount }}
           </div>
        </div>
        <div class="h-10 w-10 rounded-xl flex items-center justify-center border transition-colors"
             :class="stats.pendingBlockersCount > 0 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800' 
                : 'bg-muted/50 border-border'">
           <AlertTriangle class="h-5 w-5" :class="stats.pendingBlockersCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
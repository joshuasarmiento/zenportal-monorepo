<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{
  loading: boolean
  clients: { name: string; amount: number; percent: number }[]
}>()

const getInitials = (name: string) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}
</script>

<template>
  <Card class="flex flex-col h-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all duration-300">
    <CardHeader class="border-b border-zinc-100 dark:border-zinc-800 pb-4">
      <CardTitle class="text-base font-semibold text-zinc-900 dark:text-white">Top Clients</CardTitle>
    </CardHeader>
    <CardContent class="flex-1 pt-6">
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="space-y-2">
          <div class="flex justify-between">
            <div class="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div>
            <div class="h-4 w-12 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div>
          </div>
          <div class="h-2 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div>
        </div>
      </div>

      <div v-else-if="clients.length > 0" class="space-y-8">
        <div v-for="(client, index) in clients" :key="client.name">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border"
                :class="index === 0 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent' 
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-100 dark:border-zinc-800'">
                {{ getInitials(client.name) }}
              </div>
              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate max-w-[120px]" :title="client.name">{{ client.name }}</span>
            </div>
            <span class="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">${{ client.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
          <div class="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 ease-out" 
              :class="index === 0 ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-400 dark:bg-zinc-600'"
              :style="{ width: `${client.percent}%` }"></div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-10 flex flex-col items-center justify-center h-full">
        <p class="text-zinc-400 text-sm font-medium">No client activity yet.</p>
      </div>
    </CardContent>
  </Card>
</template>
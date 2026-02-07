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
  <Card class="flex flex-col h-full border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
    <CardHeader class="border-b border-border pb-4">
      <CardTitle class="text-base font-semibold text-foreground">Top Clients</CardTitle>
    </CardHeader>
    <CardContent class="flex-1 pt-6">
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="space-y-2">
          <div class="flex justify-between">
            <div class="h-4 w-24 bg-muted animate-pulse rounded"></div>
            <div class="h-4 w-12 bg-muted animate-pulse rounded"></div>
          </div>
          <div class="h-2 w-full bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      <div v-else-if="clients.length > 0" class="space-y-8">
        <div v-for="(client, index) in clients" :key="client.name">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border"
                :class="index === 0 
                  ? 'bg-primary text-primary-foreground border-transparent' 
                  : 'bg-muted text-muted-foreground border-border'">
                {{ getInitials(client.name) }}
              </div>
              <span class="text-sm font-medium text-foreground truncate max-w-[120px]" :title="client.name">{{ client.name }}</span>
            </div>
            <span class="text-sm font-bold text-foreground tracking-tight">${{ client.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
          <div class="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 ease-out" 
              :class="index === 0 ? 'bg-primary' : 'bg-muted-foreground'"
              :style="{ width: `${client.percent}%` }"></div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-10 flex flex-col items-center justify-center h-full">
        <p class="text-muted-foreground text-sm font-medium">No client activity yet.</p>
      </div>
    </CardContent>
  </Card>
</template>
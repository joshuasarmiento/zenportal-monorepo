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
  <Card class="flex flex-col h-full">
    <CardHeader>
      <CardTitle>Top Clients</CardTitle>
    </CardHeader>
    <CardContent class="flex-1">
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="space-y-2">
          <div class="flex justify-between">
            <div class="h-4 w-24 bg-muted animate-pulse rounded"></div>
            <div class="h-4 w-12 bg-muted animate-pulse rounded"></div>
          </div>
          <div class="h-2 w-full bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      <div v-else-if="clients.length > 0" class="space-y-6">
        <div v-for="(client, index) in clients" :key="client.name">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0"
                :class="index === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'">
                {{ getInitials(client.name) }}
              </div>
              <span class="text-sm font-medium text-foreground truncate max-w-[120px]" :title="client.name">{{ client.name }}</span>
            </div>
            <span class="text-sm font-bold text-foreground">${{ client.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
          <div class="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" 
              :class="index === 0 ? 'bg-primary' : 'bg-orange-400'"
              :style="{ width: `${client.percent}%` }"></div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-10 text-muted-foreground text-sm">
        No client activity found.
      </div>
    </CardContent>
  </Card>
</template>
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Briefcase, AlertCircle } from 'lucide-vue-next'

defineProps<{
  stats: {
    hoursThisMonth: number
    activeClients: number
    pendingBlockersCount: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
        <Clock class="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.hoursThisMonth }} h</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
        <Briefcase class="h-4 w-4 text-green-600 dark:text-green-400" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.activeClients }}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground">Total Blockers</CardTitle>
        <AlertCircle class="h-4 w-4 text-red-600 dark:text-red-400" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-red-600 dark:text-red-400">
          {{ stats.pendingBlockersCount }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
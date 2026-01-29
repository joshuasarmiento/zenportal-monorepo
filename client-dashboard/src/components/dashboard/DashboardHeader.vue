<script setup lang="ts">
import { computed } from 'vue'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PlusCircle, Crown } from 'lucide-vue-next'

// Props define what data this component needs from the parent
const props = defineProps<{
  loading: boolean
  isPro: boolean
  logCount: number
  logLimit: number
}>()

// Emits define events this component sends back to the parent
const emit = defineEmits(['create', 'upgrade'])

// Logic specific to the header UI
const isLimitReached = computed(() => !props.isPro && props.logCount >= props.logLimit)
const logUsagePercent = computed(() => Math.min(100, (props.logCount / props.logLimit) * 100))
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div class="ml-auto flex items-center gap-4">
      <div v-if="!loading && !isPro" class="hidden md:flex flex-col items-end gap-1 w-32">
        <div class="flex justify-between w-full text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          <span>Monthly Limit</span>
          <span :class="{'text-orange-600 font-bold': isLimitReached}">
            {{ logCount }}/{{ logLimit }}
          </span>
        </div>
        <Progress 
          :model-value="logUsagePercent" 
          class="h-1.5" 
          :class="{'bg-orange-100 dark:bg-orange-900/30': isLimitReached}" 
        />
      </div>

      <Button 
        @click="isLimitReached ? emit('upgrade') : emit('create')"
        class="gap-2 transition-all"
        :variant="isLimitReached ? 'outline' : 'default'"
        :class="isLimitReached ? 'text-xs h-8 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800' : ''"
      >
        <Crown v-if="isLimitReached" class="h-4 w-4" />
        <PlusCircle v-else class="h-4 w-4" /> 
        {{ isLimitReached ? 'Upgrade to Log' : 'Log Work' }}
      </Button>
    </div>
  </header>
</template>
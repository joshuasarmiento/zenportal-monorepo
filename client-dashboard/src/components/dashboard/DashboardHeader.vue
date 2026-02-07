<script setup lang="ts">
import { computed } from 'vue'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Plus, Crown } from 'lucide-vue-next'

const props = defineProps<{
  loading: boolean
  isPro: boolean
  logCount: number
  logLimit: number
}>()

const emit = defineEmits(['create', 'upgrade'])

const isLimitReached = computed(() => !props.isPro && props.logCount >= props.logLimit)
const logUsagePercent = computed(() => Math.min(100, (props.logCount / props.logLimit) * 100))
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-6 sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
      <Separator orientation="vertical" class="mr-2 h-4 bg-border" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage class="font-semibold text-foreground tracking-tight">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div class="ml-auto flex items-center gap-6">
      <div v-if="!loading && !isPro" class="hidden md:flex flex-col items-end gap-1.5 w-40">
        <div class="flex justify-between w-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span>Monthly Limit</span>
          <span :class="{'text-orange-600 dark:text-orange-400': isLimitReached, 'text-foreground': !isLimitReached}">
            {{ logCount }} / {{ logLimit }}
          </span>
        </div>
        <Progress 
          :model-value="logUsagePercent" 
          class="h-1 bg-muted" 
          :class="{'[&>div]:bg-orange-500': isLimitReached, '[&>div]:bg-foreground': !isLimitReached}" 
        />
      </div>

      <Button 
        @click="isLimitReached ? emit('upgrade') : emit('create')"
        class="h-9 px-4 rounded-full font-medium transition-all shadow-sm"
        :class="[
            isLimitReached 
                ? 'bg-linear-to-r from-orange-500 to-red-500 text-white hover:opacity-90 border-0' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
        ]"
      >
        <Crown v-if="isLimitReached" class="h-3.5 w-3.5 mr-2" />
        <Plus v-else class="h-3.5 w-3.5 mr-2" /> 
        {{ isLimitReached ? 'Upgrade Plan' : 'Log Work' }}
      </Button>
    </div>
  </header>
</template>
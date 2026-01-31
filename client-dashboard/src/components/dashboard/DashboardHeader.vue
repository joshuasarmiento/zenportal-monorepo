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
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" />
      <Separator orientation="vertical" class="mr-2 h-4 bg-zinc-200 dark:bg-zinc-800" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage class="font-semibold text-zinc-900 dark:text-white tracking-tight">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div class="ml-auto flex items-center gap-6">
      <div v-if="!loading && !isPro" class="hidden md:flex flex-col items-end gap-1.5 w-40">
        <div class="flex justify-between w-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <span>Monthly Limit</span>
          <span :class="{'text-orange-600 dark:text-orange-400': isLimitReached, 'text-zinc-900 dark:text-white': !isLimitReached}">
            {{ logCount }} / {{ logLimit }}
          </span>
        </div>
        <Progress 
          :model-value="logUsagePercent" 
          class="h-1 bg-zinc-100 dark:bg-zinc-800" 
          :class="{'[&>div]:bg-orange-500': isLimitReached, '[&>div]:bg-zinc-900 dark:[&>div]:bg-white': !isLimitReached}" 
        />
      </div>

      <Button 
        @click="isLimitReached ? emit('upgrade') : emit('create')"
        class="h-9 px-4 rounded-full font-medium transition-all shadow-sm"
        :class="[
            isLimitReached 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 border-0' 
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
        ]"
      >
        <Crown v-if="isLimitReached" class="h-3.5 w-3.5 mr-2" />
        <Plus v-else class="h-3.5 w-3.5 mr-2" /> 
        {{ isLimitReached ? 'Upgrade Plan' : 'Log Work' }}
      </Button>
    </div>
  </header>
</template>
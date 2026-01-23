<script setup lang="ts">
import { computed } from 'vue'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UserPlus, Lock } from 'lucide-vue-next'

const props = defineProps<{
  loading: boolean
  isPro: boolean
  activeCount: number
  limit: number
}>()

const emit = defineEmits(['add', 'upgrade'])

const isLimitReached = computed(() => !props.isPro && props.activeCount >= props.limit)
const usagePercent = computed(() => props.isPro ? 0 : (props.activeCount / props.limit) * 100)
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="#">Platform</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Clients</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div class="ml-auto flex items-center gap-4">
      <div v-if="!loading && !isPro" class="hidden md:flex flex-col items-end gap-1 w-32">
        <div class="flex justify-between w-full text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          <span>Client Limit</span>
          <span :class="{'text-orange-600 font-bold': isLimitReached}">{{ activeCount }}/{{ limit }}</span>
        </div>
        <Progress 
          :model-value="usagePercent" 
          class="h-1.5" 
          :class="{'bg-orange-100 dark:bg-orange-900/30': isLimitReached}" 
        />
      </div>

      <div v-if="loading" class="h-9 w-32 bg-muted animate-pulse rounded-md"></div>

      <Button 
        v-else
        @click="isLimitReached ? emit('upgrade') : emit('add')"
        class="gap-2 transition-all"
        :variant="isLimitReached ? 'outline' : 'default'"
        :class="isLimitReached ? 'text-xs h-8 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800' : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900'"
      >
        <Lock v-if="isLimitReached" class="h-4 w-4" />
        <UserPlus v-else class="h-4 w-4" /> 
        {{ isLimitReached ? 'Upgrade to Add' : 'Add Client' }}
      </Button>
    </div>
  </header>
</template>
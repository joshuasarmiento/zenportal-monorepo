<script setup lang="ts">
import { computed } from 'vue'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { UserPlus, Lock } from 'lucide-vue-next'

const props = defineProps<{
  loading: boolean
  isPro: boolean
  activeCount: number
  limit: number
}>()

const emit = defineEmits(['add', 'upgrade'])

const isLimitReached = computed(() => !props.isPro && props.activeCount >= props.limit)

// Clamp percentage to 100% so the bar doesn't break visually if count > limit (downgrade case)
const usagePercent = computed(() => {
  if (props.isPro) return 0
  const pct = (props.activeCount / props.limit) * 100
  return Math.min(pct, 100)
})
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>          
          <BreadcrumbItem>
            <BreadcrumbPage>Clients</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div class="ml-auto flex items-center gap-4">
      <div v-if="!loading && !isPro" class="hidden md:flex flex-col gap-1 w-32">
        <div class="flex justify-between w-full text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          <span>Client Limit</span>
          <span :class="{'text-amber-600 font-bold': isLimitReached}">
            {{ activeCount }}/{{ limit }}
          </span>
        </div>
        <Progress 
          :model-value="usagePercent" 
          class="h-1.5 bg-secondary" 
          :class="isLimitReached ? '[&>div]:bg-amber-600' : '[&>div]:bg-primary'"
        />
      </div>

      <div v-if="loading" class="h-9 w-32 bg-muted animate-pulse rounded-md"></div>

      <TooltipProvider v-else>
        <Tooltip :delay-duration="0">
          <TooltipTrigger as-child>
            <span tabindex="0">
              <Button 
                @click="isLimitReached ? emit('upgrade') : emit('add')"
                class="gap-2 transition-all shadow-sm"
                :variant="isLimitReached ? 'outline' : 'default'"
                :class="isLimitReached 
                  ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'"
              >
                <Lock v-if="isLimitReached" class="h-4 w-4" />
                <UserPlus v-else class="h-4 w-4" /> 
                {{ isLimitReached ? 'Unlock Unlimited' : 'Add Client' }}
              </Button>
            </span>
          </TooltipTrigger>

          <TooltipContent v-if="isLimitReached" side="bottom" class="max-w-xs p-4 text-center">
            <p class="font-semibold text-amber-600 mb-1">
              Limit Reached ({{ activeCount }}/{{ limit }})
            </p>
            <p class="text-xs text-muted-foreground mb-3">
              You have hit the limit for the Free plan. 
              <span v-if="activeCount > limit">You currently have more active clients than allowed.</span>
              Upgrade to Agency Pro to add unlimited clients.
            </p>
            <div class="text-xs font-medium text-primary underline cursor-pointer" @click="emit('upgrade')">
              Upgrade now &rarr;
            </div>
          </TooltipContent>
          
          <TooltipContent v-else>
            Create a new client workspace
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </header>
</template>
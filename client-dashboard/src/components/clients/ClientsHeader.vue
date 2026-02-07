<script setup lang="ts">
import { computed } from 'vue'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { UserPlus, Crown } from 'lucide-vue-next'

const props = defineProps<{
  loading: boolean
  isPro: boolean
  activeCount: number
  limit: number
}>()

const emit = defineEmits(['add', 'upgrade'])

const isLimitReached = computed(() => !props.isPro && props.activeCount >= props.limit)

const usagePercent = computed(() => {
  if (props.isPro) return 0
  const pct = (props.activeCount / props.limit) * 100
  return Math.min(pct, 100)
})
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-6 sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
      <Separator orientation="vertical" class="mr-2 h-4 bg-border" />
      <Breadcrumb>
        <BreadcrumbList>          
          <BreadcrumbItem>
            <BreadcrumbPage class="font-semibold text-foreground tracking-tight">Clients</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div class="ml-auto flex items-center gap-6">
      <div v-if="!loading && !isPro" class="hidden md:flex flex-col items-end gap-1.5 w-40">
        <div class="flex justify-between w-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span>Client Limit</span>
          <span :class="{'text-orange-600 dark:text-orange-400': isLimitReached, 'text-foreground': !isLimitReached}">
            {{ activeCount }} / {{ limit }}
          </span>
        </div>
        <Progress 
          :model-value="usagePercent" 
          class="h-1 bg-muted" 
          :class="isLimitReached ? '[&>div]:bg-orange-500' : '[&>div]:bg-primary'"
        />
      </div>

      <div v-if="loading" class="h-9 w-32 bg-muted animate-pulse rounded-full"></div>

      <TooltipProvider v-else>
        <Tooltip :delay-duration="0">
          <TooltipTrigger as-child>
            <span tabindex="0">
              <Button 
                @click="isLimitReached ? emit('upgrade') : emit('add')"
                class="h-9 px-4 rounded-full font-medium transition-all shadow-sm"
                :class="[
                  isLimitReached 
                    ? 'bg-linear-to-r from-orange-500 to-red-500 text-white hover:opacity-90 border-0' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                ]"
              >
                <Crown v-if="isLimitReached" class="h-3.5 w-3.5 mr-2" />
                <UserPlus v-else class="h-3.5 w-3.5 mr-2" /> 
                {{ isLimitReached ? 'Unlock Unlimited' : 'Add Client' }}
              </Button>
            </span>
          </TooltipTrigger>

          <TooltipContent v-if="isLimitReached" side="bottom" class="max-w-xs p-4 text-center border-border bg-popover shadow-xl">
            <p class="font-bold text-orange-600 dark:text-orange-400 mb-1">
              Limit Reached ({{ activeCount }}/{{ limit }})
            </p>
            <p class="text-xs text-muted-foreground mb-3 leading-relaxed">
              You have hit the limit for the Free plan. 
              <span v-if="activeCount > limit">You currently have more active clients than allowed.</span>
              Upgrade to Agency Pro to add unlimited clients.
            </p>
            <div class="text-xs font-bold text-foreground underline cursor-pointer" @click="emit('upgrade')">
              Upgrade now &rarr;
            </div>
          </TooltipContent>
          
          <TooltipContent v-else class="bg-primary text-primary-foreground border-0 text-xs font-medium">
            Create a new client workspace
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </header>
</template>
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Link as LinkIcon, Pencil, Plus, Crown, ArrowRight } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps<{
  loading: boolean
  clients: any[]
  isLimitReached: boolean
}>()

const emit = defineEmits(['add', 'edit', 'upgrade'])

const copyLink = (token: string) => {
  if (!token) return toast.error('Error: No token found')
  navigator.clipboard.writeText(`${window.location.origin}/c/${token}`)
  toast.success('Magic Link copied!')
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20">
      <Loader2 class="h-8 w-8 animate-spin text-foreground mb-4" />
      <p class="text-muted-foreground font-medium text-sm">Loading clients...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <Card v-for="(c, index) in clients" :key="c.id"
        class="group relative flex flex-col border border-border bg-card shadow-sm hover:shadow-xl hover:border-border transition-all duration-300 overflow-hidden">
        
        <div v-if="c.status === 'archived'" class="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 pointer-events-none flex items-center justify-center">
            <Badge variant="secondary" class="bg-muted text-muted-foreground">Archived</Badge>
        </div>

        <CardHeader class="flex flex-row items-start justify-between space-y-0 pb-3 relative z-0">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border border-border shadow-sm"
            :class="index % 2 === 0 ? 'bg-muted/50 text-foreground' : 'bg-primary text-primary-foreground'">
            {{ c.companyName.substring(0, 2).toUpperCase() }}
          </div>
          <div v-if="c.status === 'active'" class="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        </CardHeader>
        
        <CardContent class="pb-2 relative z-0">
          <CardTitle class="text-xl font-bold tracking-tight text-foreground">{{ c.companyName }}</CardTitle>
          <CardDescription class="truncate mt-1 text-sm text-muted-foreground">{{ c.contactEmail || c.contactName || 'No contact info' }}
          </CardDescription>
        </CardContent>
        
        <CardFooter class="flex flex-col gap-4 mt-auto pt-6 relative z-0">
          <div class="w-full flex items-center justify-between text-xs font-medium uppercase tracking-widest text-muted-foreground border-t border-border pt-4">
            <span>Hourly Rate</span>
            <span class="text-foreground font-bold text-sm tracking-tight">${{ c.hourlyRate }}/hr</span>
          </div>
          <div class="flex gap-3 w-full">
            <Button variant="outline" class="flex-1 gap-2 h-9 text-xs font-semibold border-border hover:bg-muted" @click="copyLink(c.accessToken)">
              <LinkIcon class="h-3.5 w-3.5" /> Magic Link
            </Button>
            <Button variant="ghost" size="icon" @click="emit('edit', c.id)" class="h-9 w-9 border border-border hover:bg-muted text-muted-foreground">
              <Pencil class="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <button 
        v-if="!isLimitReached"
        @click="emit('add')"
        class="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted/50 transition-all duration-300 cursor-pointer min-h-[280px] group bg-transparent"
      >
        <div class="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <Plus class="h-6 w-6 text-foreground" />
        </div>
        <span class="font-bold text-sm tracking-tight">Add New Client</span>
      </button>

      <button 
        v-else
        @click="emit('upgrade')"
        class="relative border border-dashed border-orange-200 dark:border-orange-900/50 rounded-xl p-6 flex flex-col items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all duration-300 cursor-pointer min-h-[280px] group bg-transparent overflow-hidden"
      > 
        <div class="absolute inset-0 bg-orange-500/5 blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>

        <div class="relative w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm ring-1 ring-orange-200 dark:ring-orange-800">
          <Crown class="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <span class="font-bold text-lg tracking-tight text-foreground mb-1">Unlock Unlimited</span>
        <p class="text-xs text-center text-muted-foreground max-w-[200px] mb-4">
          You've reached the free limit. Upgrade to Agency Pro to scale.
        </p>
        <div class="text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
           Upgrade <ArrowRight class="h-3 w-3" />
        </div>
      </button>

    </div>
  </div>
</template>
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Link as LinkIcon, Pencil, Plus, Crown } from 'lucide-vue-next'
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
      <Loader2 class="h-8 w-8 animate-spin text-primary mb-4" />
      <p class="text-muted-foreground">Loading clients...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <Card v-for="(c, index) in clients" :key="c.id"
        class="hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden">
        
        <div v-if="c.status === 'archived'" class="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 pointer-events-none" />

        <CardHeader class="flex flex-row items-start justify-between space-y-0 pb-2 relative z-20">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
            :class="index % 2 === 0 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300'">
            {{ c.companyName.substring(0, 2).toUpperCase() }}
          </div>
          <Badge :variant="c.status === 'archived' ? 'secondary' : 'default'" class="uppercase">
            {{ c.status || 'Active' }}
          </Badge>
        </CardHeader>
        
        <CardContent class="pb-2 relative z-20">
          <CardTitle class="text-lg">{{ c.companyName }}</CardTitle>
          <CardDescription class="truncate mt-1">{{ c.contactEmail || c.contactName || 'No contact info' }}
          </CardDescription>
        </CardContent>
        
        <CardFooter class="flex flex-col gap-4 mt-auto pt-4 relative z-20">
          <div class="w-full flex items-center justify-between text-sm border-t border-border pt-4">
            <span class="text-muted-foreground">Rate</span>
            <span class="font-medium">${{ c.hourlyRate }}/hr</span>
          </div>
          <div class="flex gap-2 w-full">
            <Button variant="outline" class="flex-1 gap-2" @click="copyLink(c.accessToken)">
              <LinkIcon class="h-4 w-4" /> Copy Link
            </Button>
            <Button variant="ghost" size="icon" @click="emit('edit', c.id)" class="border border-border">
              <Pencil class="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <button 
        v-if="!isLimitReached"
        @click="emit('add')"
        class="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-muted/50 transition cursor-pointer min-h-70 group bg-background"
      >
        <div class="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
          <Plus class="h-6 w-6" />
        </div>
        <span class="font-medium">Add New Client</span>
      </button>

      <button 
        v-else
        @click="emit('upgrade')"
        class="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl p-6 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition cursor-pointer min-h-70 group bg-background"
      >
        <div class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Crown class="h-6 w-6" />
        </div>
        <span class="font-bold text-lg">Unlock Unlimited Clients</span>
        <p class="text-sm text-center mt-2 text-muted-foreground max-w-50">
          You've reached the free limit. Upgrade to Pro to manage more clients.
        </p>
      </button>

    </div>
  </div>
</template>
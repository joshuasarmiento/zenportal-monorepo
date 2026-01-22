<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import LoomPlayer from '../components/video/LoomPlayer.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  HelpCircle, 
  Mail, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink 
} from 'lucide-vue-next'

const route = useRoute()
const token = route.params.token as string

const data = ref<any>(null)
const error = ref('')
const loading = ref(true)

// --- 1. Define Color Maps ---
const bgColors: Record<string, string> = {
  indigo: 'bg-indigo-600',
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  rose: 'bg-rose-600',
  gray: 'bg-gray-900'
}

const textColors: Record<string, string> = {
  indigo: 'text-indigo-600',
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  rose: 'text-rose-600',
  gray: 'text-gray-900'
}

// --- 2. Computed Styles ---
const accentBg = computed(() => {
  const color = data.value?.client?.owner?.accentColor || 'indigo'
  return bgColors[color] || bgColors.indigo
})

const accentText = computed(() => {
  const color = data.value?.client?.owner?.accentColor || 'indigo'
  return textColors[color] || textColors.indigo
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(date)
}

const formatSummary = (text: string) => {
  if (!text) return []
  return text.split('\n').filter(line => line.trim().length > 0)
}

const sortedLogs = computed(() => {
  if (!data.value?.logs) return []
  return [...data.value.logs].sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/public/report/${token}`)
    if (!res.ok) throw new Error('Report not found')
    data.value = await res.json()
  } catch (err) {
    error.value = 'This report link is invalid or expired.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="h-screen flex items-center justify-center bg-slate-50">
    <Loader2 class="h-10 w-10 animate-spin text-muted-foreground" />
  </div>

  <div v-else-if="error" class="h-screen flex items-center justify-center text-center p-4 bg-slate-50">
    <Card class="max-w-md w-full">
      <CardContent class="p-8 flex flex-col items-center">
         <div class="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <HelpCircle class="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 class="text-xl font-bold mb-2">Link Not Found</h1>
        <p class="text-muted-foreground">{{ error }}</p>
      </CardContent>
    </Card>
  </div>

  <div v-else-if="data" class="min-h-screen bg-slate-50 font-inter text-slate-900 pb-20">
    
    <div class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          
          <Avatar class="h-10 w-10 border border-gray-100 rounded-lg">
            <AvatarImage :src="data.client.owner.avatarUrl" class="object-cover" />
            <AvatarFallback class="rounded-lg text-white font-bold text-sm" :class="accentBg">
                {{ data.client.owner.fullName?.[0] || 'A' }}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 class="font-bold text-slate-900 text-sm leading-tight">{{ data.client.owner.fullName }}'s Updates</h1>
            <p class="text-xs text-slate-500">For: {{ data.client.companyName }}</p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" as-child :class="accentText">
           <a :href="`mailto:${data.client.owner.email}`" class="gap-2">
             <Mail class="h-4 w-4" /> <span class="hidden sm:inline">Reply</span>
           </a>
        </Button>
      </div>
    </div>

    <main class="max-w-3xl mx-auto px-6 py-10 space-y-12">
      
      <div v-if="sortedLogs.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white border border-gray-200 shadow-sm rounded-full mb-4">
          <FileText class="h-8 w-8 text-slate-300" />
        </div>
        <h2 class="text-xl font-bold text-slate-900 mb-2">No Updates Yet</h2>
        <p class="text-slate-500 max-w-sm mx-auto">
          {{ data.client.owner.fullName }} hasn't posted any work logs for {{ data.client.companyName }} yet. Check back later!
        </p>
      </div>

      <section v-else v-for="log in sortedLogs" :key="log.id">
        
        <Alert v-if="log.isBlocked" variant="destructive" class="mb-6 bg-red-50 border-red-200 text-red-900 shadow-sm animate-pulse">
          <AlertOctagon class="h-4 w-4" />
          <AlertTitle>Input Required</AlertTitle>
          <AlertDescription>
            {{ log.blockerDetails }}
          </AlertDescription>
        </Alert>

        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-slate-900">{{ formatDate(log.date) }}</h2>
            <Badge v-if="!log.isBlocked" variant="outline" class="bg-green-50 text-green-700 border-green-200 uppercase tracking-wide">
              On Track
            </Badge>
        </div>

        <Card class="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            
            <div v-if="log.videoUrl" class="bg-black border-b border-gray-100">
               <LoomPlayer :url="log.videoUrl" />
            </div>

            <CardContent class="p-8">
                <h3 class="font-bold text-slate-800 text-lg mb-4">Accomplishments</h3>
                
                <ul class="space-y-4">
                    <li v-for="(line, i) in formatSummary(log.summary)" :key="i" class="flex gap-3 items-start">
                        <CheckCircle2 class="h-5 w-5 flex-shrink-0 mt-0.5" :class="accentText" />
                        <span class="text-slate-600 leading-relaxed">{{ line }}</span>
                    </li>
                </ul>

                <div class="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm text-slate-500">
                    <span class="flex items-center gap-2">
                      <Clock class="h-4 w-4" />
                      Logged: <span class="font-bold text-slate-900">{{ log.hoursWorked }} Hours</span>
                    </span>
                    
                    <span v-if="log.attachmentUrl" class="flex items-center gap-2">
                      <FileText class="h-4 w-4" />
                      Attachment: 
                      <a 
                        :href="log.attachmentUrl" 
                        target="_blank" 
                        class="font-medium hover:underline flex items-center gap-1"
                        :class="accentText"
                      >
                        View File <ExternalLink class="h-3 w-3" />
                      </a>
                    </span>
                </div>
            </CardContent>
        </Card>
      </section>

    </main>

    <footer class="text-center py-8 text-slate-400 text-sm">
      <p v-if="!data.client.owner.tier || data.client.owner.tier === 'free'">
          Report generated via <a href="/" class="font-medium hover:underline" :class="accentText">ZenPortal</a>
      </p>
      
      <p v-else class="text-slate-300 text-xs">
          &copy; {{ new Date().getFullYear() }} {{ data.client.owner.fullName }}
      </p>
    </footer>

  </div>
</template>
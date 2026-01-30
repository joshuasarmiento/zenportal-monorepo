<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import LoomPlayer from '@/components/video/VideoPlayer.vue' // Ensure this path is correct
import ModeToggle from '@/components/ModeToggle.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Loader2, 
  Frown,  
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Paperclip, 
  CalendarDays,
  Link
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const route = useRoute()
const token = route.params.token as string

const data = ref<any>(null)
const error = ref('')
const loading = ref(true)

// --- Design System ---
const bgColors: Record<string, string> = {
  indigo: 'bg-indigo-600/10 text-indigo-600 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-400/20',
  blue: 'bg-blue-600/10 text-blue-600 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20',
  emerald: 'bg-emerald-600/10 text-emerald-600 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20',
  rose: 'bg-rose-600/10 text-rose-600 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-400/20',
  gray: 'bg-zinc-900/5 text-zinc-900 ring-zinc-900/10 dark:bg-zinc-100/10 dark:text-zinc-100 dark:ring-zinc-100/20'
}

const solidBgColors: Record<string, string> = {
  indigo: 'bg-indigo-600 dark:bg-indigo-500',
  blue: 'bg-blue-600 dark:bg-blue-500',
  emerald: 'bg-emerald-600 dark:bg-emerald-500',
  rose: 'bg-rose-600 dark:bg-rose-500',
  gray: 'bg-zinc-900 dark:bg-zinc-100'
}

const textColors: Record<string, string> = {
  indigo: 'text-indigo-600 dark:text-indigo-400',
  blue: 'text-blue-600 dark:text-blue-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  rose: 'text-rose-600 dark:text-rose-400',
  gray: 'text-zinc-900 dark:text-zinc-100'
}

// --- Computeds ---
const accentRing = computed(() => {
  const color = data.value?.client?.owner?.accentColor || 'indigo'
  return bgColors[color] || bgColors.indigo
})

const accentSolid = computed(() => {
  const color = data.value?.client?.owner?.accentColor || 'indigo'
  return solidBgColors[color] || solidBgColors.indigo
})

const accentText = computed(() => {
  const color = data.value?.client?.owner?.accentColor || 'indigo'
  return textColors[color] || textColors.indigo
})

const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const sortedLogs = computed(() => {
  if (!data.value?.logs) return []
  return [...data.value.logs].sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

const totalHours = computed(() => {
  if (!data.value?.logs) return 0
  return data.value.logs.reduce((acc: number, log: any) => acc + (Number(log.hoursWorked) || 0), 0)
})

// --- Utilities ---
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return {
    day: new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
    month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
    weekday: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date),
    full: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
  }
}

const formatSummary = (text: string) => {
  if (!text) return []
  return text.split('\n').filter(line => line.trim().length > 0)
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  toast.success('Link copied to clipboard')
}

onMounted(async () => {
  try {
    loading.value = true
    const res = await fetch(`${import.meta.env.VITE_API_URL}/public/report/${token}`)
    if (!res.ok) throw new Error('Report not found')
    data.value = await res.json()
  } catch (err) {
    error.value = 'This portal link is invalid or has expired.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
    <div class="relative">
      <div class="h-16 w-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center animate-pulse">
        <Loader2 class="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    </div>
    <p class="mt-4 text-sm font-medium text-zinc-400 animate-pulse">Loading secure portal...</p>
  </div>

  <div v-else-if="error" class="h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
    <Card class="max-w-md w-full border-none shadow-2xl shadow-zinc-200/50 dark:shadow-none dark:bg-zinc-900">
      <CardContent class="p-10 flex flex-col items-center text-center">
         <div class="h-16 w-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50 dark:ring-red-900/10">
            <Frown class="h-8 w-8 text-red-500" />
        </div>
        <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Access Denied</h1>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">{{ error }}</p>
      </CardContent>
    </Card>
  </div>

  <div v-else-if="data" class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 dark:selection:bg-zinc-100 selection:text-white dark:selection:text-zinc-900 pb-32 transition-colors duration-300">
    
    <div class="fixed top-6 left-0 right-0 z-50 px-4 md:px-0 pointer-events-none">
      <div class="max-w-3xl mx-auto flex justify-between items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none rounded-full p-2 pl-2 pr-2 pointer-events-auto transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        
        <div class="flex items-center gap-3 pl-1">
          <Avatar class="h-9 w-9 border-2 border-white dark:border-zinc-800 shadow-sm cursor-default">
            <AvatarImage 
              v-if="data.client.owner.image"
              :src="data.client.owner.image" 
              class="object-cover" 
            />
            <AvatarFallback :class="accentSolid" class="text-white font-bold text-xs">
                {{ data.client.owner.name?.[0] || 'V' }}
            </AvatarFallback>
          </Avatar>
          <div class="hidden sm:block text-sm">
             <span class="font-semibold text-zinc-800 dark:text-zinc-200">{{ data.client.owner.name }}</span>
             <span class="text-zinc-400 mx-1.5">/</span>
             <span class="text-zinc-500">{{ data.client.companyName }}</span>
          </div>
        </div>

        <div class="flex items-center gap-1">
           <ModeToggle />
           <Button variant="ghost" size="icon" class="rounded-full h-9 w-9 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800" @click="copyLink">
            <Link class="h-4 w-4" />
          </Button>
          <Button size="sm" class="rounded-full px-5 font-medium shadow-lg shadow-zinc-500/10 dark:shadow-none text-xs sm:text-sm text-white h-9" :class="accentSolid" as-child>
             <a :href="`mailto:${data.client.owner.email}`">
               Contact
             </a>
          </Button>
        </div>
      </div>
    </div>

    <header class="max-w-3xl mx-auto px-6 pt-32 pb-12">
       <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-1">
            <p class="text-zinc-400 font-medium text-sm mb-2 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Secure Client Portal
            </p>
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {{ timeGreeting }}, {{ data.client.clientName || 'Partner' }}.
            </h1>
            <p class="text-zinc-500 dark:text-zinc-400 text-lg">
              Here is the latest progress report for <span class="font-medium text-zinc-900 dark:text-zinc-200">{{ data.client.companyName }}</span>.
            </p>
          </div>

          <div class="bg-white dark:bg-zinc-900 px-5 py-4 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 min-w-40">
             <div class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Total Hours Logged</div>
             <div class="text-2xl font-bold font-mono tracking-tight">{{ totalHours.toFixed(1) }}h</div>
          </div>
       </div>
    </header>

    <main class="max-w-3xl mx-auto px-6">
      
      <div v-if="sortedLogs.length === 0" class="py-20 text-center">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 h-32 w-full rounded-2xl flex items-center justify-center mb-6 shadow-sm border-dashed">
            <CalendarDays class="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 dark:text-zinc-100">No updates posted yet</h3>
        <p class="text-zinc-500 dark:text-zinc-400">Wait for the first log to appear here.</p>
      </div>

      <div v-else class="relative space-y-12">
        <div class="absolute left-4.75 top-4 bottom-10 w-0.5 bg-zinc-100 dark:bg-zinc-800 -z-10 hidden sm:block"></div>

        <article v-for="(log, index) in sortedLogs" :key="log.id" class="group relative sm:pl-16">
            
            <div 
              class="absolute left-0 top-1.5 h-10 w-10 rounded-full bg-white dark:bg-zinc-900 border-[3px] border-[#FBFBFB] dark:border-zinc-950 shadow-sm z-10 hidden sm:flex items-center justify-center font-bold text-xs text-zinc-500 dark:text-zinc-400"
              :class="index === 0 ? `ring-2 ${accentRing}` : ''"
            >
              {{ formatDate(log.date).day }}
            </div>

            <div class="flex items-center justify-between mb-4">
               <div class="sm:hidden text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                 {{ formatDate(log.date).full }}
               </div>
               <div class="hidden sm:block">
                 <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">{{ formatDate(log.date).weekday }}</h2>
                 <p class="text-xs text-zinc-400 font-medium uppercase tracking-wide">{{ formatDate(log.date).month }} {{ formatDate(log.date).day }}</p>
               </div>
               
               <div v-if="log.isBlocked">
                  <Badge variant="destructive" class="rounded-full px-3 py-1 shadow-sm">
                    <AlertTriangle class="h-3 w-3 mr-1.5" /> Blocked
                  </Badge>
               </div>
               <div v-else>
                 <Badge variant="secondary" class="rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 px-3 py-1 border border-green-200/50 dark:border-green-500/20">
                    <CheckCircle2 class="h-3 w-3 mr-1.5" /> Completed
                 </Badge>
               </div>
            </div>

            <Card class="border-none shadow-[0_2px_20px_-2px_rgba(0,0,0,0.06)] dark:shadow-none overflow-hidden bg-white dark:bg-zinc-900 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:hover:bg-zinc-900/80 transition-all duration-500 rounded-2xl group-hover:-translate-y-1 ring-1 ring-zinc-100 dark:ring-zinc-800">
                
                <div v-if="log.videoUrl" class="bg-zinc-900 relative">
                   <div class="aspect-video w-full">
                      <LoomPlayer :url="log.videoUrl" />
                   </div>
                </div>

                <CardContent class="p-6 md:p-8">
                    <div v-if="log.isBlocked" class="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-4 mb-6 text-sm text-red-900 dark:text-red-200 flex gap-3">
                       <AlertTriangle class="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                       <div>
                         <span class="font-bold block text-red-700 dark:text-red-300">Action Required</span>
                         {{ log.blockerDetails }}
                       </div>
                    </div>

                    <div class="space-y-6">
                        <div>
                           <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Daily Output</h3>
                           <ul class="space-y-3">
                              <li v-for="(line, i) in formatSummary(log.summary)" :key="i" class="flex gap-4 items-start group/item">
                                  <div class="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 transition-transform group-hover/item:scale-150" :class="accentSolid"></div>
                                  <span class="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[15px]">{{ line }}</span>
                              </li>
                           </ul>
                        </div>

                        <Separator class="bg-zinc-100 dark:bg-zinc-800" />

                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div class="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg w-fit">
                               <Clock class="h-4 w-4 text-zinc-400" />
                               <span>Logged: <span class="font-semibold text-zinc-900 dark:text-zinc-100">{{ log.hoursWorked }} hrs</span></span>
                            </div>

                            <div v-if="log.attachmentUrl">
                               <a 
                                  :href="log.attachmentUrl" 
                                  target="_blank"
                                  class="flex items-center gap-2 text-sm font-medium hover:underline decoration-2 underline-offset-4 transition-colors"
                                  :class="accentText"
                                >
                                  <Paperclip class="h-4 w-4" />
                                  Download Attachment
                               </a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </article>

      </div>
    </main>

    <footer class="text-center py-12 mt-12 border-t border-zinc-100 dark:border-zinc-800">
      <div v-if="!data.client.owner.tier || data.client.owner.tier === 'free'" class="flex justify-center items-center gap-2">
         <p class="text-zinc-400 text-xs uppercase tracking-widest font-medium">Powered by</p>
         <a href="/" class="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-bold text-lg hover:opacity-70 transition-opacity">
           <span :class="accentText">⚡</span> ZenPortal
         </a>
      </div>
      <div v-else>
         <p class="text-zinc-300 dark:text-zinc-600 text-xs">&copy; {{ new Date().getFullYear() }} {{ data.client.owner.fullName }}</p>
      </div>
    </footer>

  </div>
</template>>
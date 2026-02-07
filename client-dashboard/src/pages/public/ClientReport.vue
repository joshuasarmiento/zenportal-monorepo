<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import LoomPlayer from '@/components/video/VideoPlayer.vue' 
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
  Link,
  Zap,
  ArrowUpRight
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import BackgroundNoise from '@/components/ui/background-noise/BackgroundNoise.vue'

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
  <div v-if="loading" class="h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
    <div class="relative">
      <div class="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center animate-pulse">
        <Loader2 class="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    </div>
    <p class="mt-4 text-sm font-medium text-zinc-400 animate-pulse tracking-tight">Loading secure portal...</p>
  </div>

  <div v-else-if="error" class="h-screen flex items-center justify-center p-4 bg-white dark:bg-zinc-950 relative overflow-hidden">
    <BackgroundNoise />

    <Card class="max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 relative z-10">
      <CardContent class="p-10 flex flex-col items-center text-center">
         <div class="h-16 w-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50 dark:ring-red-900/10">
            <Frown class="h-8 w-8 text-red-500" />
        </div>
        <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">Access Denied</h1>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">{{ error }}</p>
      </CardContent>
    </Card>
  </div>

  <div v-else-if="data" class="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 dark:selection:bg-zinc-100 selection:text-white dark:selection:text-zinc-900 pb-32 transition-colors duration-300 relative overflow-hidden">
    
    <BackgroundNoise />

    <div class="fixed top-6 left-0 right-0 z-50 px-4 md:px-0 pointer-events-none">
      <div class="max-w-4xl mx-auto flex justify-between items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-full p-1.5 pl-2 pr-2 pointer-events-auto">
        
        <div class="flex items-center gap-3 pl-1">
          <Avatar class="h-8 w-8 border border-zinc-200 dark:border-zinc-800">
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
             <span class="font-bold text-zinc-900 dark:text-white tracking-tight">{{ data.client.owner.name }}</span>
             <span class="text-zinc-400 mx-2 font-light">/</span>
             <span class="text-zinc-600 dark:text-zinc-400">{{ data.client.companyName }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
           <ModeToggle />
           <Button variant="ghost" size="icon" class="rounded-full h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white" @click="copyLink">
            <Link class="h-4 w-4" />
          </Button>
          <Button size="sm" class="rounded-full px-4 font-bold text-xs h-8 text-white shadow-md hover:opacity-90 transition-opacity" :class="accentSolid" as-child>
             <a :href="`mailto:${data.client.owner.email}`">
               Contact
             </a>
          </Button>
        </div>
      </div>
    </div>

    <header class="max-w-4xl mx-auto px-6 pt-32 pb-16 relative z-10">
       <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-500">
               <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               Secure Client Portal
            </div>
            <h1 class="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white text-balance">
              {{ timeGreeting }}, <br class="md:hidden"/> {{ data.client.clientName || 'Partner' }}.
            </h1>
            <p class="text-xl text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
              Here is the latest progress report for <span class="font-semibold text-zinc-900 dark:text-white">{{ data.client.companyName }}</span>.
            </p>
          </div>

          <div class="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm px-6 py-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 min-w-[180px]">
             <div class="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Total Hours Logged</div>
             <div class="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">{{ totalHours.toFixed(1) }}<span class="text-lg text-zinc-400 font-medium ml-1">hrs</span></div>
          </div>
       </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 relative z-10">
      
      <div v-if="sortedLogs.length === 0" class="py-20 text-center">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 h-32 w-full rounded-2xl flex items-center justify-center mb-6 shadow-sm border-dashed">
            <CalendarDays class="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
        </div>
        <h3 class="text-lg font-bold text-zinc-900 dark:text-white">No updates posted yet</h3>
        <p class="text-zinc-500 dark:text-zinc-400">Wait for the first log to appear here.</p>
      </div>

      <div v-else class="relative space-y-12">
        <div class="absolute left-[27px] top-4 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 -z-10 hidden sm:block"></div>

        <article v-for="(log, index) in sortedLogs" :key="log.id" class="group relative sm:pl-20">
            
            <div 
              class="absolute left-3 top-2 h-8 w-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-950 shadow-sm z-10 hidden sm:flex items-center justify-center font-bold text-[10px] text-zinc-500 dark:text-zinc-400 ring-1 ring-zinc-200 dark:ring-zinc-800"
              :class="index === 0 ? `ring-2 ${accentRing}` : ''"
            >
              {{ formatDate(log.date).day }}
            </div>

            <div class="flex items-center justify-between mb-4">
               <div class="sm:hidden text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                 {{ formatDate(log.date).full }}
               </div>
               <div class="hidden sm:block">
                 <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">{{ formatDate(log.date).weekday }}</h2>
                 <p class="text-xs text-zinc-400 font-bold uppercase tracking-widest">{{ formatDate(log.date).month }} {{ formatDate(log.date).day }}</p>
               </div>
               
               <div v-if="log.isBlocked">
                  <Badge variant="destructive" class="rounded-full px-3 py-1 shadow-sm font-bold uppercase tracking-wider text-[10px]">
                    <AlertTriangle class="h-3 w-3 mr-1.5" /> Blocked
                  </Badge>
               </div>
               <div v-else>
                 <Badge variant="secondary" class="rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1 font-bold uppercase tracking-wider text-[10px] border border-zinc-200 dark:border-zinc-700">
                    <CheckCircle2 class="h-3 w-3 mr-1.5 text-green-500" /> Completed
                 </Badge>
               </div>
            </div>

            <Card class="overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
                
                <div v-if="log.videoUrl" class="bg-black relative border-b border-zinc-100 dark:border-zinc-800">
                   <div class="aspect-video w-full">
                      <LoomPlayer :url="log.videoUrl" />
                   </div>
                </div>

                <CardContent class="p-6 md:p-8">
                    <div v-if="log.isBlocked" class="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-4 mb-6 text-sm text-red-900 dark:text-red-200 flex gap-4 items-start">
                       <div class="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg shrink-0 text-red-600 dark:text-red-400">
                         <AlertTriangle class="h-5 w-5" />
                       </div>
                       <div>
                         <span class="font-bold block text-red-700 dark:text-red-300 text-base mb-1">Action Required</span>
                         {{ log.blockerDetails }}
                       </div>
                    </div>

                    <div class="space-y-8">
                        <div>
                           <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Daily Output</h3>
                           <ul class="space-y-4">
                              <li v-for="(line, i) in formatSummary(log.summary)" :key="i" class="flex gap-4 items-start group/item">
                                  <div class="mt-2 h-1.5 w-1.5 rounded-full shrink-0 transition-all group-hover/item:scale-150" :class="accentSolid"></div>
                                  <span class="text-zinc-700 dark:text-zinc-300 leading-relaxed text-[15px] font-medium">{{ line }}</span>
                              </li>
                           </ul>
                        </div>

                        <Separator class="bg-zinc-100 dark:bg-zinc-800" />

                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div class="flex items-center gap-2 text-sm text-zinc-500 font-medium bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full w-fit border border-zinc-100 dark:border-zinc-800">
                               <Clock class="h-4 w-4 text-zinc-400" />
                               <span>Logged: <span class="font-bold text-zinc-900 dark:text-white">{{ log.hoursWorked }} hrs</span></span>
                            </div>

                            <div v-if="log.attachmentUrl">
                               <a 
                                  :href="log.attachmentUrl" 
                                  target="_blank"
                                  class="flex items-center gap-2 text-sm font-bold hover:underline decoration-2 underline-offset-4 transition-colors group/link"
                                  :class="accentText"
                                >
                                  <Paperclip class="h-4 w-4" />
                                  Download Attachment
                                  <ArrowUpRight class="h-3 w-3 opacity-50 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                               </a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </article>

      </div>
    </main>

    <footer class="text-center py-20 mt-12 border-t border-zinc-100 dark:border-zinc-800 relative z-10">
      <div v-if="!data.client.owner.tier || data.client.owner.tier === 'free'" class="flex justify-center items-center gap-2">
         <p class="text-zinc-400 text-xs uppercase tracking-widest font-bold">Powered by</p>
         <a href="/" class="flex items-center gap-1.5 text-zinc-900 dark:text-white font-bold text-lg hover:opacity-70 transition-opacity">
           <div class="bg-zinc-900 dark:bg-white text-white dark:text-black p-1 rounded-md">
             <Zap class="w-3 h-3 fill-current" />
           </div>
           ZenPortal
         </a>
      </div>
      <div v-else>
         <p class="text-zinc-400 text-xs font-medium">&copy; {{ new Date().getFullYear() }} {{ data.client.owner.fullName }}</p>
      </div>
    </footer>

  </div>
</template>
<script setup lang="ts">
import { useUser } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { onMounted, watch, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import ModeToggle from '@/components/ModeToggle.vue'
import { 
  // Landing Page Icons
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Zap, 
  Video, 
  LayoutGrid,
  Star,
  Banknote,
  Lock,
  Paperclip,
  Heart,
  // Dashboard Preview Icons
  LayoutDashboard,
  Users,
  BarChart3,
  BookOpen,
  Settings,
  ChevronsUpDown
} from 'lucide-vue-next'

const { isSignedIn, isLoaded } = useUser()
const router = useRouter()
const isScrolled = ref(false)

const checkRedirect = () => {
  if (!isLoaded.value) return
  if (isSignedIn.value) router.push('/dashboard')
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
}

onMounted(checkRedirect)
watch([isLoaded, isSignedIn], checkRedirect)

// FEATURES - Taglish & Relatable
const features = [
  { 
    icon: Video, 
    title: 'Tamad Mag-basa si Client?', 
    desc: 'Don\'t write a novel. Send a 2-min Loom/Screenity video instead. We embed it automatically so they watch, approve, and pay you faster.',
    class: 'md:col-span-2 bg-blue-500/5 border-blue-200/20'
  },
  { 
    icon: Lock, 
    title: 'No More "Spyware"', 
    desc: 'Bye-bye Time Doctor. Stop taking screenshots of your screen every 10 mins. Use our "Output Logger" to prove value based on results, not mouse clicks.',
    class: 'md:col-span-1'
  },
  { 
    icon: Banknote, 
    title: 'Iwas "Barat" Clients', 
    desc: 'When you present like an Agency, you command Agency rates. Stop looking like a "cheaper option" and start looking like a Premium Partner.',
    class: 'md:col-span-1' 
  },
  { 
    icon: LayoutGrid, 
    title: 'Client "VIP" Portal', 
    desc: 'Bigyan mo ng sariling dashboard si Client. No login needed for them. Just a clean link showing your pending tasks, invoices, and wins.',
    class: 'md:col-span-2' 
  },
]

// FAQS - Usapang Freelancer
const faqs = [
  {
    question: "Totoo ba? Walang bayad? (Is it really free?)",
    answer: "Oo naman. The Starter plan is free forever. We built this para sa mga nagsisimula pa lang. Gamitin mo pang-close ng first premium client mo, tsaka ka na mag-upgrade 'pag kumikita ka na ng dollars."
  },
  {
    question: "Pwede ba 'to sa OLJ, Upwork, o Direct Clients?",
    answer: "Sobrang pwede. This is your 'edge'. Habang yung iba naka-PDF resume lang, ikaw may sariling Client Portal. It shows tech-savviness immediately."
  },
  {
    question: "Paano kung 'di techy ang client ko (mga Boomer)?",
    answer: "We optimized this for 'Old School' clients. They don't need to sign up or remember passwords. You send a magic link, they click, they see your work. Walang hassle."
  },
  {
    question: "Does this replace Wise/Parallax/GoTyme?",
    answer: "No, hindi kami bangko. We help you get the work *approved* quickly so you get paid faster via your preferred method (Wise, Parallax, etc). We handle the 'Proof of Work'."
  }
]
</script>

<template>
  <div v-if="!isLoaded || isSignedIn" class="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
    <div class="animate-spin w-8 h-8 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full"></div>
  </div>

  <div v-else class="bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-300">
    
    <div class="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div class="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] dark:opacity-0 transition-opacity duration-500"></div>
      <div class="absolute top-0 z-[-2] h-screen w-screen opacity-0 dark:opacity-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))] transition-opacity duration-500"></div>
      <div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
    
    <nav :class="['fixed top-0 w-full z-50 transition-all duration-300', isScrolled ? 'border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/60 backdrop-blur-xl' : 'bg-transparent border-transparent']">
      <div class="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
        <div class="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div class="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-1.5 text-white shadow-lg shadow-blue-500/20">
            <Zap class="h-5 w-5 fill-white" />
          </div>
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">ZenPortal</span>
        </div>
        <div class="flex items-center gap-4 md:gap-6">
          <ModeToggle />
          <router-link to="/sign-in" class="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white transition hidden sm:block">Log in</router-link>
          <Button class="rounded-full px-6 font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg shadow-zinc-500/20 dark:shadow-none" as-child>
            <router-link to="/pricing">Simulan Mo Na</router-link>
          </Button>
        </div>
      </div>
    </nav>

    <section class="relative pt-40 pb-20">
      <div class="max-w-7xl mx-auto px-6 text-center relative z-10">
        
        <div class="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div class="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span class="relative flex h-2 w-2 mr-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span class="font-medium text-blue-600 dark:text-blue-300">Proudly Gawang Pinoy 🇵🇭</span>
          </div>
        </div>
        
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-zinc-900 dark:text-white mb-8 text-balance leading-[0.95]">
          Hindi ka lang <span class="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 decoration-zinc-500 line-through decoration-4">Employee.</span><br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 dark:from-blue-400 dark:via-cyan-400 dark:to-emerald-400 glow-text">Business Partner</span> ka.
        </h1>
        
        <p class="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Stop acting like a <span class="text-zinc-900 dark:text-white font-semibold">$3/hr assistant</span>. Use the tools that top-tier Filipino freelancers use to manage clients, track work, and get paid what they deserve.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Button size="lg" class="h-16 px-10 text-lg rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-300 hover:scale-105" as-child>
            <router-link to="/pricing">Create Your Portal <ArrowRight class="ml-2 h-5 w-5" /></router-link>
          </Button>
          <div class="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-500 justify-center mt-2 sm:mt-0 px-4">
             <div class="flex -space-x-3">
               <Avatar class="border-2 border-white dark:border-zinc-950 h-10 w-10"><AvatarImage src="https://i.pravatar.cc/100?img=5" /></Avatar>
               <Avatar class="border-2 border-white dark:border-zinc-950 h-10 w-10"><AvatarImage src="https://i.pravatar.cc/100?img=12" /></Avatar>
               <Avatar class="border-2 border-white dark:border-zinc-950 h-10 w-10"><AvatarImage src="https://i.pravatar.cc/100?img=32" /></Avatar>
             </div>
             <p>Gamit ng 2,000+ Pinoy VAs</p>
          </div>
        </div>

        <div class="relative w-full max-w-6xl mx-auto group perspective-1000">
          <div class="absolute -inset-4 bg-gradient-to-t from-blue-600/20 via-purple-600/20 to-transparent rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          
          <div class="relative rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-950/80 backdrop-blur-md shadow-2xl overflow-hidden transform transition-transform duration-500 hover:rotate-x-2">
            
            <div class="border-b border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-black/40 p-4 flex items-center justify-between">
              <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div class="text-xs font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                <Lock class="w-3 h-3" /> app.zenportal.io/dashboard
              </div>
              <div class="w-16"></div>
            </div>

            <div class="flex h-[600px] md:h-[500px] overflow-hidden">
              
              <div class="hidden md:flex w-64 flex-col border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50">
                <div class="p-4">
                   <div class="flex items-center gap-3 p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                        <Zap class="w-4 h-4" />
                      </div>
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-bold text-blue-600 dark:text-blue-400">ZenPortal<span class="text-zinc-400 dark:text-zinc-600">.io</span></span>
                        <span class="truncate text-xs text-zinc-500">Agency Admin</span>
                      </div>
                   </div>
                </div>

                <div class="flex-1 px-2 py-2 space-y-6 overflow-y-auto">
                  <div class="space-y-1">
                    <div class="px-4 text-xs text-start font-semibold text-zinc-500 mb-2">Platform</div>
                    <div class="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white rounded-md text-sm font-medium cursor-pointer">
                      <LayoutDashboard class="w-4 h-4" /> 
                      <span>Dashboard</span>
                    </div>
                    <div class="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-sm transition-colors cursor-pointer">
                      <Users class="w-4 h-4" /> 
                      <span>Clients</span>
                    </div>
                    <div class="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-sm transition-colors cursor-pointer">
                      <BarChart3 class="w-4 h-4" /> 
                      <span>Earnings</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                     <div class="px-4 text-xs text-start font-semibold text-zinc-500 mb-2">Settings</div>
                     <div class="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-sm transition-colors cursor-pointer">
                      <BookOpen class="w-4 h-4" /> 
                      <span>User Guide</span>
                    </div>
                    <div class="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-md text-sm transition-colors cursor-pointer">
                      <Settings class="w-4 h-4" /> 
                      <span>Settings</span>
                    </div>
                  </div>
                </div>

                <div class="p-4 mt-auto">
                   <div class="flex items-center gap-3 p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
                      <Avatar class="h-8 w-8 rounded-lg border border-zinc-200 dark:border-white/10">
                        <AvatarFallback class="rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200 font-bold text-xs">JS</AvatarFallback>
                      </Avatar>
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-semibold text-zinc-900 dark:text-white">Joshua S.</span>
                        <span class="truncate text-xs text-zinc-500">joshua@dev.com</span>
                      </div>
                      <ChevronsUpDown class="ml-auto size-4 text-zinc-400" />
                   </div>
                </div>
              </div>

              <div class="flex-1 flex flex-col bg-zinc-50/50 dark:bg-black/20 overflow-hidden">
                <header class="h-16 border-b border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 flex items-center justify-between px-6">
                   <div class="flex items-center text-sm text-zinc-500">
                      <span>Platform</span>
                      <span class="mx-2">/</span>
                      <span class="font-medium text-zinc-900 dark:text-white">Dashboard</span>
                   </div>
                   <div class="flex items-center gap-4">
                      <Button size="sm" class="h-8 gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-none">
                         <div class="h-4 w-4 flex items-center justify-center rounded-full border border-current">
                            <span class="text-[10px]">+</span>
                         </div>
                         Log Work
                      </Button>
                   </div>
                </header>

                <div class="p-6 space-y-6 overflow-hidden">
                   <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5 shadow-sm">
                         <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-medium text-zinc-500">Total Hours</span>
                            <div class="h-4 w-4 text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                         </div>
                         <div class="text-2xl font-bold text-zinc-900 dark:text-white">142.5 h</div>
                      </div>
                      <div class="bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5 shadow-sm">
                         <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-medium text-zinc-500">Active Clients</span>
                            <div class="h-4 w-4 text-green-500"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
                         </div>
                         <div class="text-2xl font-bold text-zinc-900 dark:text-white">3</div>
                      </div>
                      <div class="bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5 shadow-sm">
                         <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-medium text-zinc-500">Total Blockers</span>
                            <div class="h-4 w-4 text-red-500"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg></div>
                         </div>
                         <div class="text-2xl font-bold text-red-500">1</div>
                      </div>
                   </div>

                   <div class="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-white/5 shadow-sm flex-1 overflow-hidden">
                      <div class="p-4 border-b border-zinc-200 dark:border-white/5">
                         <h3 class="font-semibold text-zinc-900 dark:text-white">Recent Proof of Work</h3>
                      </div>
                      <div class="p-0">
                         <table class="w-full text-sm text-left">
                            <thead class="bg-zinc-50/50 dark:bg-white/5 text-zinc-500">
                               <tr>
                                  <th class="px-4 py-3 font-medium">Date</th>
                                  <th class="px-4 py-3 font-medium">Client</th>
                                  <th class="px-4 py-3 font-medium">Summary</th>
                                  <th class="px-4 py-3 font-medium">Evidence</th>
                                  <th class="px-4 py-3 font-medium">Status</th>
                               </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-100 dark:divide-white/5">
                               <tr class="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                  <td class="px-4 py-3 text-zinc-500">Today</td>
                                  <td class="px-4 py-3"><Badge variant="secondary" class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-100">TechCorp</Badge></td>
                                  <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200">Fixed API Rate Limiting</td>
                                  <td class="px-4 py-3">
                                    <div class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold">
                                      <Video class="h-3.5 w-3.5" /> Video
                                    </div>
                                  </td>
                                  <td class="px-4 py-3"><Badge variant="outline" class="border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 gap-1"><CheckCircle2 class="h-3 w-3" /> Done</Badge></td>
                               </tr>
                               <tr class="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                  <td class="px-4 py-3 text-zinc-500">Yesterday</td>
                                  <td class="px-4 py-3"><Badge variant="secondary" class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-100">DesignStudio</Badge></td>
                                  <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200">Updated Figma Tokens</td>
                                  <td class="px-4 py-3">
                                     <div class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                                        <Paperclip class="h-3.5 w-3.5"/>
                                        File
                                     </div>
                                  </td>
                                  <td class="px-4 py-3"><Badge variant="outline" class="border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 gap-1"><CheckCircle2 class="h-3 w-3" /> Done</Badge></td>
                               </tr>
                               <tr class="group bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <td class="px-4 py-3 text-zinc-500">Jan 23</td>
                                  <td class="px-4 py-3"><Badge variant="secondary" class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-100">StartupInc</Badge></td>
                                  <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200">Waiting for AWS Access Keys</td>
                                  <td class="px-4 py-3"><span class="text-zinc-400 text-xs">No evidence</span></td>
                                  <td class="px-4 py-3"><Badge variant="destructive" class="gap-1"><div class="h-3 w-3 rounded-full border border-current flex items-center justify-center">!</div> Blocked</Badge></td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    </section>

    <section class="py-32 relative bg-zinc-50 dark:bg-black/20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-20">
          <Badge variant="outline" class="mb-4 border-red-500/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10">Reality Check</Badge>
          <h2 class="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-zinc-900 dark:text-white">Anong klaseng VA ka?</h2>
          <p class="text-xl text-zinc-600 dark:text-zinc-400">Clients pay cheap for "employees." They pay premium for "peace of mind."</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative">
          
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 shadow-2xl font-black text-sm text-zinc-500">VS</div>

          <Card class="relative border-zinc-200 dark:border-white/5 bg-white dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors duration-500 group overflow-hidden shadow-lg dark:shadow-none">
            <CardHeader>
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold uppercase tracking-widest text-zinc-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">The Typical "Yes Sir" VA</span>
                <XCircle class="h-6 w-6 text-zinc-400 group-hover:text-red-500 transition-colors" />
              </div>
            </CardHeader>
            <CardContent class="p-8 pt-0">
              <div class="space-y-4 font-mono text-sm text-zinc-600 dark:text-zinc-400">
                <div class="flex items-start gap-3 opacity-80 dark:opacity-60">
                    <div class="mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                    <p>"Opo Sir, I will do that Sir." (Kahit di alam gagawin)</p>
                </div>
                <div class="flex items-start gap-3 opacity-80 dark:opacity-60">
                    <div class="mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                    <p>Sends screenshots every 10 mins (Dahil sa Time Doctor)</p>
                </div>
                <div class="flex items-start gap-3 opacity-80 dark:opacity-60">
                    <div class="mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                    <p>Attached_Invoice_Final_v2.pdf (Tapos sa spam napunta)</p>
                </div>
              </div>
              <p class="mt-8 text-sm font-medium text-red-600 dark:text-red-400/90 border-t border-zinc-100 dark:border-white/5 pt-4">
                ⚠️ Client Anxiety: "Trabaho ba talaga 'to o nanonood lang ng Netflix?"
              </p>
            </CardContent>
          </Card>

          <Card class="relative border-blue-500/30 bg-blue-50 dark:bg-blue-600/5 shadow-[0_0_40px_-10px_rgba(59,130,246,0.1)] overflow-hidden">
             <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
            <CardHeader class="relative z-10">
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">The Strategic Partner</span>
                <CheckCircle2 class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent class="relative z-10 p-8 pt-0">
              <div class="space-y-4 font-medium text-sm text-zinc-700 dark:text-zinc-200">
                <div class="flex items-start gap-3">
                    <div class="mt-1 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                    <p>"I've updated the dashboard. Check the video summary I made."</p>
                </div>
                <div class="flex items-start gap-3">
                    <div class="mt-1 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                    <p>Output-based logging (No spyware needed)</p>
                </div>
                <div class="flex items-start gap-3">
                    <div class="mt-1 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                    <p>Auto-generated professional reports & invoices</p>
                </div>
              </div>
               <p class="mt-8 text-sm font-medium text-blue-700 dark:text-blue-300 border-t border-blue-200 dark:border-blue-500/20 pt-4">
                ✨ Client Confidence: "This person runs a real business. I respect them."
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>

    <section class="py-24 px-6 max-w-7xl mx-auto">
       <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">Diskarteng Pinoy, World-Class Tech</h2>
          <p class="text-zinc-600 dark:text-zinc-400">Built for the specific needs of Filipino freelancers working with Western clients.</p>
       </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card v-for="(feature, idx) in features" :key="idx" :class="['bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group', feature.class]">
          <div class="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-all"></div>
          <CardHeader>
            <component :is="feature.icon" class="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2" />
            <CardTitle class="text-xl text-zinc-900 dark:text-zinc-100">{{ feature.title }}</CardTitle>
          </CardHeader>
          <CardContent class="text-zinc-600 dark:text-zinc-400 leading-relaxed relative z-10">
            {{ feature.desc }}
          </CardContent>
        </Card>
      </div>
    </section>

    <section class="py-24 px-6 max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Star class="h-3 w-3 fill-purple-600 dark:fill-purple-400" /> Usapang Freelancer
        </div>
        <h2 class="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">Questions? (FAQ)</h2>
        <p class="text-zinc-600 dark:text-zinc-500">Walang bolahan. Straight answers only.</p>
      </div>

      <Accordion type="single" collapsible class="w-full space-y-4">
        <AccordionItem v-for="(faq, index) in faqs" :key="index" :value="`item-${index}`" class="border border-zinc-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 px-4 data-[state=open]:border-blue-500/30 data-[state=open]:bg-blue-50/50 dark:data-[state=open]:bg-blue-900/10 transition-all">
          <AccordionTrigger class="text-left text-lg font-medium text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-white hover:no-underline py-6">
            {{ faq.question }}
          </AccordionTrigger>
          <AccordionContent class="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base pb-6 border-t border-zinc-100 dark:border-white/5 pt-4 mt-2">
            {{ faq.answer }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>

    <section class="py-32 px-6 relative overflow-hidden bg-zinc-900 dark:bg-black">
        <div class="absolute inset-0 bg-blue-600/20 dark:bg-blue-600/10"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/90 dark:to-zinc-950"></div>
        
        <div class="max-w-4xl mx-auto text-center relative z-10">
            <h2 class="text-4xl md:text-6xl font-black tracking-tight mb-8 text-white">
              Pagod ka na ba sa "Petsa de Peligro"?
            </h2>
            <p class="text-xl text-zinc-300 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join thousands of Filipino VAs, Devs, and Creatives who have upgraded from "Helper" to "Partner."
            </p>
            <div class="flex flex-col items-center gap-4">
              <Button size="lg" class="h-16 px-12 text-xl font-bold rounded-full bg-white text-blue-900 hover:bg-zinc-200 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] transition-transform hover:scale-105" as-child>
                  <router-link to="/pricing">Libre Lang 'To. Start Now.</router-link>
              </Button>
              <p class="text-sm text-zinc-400 dark:text-zinc-500 flex items-center gap-2 mt-4">
                <CheckCircle2 class="h-4 w-4 text-green-500" /> No credit card needed
                <span class="w-1 h-1 rounded-full bg-zinc-600"></span>
                <CheckCircle2 class="h-4 w-4 text-green-500" /> Cancel anytime
              </p>
            </div>
        </div>
    </section>

    <footer class="py-12 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-center relative z-10">
      <div class="flex items-center justify-center gap-2 font-bold text-xl tracking-tight mb-8 text-zinc-500 dark:text-zinc-600">
          <Zap class="h-5 w-5 fill-zinc-400 dark:fill-zinc-600" /> ZenPortal
      </div>
      <div class="flex justify-center flex-wrap gap-8 mb-8 text-sm font-medium text-zinc-600 dark:text-zinc-500">
        <a href="/features" class="hover:text-blue-600 dark:hover:text-white transition">Features</a>
        <a href="/pricing" class="hover:text-blue-600 dark:hover:text-white transition">Pricing</a>
        <a href="/about" class="hover:text-blue-600 dark:hover:text-white transition">About</a>
        <a href="/blog" class="hover:text-blue-600 dark:hover:text-white transition">Blog</a>
      </div>
      <p class="text-sm text-zinc-500 dark:text-zinc-600 mb-6">
        <!-- Made with <Heart class="inline h-3 w-3 text-red-500 fill-red-500 mx-1" /> by <span class="font-semibold text-zinc-700 dark:text-zinc-400">Joshua</span>. -->
        <br class="block sm:hidden" /> &copy; {{ new Date().getFullYear() }} ZenPortal.
      </p>
      <div class="flex justify-center gap-4 text-xs text-zinc-400 dark:text-zinc-700 font-mono uppercase tracking-widest">
        <span>Manila</span> • <span>Cebu</span> • <span>Davao</span> • <span>Bicol</span> • <span>Global</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.glow-text {
  text-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
}

.perspective-1000 {
  perspective: 1000px;
}
</style>
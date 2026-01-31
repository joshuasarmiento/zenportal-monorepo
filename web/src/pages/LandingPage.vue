<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
  ShieldCheck,
  Clock,
  Briefcase,
  AlertTriangle,
  // Dashboard Preview Icons
  LayoutDashboard,
  Users,
  BarChart3,
  BookOpen,
  Settings,
  ChevronsUpDown,
  Play
} from 'lucide-vue-next'

// FEATURES - Bento Grid Config
const features = [
  {
    icon: Video,
    title: 'Tamad Mag-basa si Client?',
    desc: 'Don\'t write a novel. Send a 2-min Loom/Screenity video instead. We embed it automatically so they watch, approve, and pay you faster.',
    class: 'md:col-span-2 md:row-span-2 bg-zinc-900 text-white dark:bg-white dark:text-black',
    iconClass: 'text-blue-500 dark:text-blue-600',
    dark: true // Special flag for inverted style
  },
  {
    icon: Lock,
    title: 'No More "Spyware"',
    desc: 'Bye-bye Time Doctor. Stop taking screenshots every 10 mins. Use "Output Logger" to prove value based on results.',
    class: 'md:col-span-1 bg-zinc-50 dark:bg-zinc-900/50',
    iconClass: 'text-zinc-900 dark:text-white'
  },
  {
    icon: Banknote,
    title: 'Iwas "Barat" Clients',
    desc: 'Present like an Agency, command Agency rates. Stop looking like a "cheaper option."',
    class: 'md:col-span-1 bg-zinc-50 dark:bg-zinc-900/50',
    iconClass: 'text-green-600 dark:text-green-400'
  },
  {
    icon: LayoutGrid,
    title: 'Client "VIP" Portal',
    desc: 'Bigyan mo ng sariling dashboard si Client. No login needed. Just a clean link showing tasks, invoices, and wins.',
    class: 'md:col-span-2 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50',
    iconClass: 'text-blue-600 dark:text-blue-400'
  },
  {
    icon: Zap,
    title: 'Tatak "Pro" Agency',
    desc: 'Customize with your own Logo & Colors. Remove our branding so you look like a legitimate software-powered agency.',
    class: 'md:col-span-1 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/50',
    iconClass: 'text-purple-600 dark:text-purple-400'
  }
]

// FAQS
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

import { useHead } from '@unhead/vue'

useHead({
  title: 'ZenPortal - Free Client Portal for Filipino VAs & Freelancers',
  meta: [
    { name: 'description', content: 'Stop sending screenshots. Give your clients a professional portal. Proof of work, automated reports, and zero spyware. Built for Pinoy Freelancers.' },
    { property: 'og:title', content: 'ZenPortal - Free Client Portal for Filipino VAs & Freelancers' },
    { property: 'og:description', content: 'Stop sending screenshots. Give your clients a professional portal. Proof of work, automated reports, and zero spyware.' },
  ],
})
</script>

<template>
  <div class="min-h-screen font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
    
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>

    <section class="relative pt-32 pb-20 z-10">
      <div class="max-w-7xl mx-auto px-6 text-center">

        <div class="flex justify-center mb-8">
          <div class="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform hover:scale-105 cursor-default">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span class="text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300 uppercase">Gawang Pinoy 🇵🇭</span>
          </div>
        </div>

        <h1 class="text-5xl md:text-7xl font-semibold tracking-tighter text-zinc-900 dark:text-white mb-8 text-balance leading-[0.95] md:leading-[0.9]">
          Hindi ka lang <span class="text-zinc-400 decoration-zinc-300 line-through decoration-2">Employee.</span><br />
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Business Partner</span> ka.
        </h1>

        <p class="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed text-balance">
          Stop acting like a <span class="text-zinc-900 dark:text-white font-medium">$3/hr assistant</span>. Use the tools top-tier freelancers use to manage clients, track work, and get paid what they deserve.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
          <Button size="lg"
            class="h-12 px-8 text-base rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
            as-child>
            <router-link to="/pricing">
              Create Your Portal
              <ArrowRight class="ml-2 h-4 w-4" />
            </router-link>
          </Button>
          
          <div class="flex items-center gap-3">
            <div class="flex -space-x-3">
              <Avatar class="border-2 border-white dark:border-zinc-950 h-9 w-9 ring-1 ring-zinc-100 dark:ring-zinc-800">
                <AvatarImage src="https://i.pravatar.cc/100?img=5" />
              </Avatar>
              <Avatar class="border-2 border-white dark:border-zinc-950 h-9 w-9 ring-1 ring-zinc-100 dark:ring-zinc-800">
                <AvatarImage src="https://i.pravatar.cc/100?img=12" />
              </Avatar>
              <Avatar class="border-2 border-white dark:border-zinc-950 h-9 w-9 ring-1 ring-zinc-100 dark:ring-zinc-800">
                <AvatarImage src="https://i.pravatar.cc/100?img=32" />
              </Avatar>
            </div>
            <div class="flex flex-col items-start">
               <div class="flex text-yellow-500 text-[10px]">
                 <Star v-for="i in 5" :key="i" class="w-3 h-3 fill-current" />
               </div>
               <p class="text-xs font-medium text-zinc-600 dark:text-zinc-400">Trusted by 2,000+ VAs</p>
            </div>
          </div>
        </div>

        <div class="relative w-full max-w-5xl mx-auto perspective-1000 group">
          <div class="absolute -inset-4 bg-gradient-to-t from-blue-500/10 via-purple-500/10 to-transparent rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

          <div class="relative rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden transform transition-all duration-700 hover:rotate-x-2 origin-center ring-1 ring-black/5 dark:ring-white/10">
            
            <div class="h-10 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 px-4 flex items-center justify-between backdrop-blur-md">
              <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
              </div>
              <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-400">
                  <Lock class="w-2.5 h-2.5" /> app.zenportal.com.ph
              </div>
              <div class="w-10"></div>
            </div>

            <div class="flex h-150 md:h-125 overflow-hidden bg-zinc-50 dark:bg-black">
              
              <div class="hidden md:flex w-64 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div class="p-4">
                  <div class="flex items-center gap-2 p-2 rounded-lg transition-colors group/brand cursor-pointer">
                      <div class="h-8 w-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-zinc-900 shrink-0 shadow-sm transition-transform group-hover/brand:scale-105">
                        <Zap class="w-4 h-4 fill-current" />
                      </div>
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-bold text-zinc-900 dark:text-white tracking-tight">ZenPortal</span>
                        <span class="truncate text-xs text-zinc-500 font-medium">Agency Admin</span>
                      </div>
                  </div>
                </div>

                <div class="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
                  <div class="space-y-0.5">
                    <div class="px-3 text-[10px] text-start uppercase tracking-widest font-bold text-zinc-400 mb-2">Platform</div>
                    <div class="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-md text-sm font-medium cursor-pointer">
                      <LayoutDashboard class="w-4 h-4" />
                      <span>Dashboard</span>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md text-sm font-medium transition-colors cursor-pointer">
                      <Users class="w-4 h-4" />
                      <span>Clients</span>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md text-sm font-medium transition-colors cursor-pointer">
                      <BarChart3 class="w-4 h-4" />
                      <span>Earnings</span>
                    </div>
                  </div>

                  <div class="space-y-0.5">
                    <div class="px-3 text-start text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Configurations</div>
                    <div class="flex items-center gap-2 px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md text-sm font-medium transition-colors cursor-pointer">
                      <BookOpen class="w-4 h-4" />
                      <span>User Guide</span>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md text-sm font-medium transition-colors cursor-pointer">
                      <Settings class="w-4 h-4" />
                      <span>Settings</span>
                    </div>
                  </div>
                </div>

                <div class="p-4 mt-auto border-t border-zinc-100 dark:border-zinc-900">
                  <div class="flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors">
                      <Avatar class="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <AvatarImage src="https://i.pravatar.cc/150?img=11" />
                        <AvatarFallback class="rounded-lg bg-zinc-100 text-zinc-900 font-bold text-xs">JS</AvatarFallback>
                      </Avatar>
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-semibold text-zinc-900 dark:text-white">Edward S.</span>
                        <span class="truncate text-xs text-zinc-500">edward@company.com</span>
                      </div>
                      <ChevronsUpDown class="ml-auto size-3 text-zinc-400" />
                  </div>
                </div>
              </div>

              <div class="flex-1 flex flex-col overflow-hidden">
                <header class="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 md:px-8">
                  <div class="flex items-center text-sm gap-2">
                    <span class="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Platform</span>
                    <span class="text-zinc-300">/</span>
                    <span class="font-semibold text-zinc-900 dark:text-white tracking-tight">Dashboard</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <Button size="sm" class="h-9 gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm rounded-full px-4 font-medium transition-transform active:scale-95">
                      <div class="h-4 w-4 flex items-center justify-center rounded-full border border-current opacity-60">
                        <span class="text-[9px] font-bold leading-none mb-px">+</span>
                      </div>
                      Log Work
                    </Button>
                  </div>
                </header>

                <div class="p-6 md:p-8 space-y-8 overflow-y-auto bg-zinc-50 dark:bg-black">
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <div class="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-32 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div class="flex justify-between items-start">
                          <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Hours</span>
                          <div class="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400">
                              <Clock class="w-4 h-4" />
                          </div>
                        </div>
                        <div class="text-3xl font-semibold tracking-tighter text-zinc-900 dark:text-white">142.5 <span class="text-lg text-zinc-400 font-medium">h</span></div>
                      </div>

                      <div class="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-32 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div class="flex justify-between items-start">
                          <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Clients</span>
                          <div class="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center border border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400">
                              <Briefcase class="w-4 h-4" />
                          </div>
                        </div>
                        <div class="text-3xl font-semibold tracking-tighter text-zinc-900 dark:text-white">3</div>
                      </div>

                      <div class="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-32 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div class="flex justify-between items-start">
                          <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Blockers</span>
                          <div class="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400">
                              <AlertTriangle class="w-4 h-4" />
                          </div>
                        </div>
                        <div class="text-3xl font-semibold tracking-tighter text-red-600 dark:text-red-400">1</div>
                      </div>
                  </div>

                  <div class="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex-1">
                      <div class="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <h3 class="font-semibold text-zinc-900 dark:text-white text-sm">Recent Proof of Work</h3>
                      </div>
                      <div class="p-0">
                        <div class="w-full">
                            <div class="grid grid-cols-12 px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              <div class="col-span-2">Date</div>
                              <div class="col-span-2">Client</div>
                              <div class="col-span-4">Summary</div>
                              <div class="col-span-2">Evidence</div>
                              <div class="col-span-2 text-right">Status</div>
                            </div>

                            <div class="grid grid-cols-12 items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer">
                              <div class="col-span-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">Today</div>
                              <div class="col-span-2">
                                  <Badge variant="secondary" class="bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 font-medium rounded-md px-2 py-0.5 text-xs">TechCorp</Badge>
                              </div>
                              <div class="col-span-4 text-sm font-medium text-zinc-900 dark:text-white truncate pr-4">Fixed API Rate Limiting issues on V2</div>
                              <div class="col-span-2">
                                  <div class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md w-fit">
                                    <Video class="h-3 w-3" /> Video
                                  </div>
                              </div>
                              <div class="col-span-2 text-right">
                                  <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-900/30 text-[10px] font-bold uppercase tracking-wider">
                                    <CheckCircle2 class="h-3 w-3" /> Done
                                  </div>
                              </div>
                            </div>

                            <div class="grid grid-cols-12 items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer">
                              <div class="col-span-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">Yesterday</div>
                              <div class="col-span-2">
                                  <Badge variant="secondary" class="bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 font-medium rounded-md px-2 py-0.5 text-xs">DesignStudio</Badge>
                              </div>
                              <div class="col-span-4 text-sm font-medium text-zinc-900 dark:text-white truncate pr-4">Updated Figma Tokens for Mobile</div>
                              <div class="col-span-2">
                                  <div class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md w-fit">
                                    <Paperclip class="h-3 w-3" /> File
                                  </div>
                              </div>
                              <div class="col-span-2 text-right">
                                  <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-900/30 text-[10px] font-bold uppercase tracking-wider">
                                    <CheckCircle2 class="h-3 w-3" /> Done
                                  </div>
                              </div>
                            </div>

                            <div class="grid grid-cols-12 items-center px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer bg-red-50/30 dark:bg-red-900/5">
                              <div class="col-span-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">Jan 23</div>
                              <div class="col-span-2">
                                  <Badge variant="secondary" class="bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 font-medium rounded-md px-2 py-0.5 text-xs">StartupInc</Badge>
                              </div>
                              <div class="col-span-4 text-sm font-medium text-zinc-900 dark:text-white truncate pr-4">Waiting for AWS Access Keys</div>
                              <div class="col-span-2">
                                  <span class="text-zinc-400 text-xs italic">No evidence</span>
                              </div>
                              <div class="col-span-2 text-right">
                                  <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/30 text-[10px] font-bold uppercase tracking-wider">
                                    <AlertTriangle class="h-3 w-3" /> Blocked
                                  </div>
                              </div>
                            </div>

                        </div>
                      </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-32 relative bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
      <div class="max-w-6xl px-6 mx-auto">
        <div class="text-center mb-16">
          <Badge variant="outline" class="mb-6 rounded-full border-red-200 text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30">Reality Check</Badge>
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tighter text-zinc-900 dark:text-white mb-4">Anong klaseng VA ka?</h2>
          <p class="text-zinc-600 dark:text-zinc-400">Clients pay cheap for "employees." They pay premium for "peace of mind."</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 items-stretch">
           
           <Card class="border-zinc-200 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-950 relative overflow-hidden group">
              <CardContent class="p-8">
                <div class="flex items-center justify-between mb-8">
                   <h3 class="font-bold text-zinc-400 uppercase tracking-widest text-xs">The "Yes Sir" Employee</h3>
                   <XCircle class="w-5 h-5 text-red-500" />
                </div>
                <ul class="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                   <li class="flex items-start gap-3 opacity-60"><span class="text-red-500 select-none">✕</span> "Opo Sir, I will do that."</li>
                   <li class="flex items-start gap-3 opacity-60"><span class="text-red-500 select-none">✕</span> Sends screenshots every 10 mins</li>
                   <li class="flex items-start gap-3 opacity-60"><span class="text-red-500 select-none">✕</span> Manual invoices (PDF)</li>
                </ul>
                <div class="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                   <p class="text-xs font-semibold text-red-500 flex items-center gap-2">
                     ⚠️ Client Result: "Micromanagement Hell"
                   </p>
                </div>
              </CardContent>
           </Card>

           <Card class="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 shadow-none relative overflow-hidden ring-1 ring-blue-500/20">
              <CardContent class="p-8">
                <div class="flex items-center justify-between mb-8">
                   <h3 class="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-xs">The Strategic Partner</h3>
                   <CheckCircle2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <ul class="space-y-4 text-sm text-zinc-900 dark:text-zinc-200 font-medium">
                   <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> "I updated the dashboard. Watch this video."</li>
                   <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Output-based logging (No spyware)</li>
                   <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Auto-generated clean reports</li>
                </ul>
                <div class="mt-8 pt-6 border-t border-blue-200 dark:border-blue-800/30">
                   <p class="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                     ✨ Client Result: "Complete Trust & High Rates"
                   </p>
                </div>
              </CardContent>
           </Card>

        </div>
      </div>
    </section>

    <section class="py-32 px-6 max-w-7xl mx-auto">
      <div class="mb-16 md:mb-24">
         <h2 class="text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-900 dark:text-white mb-6">Diskarteng Pinoy,<br/><span class="text-zinc-400">World-Class Tech.</span></h2>
         <p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">Everything you need to look like a legitimate agency of one.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
         <div v-for="(feature, idx) in features" :key="idx" 
              :class="['rounded-3xl p-8 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1', feature.class]">
            
            <div class="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <div :class="['w-10 h-10 rounded-full flex items-center justify-center mb-6 bg-white/10 backdrop-blur-sm', feature.iconClass]">
                     <component :is="feature.icon" class="w-5 h-5" />
                  </div>
                  <h3 class="text-xl font-bold mb-3 tracking-tight">{{ feature.title }}</h3>
                  <p :class="['text-sm leading-relaxed', feature.dark ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400']">{{ feature.desc }}</p>
               </div>

               <div v-if="idx === 0" class="mt-8 rounded-lg bg-zinc-800 border border-zinc-700 p-2 flex items-center gap-3 w-fit">
                  <div class="h-8 w-12 bg-zinc-700 rounded flex items-center justify-center">
                    <Play class="w-3 h-3 text-white fill-white" />
                  </div>
                  <div class="space-y-1">
                     <div class="h-1.5 w-24 bg-zinc-700 rounded-full"></div>
                     <div class="h-1.5 w-16 bg-zinc-700 rounded-full"></div>
                  </div>
               </div>

               <div v-if="idx === 3" class="mt-8 flex -space-x-2">
                  <div class="w-8 h-8 rounded-full border-2 border-blue-50 bg-white flex items-center justify-center text-[10px] font-bold text-blue-600">C1</div>
                  <div class="w-8 h-8 rounded-full border-2 border-blue-50 bg-white flex items-center justify-center text-[10px] font-bold text-indigo-600">C2</div>
                  <div class="w-8 h-8 rounded-full border-2 border-blue-50 bg-white flex items-center justify-center text-[10px] font-bold text-zinc-400">+</div>
               </div>
            </div>
         </div>
      </div>
    </section>

    <section class="py-24 px-6 max-w-2xl mx-auto border-t border-zinc-100 dark:border-zinc-800">
       <div class="text-center mb-12">
          <h2 class="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">Frequently Asked Questions</h2>
          <p class="text-zinc-500">Walang bolahan. Straight answers only.</p>
       </div>
       <Accordion type="single" collapsible class="w-full space-y-4">
        <AccordionItem v-for="(faq, index) in faqs" :key="index" :value="`item-${index}`" class="border-b border-zinc-100 dark:border-zinc-800">
          <AccordionTrigger class="text-left text-base font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 hover:no-underline py-5">
            {{ faq.question }}
          </AccordionTrigger>
          <AccordionContent class="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base pb-6">
            {{ faq.answer }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>

    <section class="py-32 px-6 bg-zinc-950 text-white text-center relative overflow-hidden">
       <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-600/20 blur-[100px] pointer-events-none rounded-full"></div>

       <div class="relative z-10 max-w-3xl mx-auto">
          <h2 class="text-4xl md:text-6xl font-semibold tracking-tighter mb-8">Ready to upgrade your career?</h2>
          <p class="text-zinc-400 text-lg mb-10">From "Helper" to "Partner." Start building your reputation today.</p>
          
          <div class="flex flex-col items-center gap-6">
            <Button size="lg" class="h-12 px-10 rounded-full bg-white text-black hover:bg-zinc-200 text-base font-medium transition-transform hover:scale-105" as-child>
              <router-link to="/pricing">Start for Free</router-link>
            </Button>
            <div class="flex items-center gap-6 text-sm text-zinc-500">
               <span class="flex items-center gap-2"><ShieldCheck class="w-4 h-4" /> No credit card</span>
               <span class="flex items-center gap-2"><Zap class="w-4 h-4" /> Cancel anytime</span>
            </div>
          </div>
       </div>
    </section>

  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
/* Optional: For smoother font rendering on dark backgrounds */
div {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
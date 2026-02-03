<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Video, 
  ShieldCheck, 
  FileText, 
  Zap, 
  LayoutTemplate,  
  Lock,
  ArrowRight,
  Code,
  Play
} from 'lucide-vue-next'
import BackgroundNoise from '@/components/ui/background-noise/BackgroundNoise.vue'

const handleSignUp = () => {
  window.open(`${import.meta.env.VITE_APP_URL}/sign-up`, '_blank')
}

import { useHead } from '@unhead/vue'

useHead({
  title: 'Features - Proof of Work, Not Spyware',
  meta: [
    { name: 'description', content: 'Output verification, video embeds, and client portals without the invasion of privacy. See all features of ZenPortal.' },
    { property: 'og:title', content: 'ZenPortal Features - Everything you need to fire your micromanager' },
    { property: 'og:description', content: 'Tools designed to build Trust Capital so you can work asynchronously.' },
  ]
})
</script>

<template>
  <div class="min-h-screen font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
    
    <BackgroundNoise />

    <section class="relative z-10 pt-32 pb-24 max-w-5xl mx-auto px-6 text-center">
      <div class="flex justify-center mb-8">
        <Badge variant="outline" class="rounded-full px-4 py-1 border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 shadow-sm">
          Product Tour
        </Badge>
      </div>
      <h1 class="text-5xl md:text-7xl font-semibold tracking-tighter text-zinc-900 dark:text-white mb-8 text-balance leading-[0.95]">
        Everything you need to <br/>
        <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">fire your micromanager.</span>
      </h1>
      <p class="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed text-balance">
        Tools designed to build "Trust Capital" so you can work asynchronously and get paid what you're worth.
      </p>
    </section>

    <section class="relative z-10 max-w-7xl mx-auto px-6 mb-32">
      <div class="grid md:grid-cols-2 gap-16 items-center">
        
        <div class="order-2 md:order-1 relative group perspective-1000">
          <div class="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
          
          <div class="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden ring-1 ring-zinc-900/5 dark:ring-white/10 transform transition-transform duration-500 group-hover:rotate-y-2">
             <div class="h-10 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 px-4 flex items-center justify-between backdrop-blur">
                <div class="flex gap-1.5">
                   <div class="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                   <div class="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                   <div class="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                </div>
                <div class="text-[10px] font-mono text-zinc-400">drive.google.com</div>
                <div class="w-10"></div>
             </div>
             
             <div class="aspect-video bg-zinc-100 dark:bg-black/50 flex items-center justify-center relative group/player overflow-hidden">
                <!-- <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale group-hover/player:scale-105 transition-transform duration-700"></div> -->
                <div class="absolute inset-0 bg-black/20"></div>
                
                <div class="relative h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 cursor-pointer group-hover/player:scale-110 transition-transform">
                    <Play class="h-6 w-6 text-white fill-white ml-1" />
                </div>

                <div class="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-lg">
                    <div class="flex items-center gap-3">
                      <div class="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span class="text-xs font-mono text-zinc-800 dark:text-zinc-200">Google Drive Embed Active</span>
                    </div>
                    <Badge variant="secondary" class="text-[10px] h-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500">Proof of Work</Badge>
                </div>
             </div>
          </div>
        </div>

        <div class="order-1 md:order-2 space-y-8">
          <div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-6">
              <Video class="h-6 w-6" />
            </div>
            <h2 class="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">The "Asynchronous Standup"</h2>
            <p class="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Stop waking up at 3 AM for Zoom meetings. Record a screen share explaining your work, and we embed it directly in the client dashboard.
            </p>
          </div>
          
          <div class="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl relative overflow-hidden">
             <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
             <h4 class="font-bold text-zinc-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                <Zap class="w-4 h-4 text-blue-500" /> "Tipid" Tip:
             </h4>
             <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
               Loom limits you to 5 minutes on the free plan. Use <strong class="text-zinc-900 dark:text-white">Screenity (Free)</strong> to record unlimited videos to Google Drive. ZenPortal embeds Drive links automatically!
             </p>
          </div>

          <ul class="space-y-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <li class="flex items-center gap-3"><div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div> Embed Loom, Vimeo, or YouTube</li>
            <li class="flex items-center gap-3"><div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div> <strong>New:</strong> Direct Google Drive Embedding</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="relative z-10 max-w-7xl mx-auto px-6 mb-32">
      <div class="grid md:grid-cols-2 gap-16 items-center">
        <div class="space-y-8">
          <div>
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-6">
              <ShieldCheck class="h-6 w-6" />
            </div>
            <h2 class="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">Proof of Work, <br/><span class="text-zinc-400">Not Invasion of Privacy.</span></h2>
            <p class="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Time Doctor and Hubstaff take screenshots of your personal messages. ZenPortal logs <strong>output</strong>. Link your commits, design files, or completed Trello cards. We verify the result, not the process.
            </p>
          </div>
           <ul class="space-y-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <li class="flex items-center gap-3"><div class="h-1.5 w-1.5 rounded-full bg-green-500"></div> No screenshots or keystroke logging</li>
            <li class="flex items-center gap-3"><div class="h-1.5 w-1.5 rounded-full bg-green-500"></div> Output-based verification</li>
          </ul>
        </div>

        <div class="relative group perspective-1000">
           <div class="absolute -inset-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
          
           <div class="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6 ring-1 ring-zinc-900/5 dark:ring-white/10 transform transition-transform duration-500 hover:rotate-x-2">
              <div class="space-y-4">
                  <div class="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
                      <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FileText class="h-5 w-5"/>
                      </div>
                      <div class="flex-1">
                          <div class="text-sm font-bold text-zinc-900 dark:text-white">Q3 Marketing Report.pdf</div>
                          <div class="text-xs text-zinc-500">Attached 2 hours ago</div>
                      </div>
                      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 text-[10px] font-bold uppercase tracking-wider">
                         <ShieldCheck class="w-3 h-3" /> Verified
                      </div>
                  </div>

                  <div class="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
                      <div class="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <Zap class="h-5 w-5"/>
                      </div>
                      <div class="flex-1">
                          <div class="text-sm font-bold text-zinc-900 dark:text-white">Figma Link: Homepage V2</div>
                          <div class="text-xs text-zinc-500">Linked 4 hours ago</div>
                      </div>
                      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 text-[10px] font-bold uppercase tracking-wider">
                         <ShieldCheck class="w-3 h-3" /> Verified
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 max-w-7xl mx-auto px-6 mb-32">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-semibold tracking-tighter text-zinc-900 dark:text-white">Everything else included.</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card class="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
                <CardHeader>
                    <div class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                       <LayoutTemplate class="h-5 w-5 text-zinc-900 dark:text-white" />
                    </div>
                    <CardTitle class="text-lg">Client Portal</CardTitle>
                </CardHeader>
                <CardContent class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    A dedicated URL (e.g. zenportal.io/p/your-name) where clients can see everything without signing up.
                </CardContent>
            </Card>

            <Card class="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
                <CardHeader>
                    <div class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                       <Code class="h-5 w-5 text-zinc-900 dark:text-white" />
                    </div>
                    <CardTitle class="text-lg">Programmatic API</CardTitle>
                </CardHeader>
                <CardContent class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    (Pro) Automate your workflow by connecting to time trackers or project management tools.
                </CardContent>
            </Card>

            <Card class="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
                <CardHeader>
                    <div class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                       <Lock class="h-5 w-5 text-zinc-900 dark:text-white" />
                    </div>
                    <CardTitle class="text-lg">Secure Access</CardTitle>
                </CardHeader>
                <CardContent class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Magic links ensure only your client sees your sensitive work, no passwords needed for them.
                </CardContent>
            </Card>

            <Card class="md:col-span-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-none overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <CardContent class="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-6 relative z-10">
                    <div class="text-center md:text-left">
                        <h3 class="text-2xl md:text-3xl font-bold mb-2 tracking-tight">Ready to look professional?</h3>
                        <p class="text-zinc-400 dark:text-zinc-600">Join thousands of Filipino VAs and Developers scaling their business.</p>
                    </div>
                    <Button 
                      size="lg"
                      class="rounded-full h-12 px-8 bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 font-semibold"
                      @click="handleSignUp">
                      Start Free Trial <ArrowRight class="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    </section>
  </div>
</template>
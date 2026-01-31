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
  Code
} from 'lucide-vue-next'

const handleSignUp = () => {
  window.open(`${import.meta.env.VITE_APP_URL}/sign-up`, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-foreground selection:bg-blue-500/30 mt-40">
    <section class="max-w-7xl mx-auto px-6 text-center mb-24">
      <Badge variant="outline" class="mb-6 border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400">
        Product Tour
      </Badge>
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
        Everything you need to <br/>
        <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">fire your micromanager.</span>
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Tools designed to build "Trust Capital" so you can work asynchronously and get paid what you're worth.
      </p>
    </section>

    <section class="max-w-7xl mx-auto px-6 mb-32">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="order-2 md:order-1 relative group">
          <div class="absolute -inset-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div class="relative bg-background/80 backdrop-blur-xl border border-border/50 rounded-xl p-2 shadow-2xl overflow-hidden">
             <div class="rounded-lg bg-muted/50 aspect-video flex items-center justify-center border border-dashed border-border relative overflow-hidden group/player">
                <Video class="h-16 w-16 text-muted-foreground/50 group-hover/player:scale-110 transition-transform" />
                <div class="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur p-3 rounded-lg border border-border/50 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span class="text-xs font-mono">Google Drive Embed Active</span>
                    </div>
                    <Badge variant="secondary" class="text-[10px] h-5">Free Tool</Badge>
                </div>
             </div>
          </div>
        </div>
        <div class="order-1 md:order-2 space-y-6">
          <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Video class="h-6 w-6" />
          </div>
          <h2 class="text-3xl font-bold">The "Asynchronous Standup"</h2>
          <p class="text-lg text-muted-foreground leading-relaxed">
            Stop waking up at 3 AM for Zoom meetings. Record a screen share explaining your work, and we embed it directly in the client dashboard.
          </p>
          
          <div class="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 p-4 rounded-lg">
             <h4 class="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2">💡 Tipid Tips (Save Money):</h4>
             <p class="text-sm text-blue-600 dark:text-blue-400">
               Loom limits you to 5 minutes on the free plan. Use <strong>Screenity (Free)</strong> to record unlimited videos to Google Drive. ZenPortal embeds Drive links automatically!
             </p>
          </div>

          <ul class="space-y-2 text-sm font-medium pt-2">
            <li class="flex items-center gap-2"><div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div> Embed Loom, Vimeo, or YouTube</li>
            <li class="flex items-center gap-2"><div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div> <strong>New:</strong> Direct Google Drive Embedding</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mb-32">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <ShieldCheck class="h-6 w-6" />
          </div>
          <h2 class="text-3xl font-bold">Proof of Work, Not Invasion of Privacy</h2>
          <p class="text-lg text-muted-foreground leading-relaxed">
            Time Doctor and Hubstaff take screenshots of your personal messages. ZenPortal logs <strong>output</strong>. Link your commits, design files, or completed Trello cards. We verify the result, not the process.
          </p>
           <ul class="space-y-2 text-sm font-medium">
            <li class="flex items-center gap-2"><div class="h-1.5 w-1.5 rounded-full bg-green-500"></div> No screenshots or keystroke logging</li>
            <li class="flex items-center gap-2"><div class="h-1.5 w-1.5 rounded-full bg-green-500"></div> Output-based verification</li>
          </ul>
        </div>
        <div class="relative group">
           <div class="absolute -inset-1 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div class="relative bg-background/80 backdrop-blur-xl border border-border/50 rounded-xl p-6 shadow-2xl">
              <div class="space-y-3">
                  <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                      <div class="h-8 w-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-500"><FileText class="h-4 w-4"/></div>
                      <div class="flex-1">
                          <div class="text-sm font-medium">Q3 Marketing Report.pdf</div>
                          <div class="text-xs text-muted-foreground">Attached 2 hours ago</div>
                      </div>
                      <Badge variant="outline" class="text-green-600 border-green-500/30 bg-green-500/10">Verified</Badge>
                  </div>
                  <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                      <div class="h-8 w-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-500"><Zap class="h-4 w-4"/></div>
                      <div class="flex-1">
                          <div class="text-sm font-medium">Figma Link: Homepage V2</div>
                          <div class="text-xs text-muted-foreground">Linked 4 hours ago</div>
                      </div>
                      <Badge variant="outline" class="text-green-600 border-green-500/30 bg-green-500/10">Verified</Badge>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mb-32">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold">Everything else included</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card class="bg-muted/20 border-border/50 hover:bg-muted/40 transition">
                <CardHeader>
                    <LayoutTemplate class="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Client Portal</CardTitle>
                </CardHeader>
                <CardContent class="text-muted-foreground text-sm">
                    A dedicated URL (e.g. zenportal.io/p/your-name) where clients can see everything without signing up.
                </CardContent>
            </Card>
            <Card class="bg-muted/20 border-border/50 hover:bg-muted/40 transition">
                <CardHeader>
                    <Code class="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Programmatic API</CardTitle>
                </CardHeader>
                <CardContent class="text-muted-foreground text-sm">
                    (Pro) Automate your workflow by connecting to time trackers or project management tools.
                </CardContent>
            </Card>
            <Card class="bg-muted/20 border-border/50 hover:bg-muted/40 transition">
                <CardHeader>
                    <Lock class="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Secure Access</CardTitle>
                </CardHeader>
                <CardContent class="text-muted-foreground text-sm">
                    Magic links ensure only your client sees your sensitive work, no passwords needed for them.
                </CardContent>
            </Card>
            <Card class="md:col-span-3 bg-linear-to-br from-blue-600 to-purple-700 text-white border-none">
                <CardContent class="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
                    <div>
                        <h3 class="text-2xl font-bold mb-2">Ready to look professional?</h3>
                        <p class="text-blue-100">Join thousands of Filipino VAs and Developers scaling their business.</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      class="whitespace-nowrap"
                      @click="handleSignUp">
                      Start Free Trial <ArrowRight class="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MapPin, Zap, HeartHandshake, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-foreground selection:bg-purple-500/30">
    
    <!-- <div class="fixed inset-0 -z-10 bg-background">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-200 w-200 bg-blue-500/5 rounded-full blur-[120px]"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
    </div> -->

    <section class="max-w-4xl mx-auto px-6 text-center mb-24">
      <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-8">
        Built by Filipinos, <br/>
        for the <span class="text-transparent bg-clip-text bg-linear-to-br from-blue-500 to-purple-600">Global Gig Economy.</span>
      </h1>
      <p class="text-xl text-muted-foreground leading-relaxed">
        We believe that Filipino talent is world-class. <br/>
        The tools we use to manage that talent should be too.
      </p>
    </section>

    <section class="max-w-5xl mx-auto px-6 mb-24">
      <div class="grid md:grid-cols-2 gap-12">
        <div class="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p class="text-foreground font-medium text-2xl">The Story</p>
          <p>
            For years, the standard for remote work in the Philippines was low trust. Clients demanded screenshots every 10 minutes. Freelancers were treated like commodities, not partners.
          </p>
          <p>
            We built ZenPortal to break that cycle. We wanted a way to prove our value to clients in New York, London, and Sydney without sacrificing our dignity, privacy, or <strong class="text-foreground">monthly earnings on expensive software.</strong>
          </p>
          <p>
            It started as a simple internal tool for a small dev team in Bicol. Today, it's helping thousands of VAs transition from "employee" to "consultant" by using smart, free tools to look professional.
          </p>
        </div>
        <div class="relative">
             <div class="absolute inset-0 bg-linear-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl -rotate-2"></div>
             <Card class="relative h-full bg-background/80 backdrop-blur border-border/60 p-8 flex flex-col justify-center gap-6">
                <div class="flex items-start gap-4">
                    <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                        <MapPin class="h-6 w-6" />
                    </div>
                    <div>
                        <h3 class="font-bold text-foreground">Roots in Bicol</h3>
                        <p class="text-sm text-muted-foreground">Proudly developed in the Philippines. We understand the unique challenges of our internet infrastructure and time zones.</p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <div class="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                        <Zap class="h-6 w-6" />
                    </div>
                    <div>
                        <h3 class="font-bold text-foreground">Smart & Efficient ("Diskarte")</h3>
                        <p class="text-sm text-muted-foreground">
                          We integrate with free tools like <strong class="text-foreground">Google Drive & Screenity</strong> so you don't need to pay for Loom or Dropbox just to look professional. For power users, a full API is available to automate everything.
                        </p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <div class="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg text-pink-600 dark:text-pink-400">
                        <HeartHandshake class="h-6 w-6" />
                    </div>
                    <div>
                        <h3 class="font-bold text-foreground">Partner, not Employee</h3>
                        <p class="text-sm text-muted-foreground">Our UI is designed to make you look like a premium agency, allowing you to justify higher rates.</p>
                    </div>
                </div>
             </Card>
        </div>
      </div>
    </section>

    <section class="border-y border-border/50 bg-muted/20 py-16">
        <div class="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
                <div class="text-4xl font-bold mb-2">100%</div>
                <div class="text-sm text-muted-foreground">Free for Starters</div>
            </div>
            <div>
                <div class="text-4xl font-bold mb-2">0</div>
                <div class="text-sm text-muted-foreground">Screenshots Taken</div>
            </div>
            <div>
                <div class="text-4xl font-bold mb-2">24/7</div>
                <div class="text-sm text-muted-foreground">Portal Uptime</div>
            </div>
            <div>
                <div class="text-4xl font-bold mb-2">PH</div>
                <div class="text-sm text-muted-foreground">Made with Pride</div>
            </div>
        </div>
    </section>

    <section class="py-24 px-6 text-center">
        <h2 class="text-3xl font-bold mb-6">Join the movement</h2>
        <p class="text-muted-foreground mb-8 max-w-lg mx-auto">
            Stop letting clients treat you like a robot. Start managing your work like a business.
        </p>
        <Button size="lg" class="rounded-full px-8 h-12 gap-2" as-child>
            <router-link to="/sign-up">Create Free Account <ArrowRight class="h-4 w-4" /></router-link>
        </Button>
    </section>

  </div>
</template>
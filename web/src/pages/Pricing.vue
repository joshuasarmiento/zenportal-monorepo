<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Check, X, Sparkles } from 'lucide-vue-next'

const plans = [
  {
    name: 'Starter',
    price: '0',
    desc: 'Perfect for your first client.',
    features: [
      '1 Active Client',
      'Basic Work Logging',
      'Standard Public Profile',
      '30 Days History'
    ],
    missing: ['Video Embedding (Loom/Drive)', 'Custom Branding', 'API Access', 'Priority Support'],
    cta: 'Start for Free',
    variant: 'outline',
    popular: false
  },
  {
    name: 'Agency Pro',
    price: '12',
    desc: 'Scale your freelance business.',
    features: [
      'Unlimited Clients',
      'Loom & Drive Embeds',
      'Custom Branding & Colors',
      'Unlimited History',
      'Export to PDF/CSV',
      'Programmatic API Access',
      'Priority Support'
    ],
    missing: [],
    cta: 'Go Pro',
    variant: 'default',
    popular: true
  }
]

const handleSignUp = () => {
  window.open(`${import.meta.env.VITE_APP_URL}/sign-up`, '_blank')
}
</script>

<template>
  <div class="min-h-screen font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-x-hidden pt-32 pb-20">
    
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[20%] right-1/2 w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>

    <main class="relative z-10 max-w-5xl mx-auto px-6">
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-semibold mb-6 tracking-tighter text-zinc-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p class="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Start for free, upgrade when you land more clients. <br class="hidden md:block" />No hidden fees. Cancel anytime.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
        
        <Card 
          class="flex flex-col relative border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <CardHeader class="pb-8">
            <CardTitle class="text-2xl font-bold text-zinc-900 dark:text-white">Starter</CardTitle>
            <CardDescription class="text-base text-zinc-500">Perfect for your first client.</CardDescription>
            <div class="mt-6 flex items-baseline gap-1">
              <span class="text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">$0</span>
              <span class="text-zinc-500 font-medium">/month</span>
            </div>
          </CardHeader>

          <CardContent class="flex-1">
            <ul class="space-y-4">
              <li v-for="feature in plans[0]?.features" :key="feature" class="flex items-start gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <div class="h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check class="h-3 w-3 text-zinc-900 dark:text-white" />
                </div>
                {{ feature }}
              </li>
              <li v-for="feature in plans[0]?.missing" :key="feature" class="flex items-start gap-3 text-sm text-zinc-400 dark:text-zinc-600">
                <div class="h-5 w-5 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-100 dark:border-zinc-800">
                  <X class="h-3 w-3" />
                </div>
                {{ feature }}
              </li>
            </ul>
          </CardContent>

          <CardFooter class="pt-8">
            <Button 
              variant="outline"
              class="w-full h-12 text-base font-semibold rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              @click="handleSignUp"
            >
              Start for Free
            </Button>
          </CardFooter>
        </Card>

        <Card 
          class="flex flex-col relative border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xl scale-100 md:scale-105 z-10 overflow-hidden"
        >
          <div class="absolute top-0 right-0 p-4">
             <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                <Sparkles class="w-3 h-3 fill-white" /> Most Popular
             </div>
          </div>

          <div class="absolute top-[-50%] left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/20 blur-[80px] pointer-events-none"></div>

          <CardHeader class="pb-8 relative z-10">
            <CardTitle class="text-2xl font-bold">Agency Pro</CardTitle>
            <CardDescription class="text-base text-zinc-400 dark:text-zinc-600">Scale your freelance business.</CardDescription>
            <div class="mt-6 flex items-baseline gap-1">
              <span class="text-5xl font-bold tracking-tighter">$12</span>
              <span class="text-zinc-400 dark:text-zinc-600 font-medium">/month</span>
            </div>
          </CardHeader>

          <CardContent class="flex-1 relative z-10">
            <ul class="space-y-4">
              <li v-for="feature in plans[1]?.features" :key="feature" class="flex items-start gap-3 text-sm font-medium">
                <div class="h-5 w-5 rounded-full bg-white/20 dark:bg-zinc-900/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check class="h-3 w-3 text-white dark:text-zinc-900" />
                </div>
                {{ feature }}
              </li>
            </ul>
          </CardContent>

          <CardFooter class="pt-8 relative z-10">
            <Button 
              class="w-full h-12 text-base font-bold rounded-full bg-white text-zinc-950 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 transition-all duration-300 shadow-lg shadow-white/10 dark:shadow-black/10"
              @click="handleSignUp"
            >
              Go Pro
            </Button>
          </CardFooter>
        </Card>

      </div>
      
      <div class="mt-16 text-center">
          <p class="text-sm text-zinc-500 flex items-center justify-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span> 30-day money-back guarantee. No questions asked.
          </p>
      </div>

    </main>
  </div>
</template>
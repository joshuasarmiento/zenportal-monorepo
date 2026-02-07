<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Check, X, Sparkles } from 'lucide-vue-next'
import BackgroundNoise from '@/components/ui/background-noise/BackgroundNoise.vue'
import { ref, computed } from 'vue'

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
    name: 'Pro',
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
  // Pro Plan is dynamic now, removed from static array to handle reactivity better in template or computed
]

const billingInterval = ref<'monthly' | 'yearly'>('monthly')


const proPrice = computed(() => billingInterval.value === 'monthly' ? '12' : '10')
const proPeriod = computed(() => billingInterval.value === 'monthly' ? '/month' : '/month')
const billingDescription = computed(() => billingInterval.value === 'yearly' ? 'billed yearly' : 'billed monthly')


const handleSignUp = () => {
  window.open(`${import.meta.env.VITE_APP_URL}/sign-up`, '_blank')
}

import { useHead } from '@unhead/vue'
import { Motion } from 'motion-v'

useHead({
  title: 'Pricing - Free Forever for Starters',
  meta: [
    { name: 'description', content: 'Start using ZenPortal for free. Upgrade to Pro for unlimited clients and custom branding only when you need it.' },
    { property: 'og:title', content: 'ZenPortal Pricing - Simple & Transparent' },
    { property: 'og:description', content: 'Perfect for your first client. Scale your freelance business with Pro.' },
  ]
})
</script>

<template>
  <div
    class="min-h-screen font-sans bg-background text-foreground overflow-x-hidden pt-32 pb-20">

    <BackgroundNoise />

    <main class="relative z-10 max-w-5xl mx-auto px-6">
      <div class="text-center mb-16">
        <Motion
          is="h1"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
          class="text-5xl md:text-6xl font-semibold mb-6 tracking-tighter text-foreground"
        >
          Simple, Transparent Pricing
        </Motion>
        <Motion
          is="p"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.3 }"
          class="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Start for free, upgrade when you land more clients. <br class="hidden md:block" />No hidden fees. Cancel
          anytime.
        </Motion>
      </div>

      <div class="flex justify-center mb-10">
        <div class="flex items-center gap-3 bg-muted/50 p-1.5 rounded-full border border-border/50">
          <span class="text-sm font-medium px-3 py-1 rounded-full transition-all cursor-pointer"
            :class="billingInterval === 'monthly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="billingInterval = 'monthly'">
            Monthly
          </span>
          <span class="text-sm font-medium px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-2"
            :class="billingInterval === 'yearly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="billingInterval = 'yearly'">
            Yearly <span class="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">Save 17%</span>
          </span>
        </div>
      </div>


      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">

        <Motion
          is="div"
          :initial="{ opacity: 0, y: 50 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.4 }"
        >
          <Card
            class="flex flex-col relative border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader class="pb-8">
              <CardTitle class="text-2xl font-bold text-foreground">Starter</CardTitle>
              <CardDescription class="text-base text-muted-foreground">Perfect for your first client.</CardDescription>
              <div class="mt-6 flex items-baseline gap-1">
                <span class="text-5xl font-bold tracking-tighter text-foreground">{{ plans[0]?.price
                  }}</span>
                <span class="text-muted-foreground font-medium">/month</span>
              </div>
            </CardHeader>

            <CardContent class="flex-1">
              <ul class="space-y-4">
                <li v-for="feature in plans[0]?.features" :key="feature"
                  class="flex items-start gap-3 text-sm font-medium text-foreground">
                  <div
                    class="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Check class="h-3 w-3 text-foreground" />
                  </div>
                  {{ feature }}
                </li>
                <li v-for="feature in plans[0]?.missing" :key="feature"
                  class="flex items-start gap-3 text-sm text-muted-foreground">
                  <div
                    class="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 border border-border">
                    <X class="h-3 w-3" />
                  </div>
                  {{ feature }}
                </li>
              </ul>
            </CardContent>

            <CardFooter class="pt-8">
              <Button variant="outline"
                class="w-full h-12 text-base font-semibold rounded-full border-border hover:bg-muted"
                @click="handleSignUp">
                Start for Free
              </Button>
            </CardFooter>
          </Card>
        </Motion>

        <Motion
          is="div"
          :initial="{ opacity: 0, y: 50 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.5, type: 'spring' }"
        >
          <Card
            class="flex flex-col relative border-primary bg-primary text-primary-foreground shadow-2xl scale-100 md:scale-105 z-10 overflow-hidden">
            <div class="absolute top-0 right-0 p-4">
              <div
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                <Sparkles class="w-3 h-3 fill-white" /> Most Popular
              </div>
            </div>

            <div
              class="absolute top-[-50%] left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/20 blur-[80px] pointer-events-none">
            </div>

            <CardHeader class="pb-8 relative z-10">
              <CardTitle class="text-2xl font-bold">Pro</CardTitle>
              <CardDescription class="text-base text-primary-foreground/70">Scale your freelance business.
              </CardDescription>
              <div class="mt-6 flex flex-col items-start">
                 <div class="flex items-baseline gap-1">
                  <span class="text-5xl font-bold tracking-tighter">$ {{ proPrice }}</span>
                  <span class="text-primary-foreground/70 font-medium">{{ proPeriod }}</span>
                 </div>
                 <p class="text-xs text-primary-foreground/50 mt-1 font-medium capitalize">{{ billingDescription }}</p>
              </div>

            </CardHeader>

            <CardContent class="flex-1 relative z-10">
              <ul class="space-y-4">
                <li v-for="feature in plans[1]?.features" :key="feature"
                  class="flex items-start gap-3 text-sm font-medium">
                  <div
                    class="h-5 w-5 rounded-full bg-background/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check class="h-3 w-3 text-primary-foreground" />
                  </div>
                  {{ feature }}
                </li>
              </ul>
            </CardContent>

            <CardFooter class="pt-8 relative z-10">
              <Button
                class="w-full h-12 text-base font-bold rounded-full bg-background text-foreground hover:bg-background/90 transition-all duration-300 shadow-lg shadow-background/10"
                @click="handleSignUp">
                Go Pro
              </Button>
            </CardFooter>
          </Card>
        </Motion>
      </div>

      <Motion
        is="div"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 1, delay: 0.8 }"
        class="mt-16 text-center"
      >
        <p class="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500"></span> No questions asked.
        </p>
      </Motion>
    </main>
  </div>
</template>
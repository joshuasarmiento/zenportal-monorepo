<script setup lang="ts">
// import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Check, X } from 'lucide-vue-next'

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
    missing: ['Video Embedding (Loom/Drive)', 'Custom Branding', 'Programmatic API Access', 'Priority Support'],
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
  <div class="min-h-screen bg-transparent font-sans text-foreground py-20 mt-40">
    <main class="max-w-5xl mx-auto px-6">
      <div class="text-center mb-16 relative">
        <div class="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full -z-10 w-64 h-64 mx-auto top-0"></div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
          Simple, Transparent Pricing
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start for free, upgrade when you land more clients. No hidden fees.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card 
          v-for="plan in plans" 
          :key="plan.name" 
          class="flex flex-col relative transition-all duration-300 backdrop-blur-md bg-white/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-white/10 hover:shadow-2xl hover:-translate-y-1"
          :class="{ 'ring-2 ring-blue-500/50 shadow-blue-500/20 shadow-xl scale-100 md:scale-105 z-10': plan.popular }"
        >
          <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/40">
            Most Popular
          </div>

          <CardHeader>
            <CardTitle class="text-2xl font-bold">{{ plan.name }}</CardTitle>
            <CardDescription class="text-base">{{ plan.desc }}</CardDescription>
            <div class="mt-6 flex items-baseline gap-1">
              <span class="text-5xl font-extrabold tracking-tight">${{ plan.price }}</span>
              <span class="text-muted-foreground font-medium">/month</span>
            </div>
          </CardHeader>

          <CardContent class="flex-1 mt-4">
            <ul class="space-y-4">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3 text-sm font-medium">
                <div class="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check class="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                {{ feature }}
              </li>
              <li v-for="feature in plan.missing" :key="feature" class="flex items-start gap-3 text-sm text-muted-foreground/50">
                <div class="h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center shrink-0 mt-0.5">
                  <X class="h-3 w-3" />
                </div>
                {{ feature }}
              </li>
            </ul>
          </CardContent>

          <CardFooter class="pt-8">
            <Button 
              :variant="plan.variant as any" 
              class="w-full h-12 text-base font-semibold transition-all duration-300"
              :class="plan.popular ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-200 text-white dark:text-zinc-950 hover:shadow-lg hover:shadow-zinc-500/20 dark:hover:shadow-white/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'"
              @click="handleSignUp"
            >
              {{ plan.cta }}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  </div>
</template>
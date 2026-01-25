<script setup lang="ts">
// import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Check, Zap, X } from 'lucide-vue-next'
import ModeToggle from '@/components/ModeToggle.vue'

const router = useRouter()
// const isYearly = ref(false)

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
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-foreground">
    <nav class="flex justify-between items-center max-w-6xl mx-auto px-6 h-16">
      <router-link to="/" class="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">
        <Zap class="h-6 w-6" /> ZenPortal
      </router-link>
      <div class="flex items-center gap-4">
        <ModeToggle />
        <router-link to="/sign-in" class="text-sm font-medium hover:text-primary">Login</router-link>
      </div>
    </nav>

    <main class="max-w-5xl mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-extrabold mb-4">Simple, Transparent Pricing</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start for free, upgrade when you land more clients. No hidden fees.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card 
          v-for="plan in plans" 
          :key="plan.name" 
          class="flex flex-col relative transition-all duration-200"
          :class="{ 'border-blue-500 shadow-xl scale-105 z-10': plan.popular }"
        >
          <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Most Popular
          </div>

          <CardHeader>
            <CardTitle class="text-2xl">{{ plan.name }}</CardTitle>
            <CardDescription>{{ plan.desc }}</CardDescription>
            <div class="mt-4 flex items-baseline gap-1">
              <span class="text-4xl font-extrabold">${{ plan.price }}</span>
              <span class="text-muted-foreground">/month</span>
            </div>
          </CardHeader>

          <CardContent class="flex-1">
            <ul class="space-y-3">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-sm">
                <div class="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <Check class="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                {{ feature }}
              </li>
              <li v-for="feature in plan.missing" :key="feature" class="flex items-center gap-3 text-sm text-muted-foreground/50">
                <div class="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <X class="h-3 w-3" />
                </div>
                {{ feature }}
              </li>
            </ul>
          </CardContent>

          <CardFooter>
            <Button 
              :variant="plan.variant as any" 
              class="w-full h-12 text-lg"
              @click="router.push('/sign-up')"
            >
              {{ plan.cta }}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  </div>
</template>
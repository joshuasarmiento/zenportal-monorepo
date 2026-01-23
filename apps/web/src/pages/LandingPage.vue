<script setup lang="ts">
import { useUser } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import ModeToggle from '@/components/ModeToggle.vue'
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Zap, 
  Video, 
  FileText, 
  ShieldCheck 
} from 'lucide-vue-next'

const { isSignedIn, isLoaded } = useUser()
const router = useRouter()

const checkRedirect = () => {
  if (!isLoaded.value) return
  if (isSignedIn.value) router.push('/dashboard')
}

onMounted(checkRedirect)
watch([isLoaded, isSignedIn], checkRedirect)

const features = [
  { icon: Video, title: 'Loom Integration', desc: 'Embed video updates directly in your logs.' },
  { icon: FileText, title: 'Professional Reports', desc: 'Auto-generate clean, branded PDF summaries.' },
  { icon: ShieldCheck, title: 'Proof of Work', desc: 'Eliminate doubt with verifiable timestamps.' },
]

const faqs = [
  {
    question: "Is the Starter plan really free?",
    answer: "Yes, forever. You can manage 1 active client and access basic logging features without paying a dime. No credit card required."
  },
  {
    question: "How do my clients access the portal?",
    answer: "You send them a unique 'Magic Link'. They simply click it to view their dashboard—no passwords, no signup, and no friction for them."
  },
  {
    question: "Can I use my own logo and branding?",
    answer: "Absolutely. The Agency Pro plan allows you to customize the portal with your own logo, brand colors, and subdomain (coming soon) to look completely professional."
  },
  {
    question: "What happens if I cancel my subscription?",
    answer: "Your data is yours. We recommend exporting your logs to CSV before cancelling. Your account will be downgraded to the Free tier at the end of your billing cycle."
  },
  {
    question: "Do you process payments for my clients?",
    answer: "Not yet. ZenPortal is currently focused on 'Proof of Work' and reporting. You continue to invoice your clients using your preferred method (Stripe, PayPal, Wise, etc.), and use us to prove you did the work."
  }
]
</script>

<template>
  <div v-if="!isLoaded || isSignedIn" class="min-h-screen flex items-center justify-center bg-background">
    <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>

  <div v-else class="bg-background min-h-screen font-sans text-foreground selection:bg-primary/20">
    
    <nav class="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div class="flex justify-between items-center max-w-6xl mx-auto px-6 h-16">
        <div class="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">
          <Zap class="h-6 w-6" /> ZenPortal
        </div>
        <div class="flex items-center gap-4">
          <ModeToggle />
          <router-link to="/sign-in" class="text-sm font-medium hover:text-primary transition hidden sm:block">Login</router-link>
          <Button as-child>
            <router-link to="/pricing">Get Started</router-link>
          </Button>
        </div>
      </div>
    </nav>

    <section class="text-center max-w-4xl mx-auto px-6 pt-32 pb-20">
      <Badge variant="outline" class="mb-6 py-1.5 px-4 text-sm border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
        For Premium Freelancers & VAs
      </Badge>
      
      <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground mb-8">
        Stop sending <span class="text-blue-600 dark:text-blue-400 relative whitespace-nowrap">
          ugly emails
          <svg class="absolute -bottom-2 left-0 w-full h-3 text-blue-400/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" /></svg>
        </span> to your clients.
      </h1>
      
      <p class="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
        Replace messy "End of Day" WhatsApp messages with a professional Client Portal. Prove your value, justify your rates, and become unfireable.
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" class="h-14 px-8 text-lg gap-2" as-child>
          <router-link to="/pricing">Create My Portal <ArrowRight class="h-5 w-5" /></router-link>
        </Button>
        <Button variant="outline" size="lg" class="h-14 px-8 text-lg">
          View Live Demo
        </Button>
      </div>
      
      <p class="mt-6 text-sm text-muted-foreground">No credit card required • Free plan available</p>
    </section>

    <section class="bg-muted/30 py-24 border-y border-border">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">The "Old Way" vs. The Pro Way</h2>
          <p class="text-muted-foreground">See why high-ticket clients prefer ZenPortal.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <Card class="relative border-red-100 dark:border-red-900/50 bg-background">
              <CardHeader>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-widest text-red-500">The Cheap VA</span>
                  <XCircle class="h-6 w-6 text-red-500" />
                </div>
              </CardHeader>
              <CardContent class="font-serif text-sm leading-relaxed text-muted-foreground bg-red-50/50 dark:bg-red-900/10 p-6 m-6 mt-0 rounded-md border border-red-100 dark:border-red-900/20">
                <p class="mb-4 text-xs text-red-400">Subject: re: update</p>
                Hi Sir,<br><br>
                Here is update for today. I did the email and also the research. <br>
                Attached is the file <i>screenshot_final_v2.png</i>...
              </CardContent>
            </Card>
          </div>

          <div class="relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30"></div>
            <Card class="relative border-blue-500/20 shadow-2xl">
              <CardHeader>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">The Pro Partner</span>
                  <CheckCircle2 class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent class="p-0">
                <div class="bg-muted/50 p-6 border-t border-border">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">JS</div>
                    <div>
                      <div class="h-2 w-24 bg-foreground/10 rounded mb-1"></div>
                      <div class="h-2 w-16 bg-foreground/10 rounded"></div>
                    </div>
                    <Badge class="ml-auto bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10">Completed</Badge>
                  </div>
                  <div class="space-y-2">
                    <div class="h-2 w-full bg-foreground/5 rounded"></div>
                    <div class="h-2 w-5/6 bg-foreground/5 rounded"></div>
                    <div class="h-24 w-full bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-center border border-dashed border-foreground/10 mt-4">
                      <div class="flex items-center gap-2 text-xs text-muted-foreground">
                        <Video class="h-4 w-4" /> Video Summary
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>

    <section class="py-24 px-6 max-w-6xl mx-auto border-b border-border">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card v-for="feature in features" :key="feature.title" class="bg-muted/20 border-border/50 hover:border-primary/20 transition-colors">
          <CardHeader>
            <component :is="feature.icon" class="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2" />
            <CardTitle>{{ feature.title }}</CardTitle>
          </CardHeader>
          <CardContent class="text-muted-foreground">
            {{ feature.desc }}
          </CardContent>
        </Card>
      </div>
    </section>

    <section class="py-24 px-6 max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p class="text-muted-foreground">Everything you need to know about ZenPortal.</p>
      </div>

      <Accordion type="single" collapsible class="w-full">
        <AccordionItem v-for="(faq, index) in faqs" :key="index" :value="`item-${index}`">
          <AccordionTrigger class="text-left text-lg">{{ faq.question }}</AccordionTrigger>
          <AccordionContent class="text-muted-foreground leading-relaxed">
            {{ faq.answer }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>

    <footer class="py-12 border-t border-border text-center text-sm text-muted-foreground bg-muted/20">
      <p>&copy; {{ new Date().getFullYear() }} ZenPortal. Built for high-performance freelancers.</p>
    </footer>
  </div>
</template>
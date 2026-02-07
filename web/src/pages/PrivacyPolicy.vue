<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Eye, Server, ShieldCheck, FileLock } from 'lucide-vue-next'
import { Motion } from 'motion-v'
import { useHead } from '@unhead/vue'
import BackgroundNoise from '@/components/ui/background-noise/BackgroundNoise.vue'

const lastUpdated = 'January 25, 2026'

useHead({
  title: 'Privacy Policy - Your Data, Your Control',
  meta: [
    { name: 'description', content: 'We process data, you control it. No tracking cookies, no ad sales. Read our Privacy Policy to understand how we protect your data.' },
    { property: 'og:title', content: 'ZenPortal Privacy Policy' },
    { property: 'og:description', content: 'We process data, you control it. Simple as that.' },
  ]
})
</script>

<template>
  <div
    class="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground pt-32 pb-20 overflow-x-hidden">

    <BackgroundNoise />

    <div class="max-w-4xl mx-auto px-6 relative z-10">

      <div class="space-y-6 mb-16 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-2">
          <Motion
            :initial="{ opacity: 0, y: -20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5 }"
          >
            <Badge variant="outline"
              class="rounded-full px-3 py-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              Legal
            </Badge>
          </Motion>
        </div>
        <Motion
          is="h1"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.1 }"
          class="text-5xl md:text-6xl font-semibold tracking-tighter text-foreground"
        >
          Privacy Policy
        </Motion>
        <Motion
          is="p"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
          class="text-xl text-muted-foreground max-w-2xl"
        >
          We process data. You control it. Simple as that.
        </Motion>
        <Motion
          is="div"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.3 }"
          class="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground font-mono"
        >
          <FileLock class="h-4 w-4" />
          <span>Last updated: {{ lastUpdated }}</span>
        </Motion>
      </div>

      <div class="grid gap-12">

        <div class="grid md:grid-cols-3 gap-6">
          <Motion
            v-for="(_card, index) in [0, 1, 2]"
            :key="index"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.4 + (index * 0.1) }"
          >
            <Card class="bg-card border-border p-6 shadow-sm h-full">
              <div class="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                <component :is="[Eye, ShieldCheck, Server][index]" class="h-5 w-5 text-foreground" />
              </div>
              <h3 class="font-bold text-lg mb-2 tracking-tight">{{ ['No Tracking', 'Data Processor', 'Encryption'][index] }}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ [
                'No tracking cookies. No ad sales. You are the customer, not the product.',
                'We process Client Data solely on your behalf and instructions.',
                'Data is encrypted at rest and in transit (TLS 1.3).'
              ][index] }}</p>
            </Card>
          </Motion>
        </div>

        <Motion
          is="div"
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, delay: 0.6 }"
          class="space-y-12 text-muted-foreground leading-relaxed"
        >

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">1. Your Role vs. Our Role
            </h2>
            <p>
              <strong class="text-foreground">You are the Data Controller:</strong> You input data about
              your clients. You are responsible for ensuring you have the legal right to input that data.
              <br />
              <strong class="text-foreground">We are the Data Processor:</strong> We provide the
              infrastructure (ZenPortal) to store and display that data.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">2. Information We Collect
            </h2>
            <ul class="list-disc pl-5 space-y-2 marker:text-muted-foreground">
              <li><strong class="text-foreground">Account Info:</strong> Email/Name</li>
              <li><strong class="text-foreground">Professional Profile:</strong> Bio, Headlines, and
                Social Links you choose to display publicly.</li>
              <li><strong class="text-foreground">Billing Info:</strong> Stored securely by PayMongo. We
                never see your card number.</li>
              <li><strong class="text-foreground">Client Data:</strong> Names, work logs (including
                videos/attachments), and client contacts.</li>
            </ul>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">3. Sub-Processors</h2>
            <p>
              To provide the Service for $12/mo, we rely on best-in-class infrastructure partners. You consent to data
              processing by:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div
                class="p-4 border border-border rounded-lg text-sm bg-muted/50">
                <strong class="text-foreground">Turso</strong> (Database)
              </div>
              <div
                class="p-4 border border-border rounded-lg text-sm bg-muted/50">
                <strong class="text-foreground">Better Auth</strong> (Auth)
              </div>
              <div
                class="p-4 border border-border rounded-lg text-sm bg-muted/50">
                <strong class="text-foreground">PayMongo</strong> (Payments)
              </div>
              <div
                class="p-4 border border-border rounded-lg text-sm bg-muted/50">
                <strong class="text-foreground">Vercel</strong> (Hosting)
              </div>
              <div
                class="p-4 border border-border rounded-lg text-sm bg-muted/50">
                <strong class="text-foreground">Resend</strong> (Emails)
              </div>
              <div
                class="p-4 border border-border rounded-lg text-sm bg-muted/50">
                <strong class="text-foreground">Cloudflare</strong> (Security/CDN)
              </div>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">4. Deletion & Export</h2>
            <p>
              If you cancel, your data is soft-deleted. If you request permanent deletion, we will wipe your data from
              active databases within 30 days. Backups may persist for up to 90 days for disaster recovery.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">5. Security</h2>
            <p>
              We maintain reasonable administrative, technical, and physical safeguards. However, no service is 100%
              secure. You accept that using an online service involves inherent risks.
            </p>
          </section>

          <Separator class="my-8 bg-border" />

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">6. Contact</h2>
            <p>
              <a href="mailto:support@zenportal.com.ph"
                class="text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 decoration-blue-200">support@zenportal.com.ph</a>
            </p>
          </section>

        </Motion>
      </div>
    </div>
  </div>
</template>
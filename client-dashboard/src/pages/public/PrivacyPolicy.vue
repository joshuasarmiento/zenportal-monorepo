<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Lock, Eye, Server, ShieldCheck } from 'lucide-vue-next'

const router = useRouter()
const lastUpdated = 'January 25, 2026'
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-foreground selection:bg-indigo-500/30 pt-24 pb-20">
    
    <div class="max-w-4xl mx-auto px-6">
      <Button variant="ghost" class="mb-8 pl-0 hover:bg-transparent hover:text-indigo-600" @click="router.push('/')">
        <ArrowLeft class="mr-2 h-4 w-4" /> Back to Home
      </Button>

      <div class="space-y-4 mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p class="text-muted-foreground text-lg">
          We process data. You control it.
        </p>
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock class="h-4 w-4" />
          <span>Last updated: {{ lastUpdated }}</span>
        </div>
      </div>

      <div class="grid gap-8">
        
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <Card class="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800 p-6">
            <Eye class="h-8 w-8 text-indigo-600 mb-4" />
            <h3 class="font-bold text-lg mb-2">No Tracking</h3>
            <p class="text-sm text-muted-foreground">No tracking cookies. No ad sales. You are the customer, not the product.</p>
          </Card>
          <Card class="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800 p-6">
            <ShieldCheck class="h-8 w-8 text-indigo-600 mb-4" />
            <h3 class="font-bold text-lg mb-2">Data Processor</h3>
            <p class="text-sm text-muted-foreground">We process Client Data solely on your behalf and instructions.</p>
          </Card>
          <Card class="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800 p-6">
            <Server class="h-8 w-8 text-indigo-600 mb-4" />
            <h3 class="font-bold text-lg mb-2">Encryption</h3>
            <p class="text-sm text-muted-foreground">Data is encrypted at rest (AES-256) and in transit (TLS 1.3).</p>
          </Card>
        </div>

        <div class="space-y-12 text-foreground/90 leading-relaxed">

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">1. Your Role vs. Our Role</h2>
            <p class="text-muted-foreground">
              <strong>You are the Data Controller:</strong> You input data about your clients. You are responsible for ensuring you have the legal right to input that data.
              <br/>
              <strong>We are the Data Processor:</strong> We provide the infrastructure (ZenPortal) to store and display that data.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">2. Information We Collect</h2>
            <ul class="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Account Info:</strong> Email/Name via Clerk.</li>
              <li><strong>Billing Info:</strong> Stored securely by Stripe. We never see your card number.</li>
              <li><strong>Client Data:</strong> Names, logs, and attachments you upload.</li>
            </ul>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">3. Sub-Processors</h2>
            <p class="text-muted-foreground">
              To provide the Service for $12/mo, we rely on best-in-class infrastructure partners. You consent to data processing by:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="p-4 border rounded text-sm bg-secondary/10">
                    <strong>Turso</strong> (Database)
                </div>
                <div class="p-4 border rounded text-sm bg-secondary/10">
                    <strong>Clerk</strong> (Auth)
                </div>
                <div class="p-4 border rounded text-sm bg-secondary/10">
                    <strong>Stripe</strong> (Payments)
                </div>
                <div class="p-4 border rounded text-sm bg-secondary/10">
                    <strong>Vercel</strong> (Hosting)
                </div>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">4. Deletion & Export</h2>
            <p class="text-muted-foreground">
              If you cancel, your data is soft-deleted. If you request permanent deletion, we will wipe your data from active databases within 30 days. Backups may persist for up to 90 days for disaster recovery.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">5. Security</h2>
            <p class="text-muted-foreground">
              We maintain reasonable administrative, technical, and physical safeguards. However, no service is 100% secure. You accept that using an online service involves inherent risks.
            </p>
          </section>

          <Separator class="my-8" />

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">6. Contact</h2>
            <p class="text-muted-foreground">
              Privacy Officer: <a href="mailto:privacy@zenportal.io" class="text-indigo-600 hover:underline">privacy@zenportal.io</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>
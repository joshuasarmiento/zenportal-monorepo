<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Gavel, ShieldAlert, CreditCard, Scale, Lock } from 'lucide-vue-next'

const lastUpdated = 'January 25, 2026'
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-foreground selection:bg-indigo-500/30">
    
    <div class="max-w-4xl mx-auto px-6">

      <div class="space-y-4 mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
        <p class="text-muted-foreground text-lg">
          These terms constitute a legally binding agreement between you and ZenPortal.
        </p>
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Gavel class="h-4 w-4" />
          <span>Last updated: {{ lastUpdated }}</span>
        </div>
      </div>

      <div class="space-y-12 text-foreground/90 leading-relaxed">

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">1. Agreement to Terms</h2>
          <p class="text-muted-foreground">
            By accessing or using ZenPortal ("Service"), you agree to be bound by these Terms. If you disagree with any part of the terms, you are strictly prohibited from using the Service. 
            <strong>ZenPortal</strong> is a proprietary service operated by <strong>Joshua Sarmiento</strong> ("Provider").
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">2. Use of Service & Restrictions</h2>
          <ul class="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Sole Responsibility:</strong> You are fully responsible for all activities that occur under your account. The Provider accepts no liability for any loss or damage from your failure to maintain security.</li>
            <li><strong>Magic Links:</strong> You acknowledge that "Client Portals" are accessed via unauthenticated secure links ("Magic Links"). You bear the sole burden of ensuring these links are shared only with intended recipients.</li>
            <li><strong>Fair Use:</strong> The Provider reserves the right to terminate accounts that place an unreasonable load on the Service's infrastructure (e.g., automated scraping).</li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">3. Service Tiers</h2>
          <p class="text-muted-foreground">
            <strong>Free Tier Enforcement:</strong> The Provider strictly enforces the one (1) Active Client limit. Circumventing this limit via multiple accounts is a breach of contract and will result in immediate termination and data deletion.
          </p>
        </section>

        <section class="space-y-4 p-6 bg-secondary/20 rounded-lg border border-border/50">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <CreditCard class="h-6 w-6 text-indigo-500" />
            4. Billing & No Refunds
          </h2>
          <div class="space-y-4 text-muted-foreground">
            <p><strong>4.1 Subscription:</strong> The Service is billed in advance on a monthly basis. The fee is stated on the Pricing page (currently $12.00 USD/mo) and is subject to change with notice.</p>
            <p><strong>4.2 STRICT NO REFUND POLICY:</strong> Due to the low-cost nature of the Service, <strong>payments are non-refundable</strong>. There are no refunds for partial months, unused service, or accidental renewals. You must cancel before your renewal date.</p>
            <p><strong>4.3 Chargebacks:</strong> Initiation of a chargeback or dispute for valid services is a material breach of this Agreement. You agree to reimburse the Provider for all dispute fees plus a $50 administrative penalty.</p>
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">5. Service Availability ("As Is")</h2>
          <p class="text-muted-foreground">
            The Service is provided by a solo developer on an "AS IS" and "AS AVAILABLE" basis. We do not guarantee 100% uptime. 
            <strong>Platform Risk:</strong> In the event of a permanent shutdown, the Provider's sole obligation is to provide a method for data export (CSV/JSON) for 30 days.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">6. Intellectual Property</h2>
          <p class="text-muted-foreground">
            You retain ownership of your data. You grant the Provider a license to host and backup your data. The Provider owns all rights to the ZenPortal code, design, and brand.
          </p>
        </section>

        <section class="space-y-4 p-6 bg-destructive/10 rounded-lg border border-destructive/20">
          <h2 class="text-2xl font-bold flex items-center gap-2 text-destructive">
            <ShieldAlert class="h-6 w-6" />
            7. Limitation of Liability
          </h2>
          <p class="text-muted-foreground font-bold">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PROVIDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
          </p>
          <p class="font-medium text-foreground mt-4">
            IN NO EVENT SHALL THE PROVIDER'S AGGREGATE LIABILITY EXCEED THE TOTAL AMOUNT YOU PAID TO THE PROVIDER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. (E.g., if you paid $144, our liability is capped at $144).
          </p>
        </section>

        <section class="space-y-4 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Scale class="h-6 w-6 text-indigo-600" />
            8. Dispute Resolution
          </h2>
          <div class="space-y-4 text-muted-foreground">
            <p><strong>8.1 Binding Arbitration:</strong> Any dispute shall be resolved exclusively through binding arbitration in <strong>Camarines Sur, Philippines</strong>. You waive your right to a court trial.</p>
            <p><strong>8.2 Class Action Waiver:</strong> YOU MAY BRING CLAIMS ONLY IN YOUR INDIVIDUAL CAPACITY, NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS ACTION.</p>
            <p><strong>8.3 Fee Shifting:</strong> If you bring a claim against the Provider and fail to prevail, you agree to pay the Provider's reasonable attorneys' fees and costs.</p>
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Lock class="h-5 w-5" /> 9. Allocation of Risk
          </h2>
          <p class="text-muted-foreground">
            You acknowledge that the subscription fee ($12) is set based on the limitations of liability and disclaimers set forth herein. If you required greater liability protection, the fee would be substantially higher. You agree that these limitations are a fundamental basis of the bargain.
          </p>
        </section>

        <Separator class="my-8" />

        <section class="text-center pb-8">
          <p class="text-muted-foreground mb-4">Questions about the Terms?</p>
          <Button variant="outline" as-child>
            <a href="mailto:support@zenportal.io">Contact Support</a>
          </Button>
        </section>

      </div>
    </div>
  </div>
</template>
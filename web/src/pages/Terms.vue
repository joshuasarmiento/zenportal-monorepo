<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Gavel, ShieldAlert, CreditCard, Scale, Lock } from 'lucide-vue-next'
import { Motion } from 'motion-v'
import { useHead } from '@unhead/vue'
import BackgroundNoise from '@/components/ui/background-noise/BackgroundNoise.vue'

const lastUpdated = 'January 25, 2026'

useHead({
  title: 'Terms of Service - ZenPortal',
  meta: [
    { name: 'description', content: 'Read the Terms of Service for ZenPortal. Understand your rights, responsibilities, and our billing policies.' },
    { property: 'og:title', content: 'ZenPortal Terms of Service' },
    { property: 'og:description', content: 'Read the Terms of Service for ZenPortal.' },
  ]
})
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black pt-32 pb-20 overflow-x-hidden">

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
              class="rounded-full px-3 py-1 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500">
              Agreement
            </Badge>
          </Motion>
        </div>
        <Motion
          is="h1"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.1 }"
          class="text-5xl md:text-6xl font-semibold tracking-tighter text-zinc-900 dark:text-white"
        >
          Terms of Service
        </Motion>
        <Motion
          is="p"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
          class="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl"
        >
          These terms constitute a legally binding agreement between you and ZenPortal.
        </Motion>
        <Motion
          is="div"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.3 }"
          class="flex items-center justify-center md:justify-start gap-2 text-sm text-zinc-400 font-mono"
        >
          <Gavel class="h-4 w-4" />
          <span>Last updated: {{ lastUpdated }}</span>
        </Motion>
      </div>

      <Motion
        is="div"
        :initial="{ opacity: 0, y: 40 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.4 }"
        class="space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed"
      >

        <section class="space-y-4">
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or using ZenPortal ("Service"), you agree to be bound by these Terms. If you disagree with any
            part of the terms, you are strictly prohibited from using the Service.
            <strong class="text-zinc-900 dark:text-white">ZenPortal</strong> is a proprietary service operated by
            <strong class="text-zinc-900 dark:text-white">ZenPortal</strong> ("Provider").
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">2. Use of Service &
            Restrictions</h2>
          <ul class="list-disc pl-5 space-y-2 marker:text-zinc-300 dark:marker:text-zinc-700">
            <li><strong class="text-zinc-900 dark:text-white">Sole Responsibility:</strong> You are fully responsible
              for all activities that occur under your account. The Provider accepts no liability for any loss or damage
              from your failure to maintain security.</li>
            <li><strong class="text-zinc-900 dark:text-white">Magic Links:</strong> You acknowledge that "Client
              Portals" and "Reports" are accessed via unauthenticated secure links ("Magic Links"). You bear the sole
              burden of ensuring these links are shared only with intended recipients.</li>
            <li><strong class="text-zinc-900 dark:text-white">Public Profiles:</strong> You are responsible for the
              content displayed on your Public Profile.</li>
            <li><strong class="text-zinc-900 dark:text-white">Fair Use:</strong> The Provider reserves the right to
              terminate accounts that place an unreasonable load on the Service's infrastructure (e.g., automated
              scraping).</li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">3. Service Tiers</h2>
          <p>
            <strong class="text-zinc-900 dark:text-white">Free Tier Enforcement:</strong> The Provider strictly enforces
            the one (1) Active Client limit. Circumventing this limit via multiple accounts is a breach of contract and
            will result in immediate termination and data deletion.
          </p>
        </section>

        <section
          class="space-y-6 p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <CreditCard class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            4. Billing & No Refunds
          </h2>
          <div class="space-y-4 text-sm md:text-base">
            <p><strong class="text-zinc-900 dark:text-white">4.1 Subscription:</strong> The Service is billed in advance
              on a monthly basis. The fee is stated on the Pricing page (currently $12 USD/mo) and is subject to
              change with notice.</p>
            <div
              class="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-800 dark:text-red-300">
              <p><strong>4.2 STRICT NO REFUND POLICY:</strong> Due to the low-cost nature of the Service,
                <strong>payments are non-refundable</strong>. There are no refunds for partial months, unused service,
                or accidental renewals. You must cancel before your renewal date.
              </p>
            </div>
            <p><strong class="text-zinc-900 dark:text-white">4.3 Chargebacks:</strong> Initiation of a chargeback or
              dispute for valid services is a material breach of this Agreement. You agree to reimburse the Provider for
              all dispute fees plus a ₱1500 administrative penalty.</p>
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">5. Service Availability ("As
            Is")</h2>
          <p>
            The Service is provided by a solo developer on an "AS IS" and "AS AVAILABLE" basis. We do not guarantee 100%
            uptime.
            <strong class="text-zinc-900 dark:text-white">Platform Risk:</strong> In the event of a permanent shutdown,
            the Provider's sole obligation is to provide a method for data export (CSV/JSON) for 30 days.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">6. Intellectual Property</h2>
          <p>
            You retain ownership of your data. You grant the Provider a license to host and backup your data. The
            Provider owns all rights to the ZenPortal code, design, and brand.
          </p>
        </section>

        <section
          class="space-y-6 p-8 bg-red-50/50 dark:bg-red-900/5 rounded-xl border border-red-100 dark:border-red-900/20">
          <h2 class="text-2xl font-semibold tracking-tight text-red-700 dark:text-red-400 flex items-center gap-3">
            <ShieldAlert class="h-6 w-6" />
            7. Limitation of Liability
          </h2>
          <p class="font-bold text-red-900 dark:text-red-200 text-sm md:text-base leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PROVIDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
          </p>
          <p class="font-medium text-red-800 dark:text-red-300 text-sm md:text-base">
            IN NO EVENT SHALL THE PROVIDER'S AGGREGATE LIABILITY EXCEED THE TOTAL AMOUNT YOU PAID TO THE PROVIDER IN THE
            TWELVE (12) MONTHS PRECEDING THE CLAIM. (E.g., if you paid ₱8388, our liability is capped at ₱8388).
          </p>
        </section>

        <section
          class="space-y-6 p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <Scale class="h-6 w-6 text-zinc-900 dark:text-white" />
            8. Dispute Resolution
          </h2>
          <div class="space-y-4 text-sm md:text-base">
            <p><strong class="text-zinc-900 dark:text-white">8.1 Binding Arbitration:</strong> Any dispute shall be
              resolved exclusively through binding arbitration in <strong
                class="text-zinc-900 dark:text-white">Camarines Sur, Philippines</strong>. You waive your right to a
              court trial.</p>
            <p><strong class="text-zinc-900 dark:text-white">8.2 Class Action Waiver:</strong> YOU MAY BRING CLAIMS ONLY
              IN YOUR INDIVIDUAL CAPACITY, NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS ACTION.</p>
            <p><strong class="text-zinc-900 dark:text-white">8.3 Fee Shifting:</strong> If you bring a claim against the
              Provider and fail to prevail, you agree to pay the Provider's reasonable attorneys' fees and costs.</p>
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Lock class="h-5 w-5" /> 9. Allocation of Risk
          </h2>
          <p>
            You acknowledge that the subscription fee is set based on the limitations of liability and disclaimers set
            forth herein. If you required greater liability protection, the fee would be substantially higher. You agree
            that these limitations are a fundamental basis of the bargain.
          </p>
        </section>

        <Separator class="my-12 bg-zinc-200 dark:bg-zinc-800" />

        <section class="text-center pb-8">
          <p class="text-zinc-500 mb-6">Questions about the Terms?</p>
          <Button variant="outline"
            class="rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-8"
            as-child>
            <a href="mailto:support@zenportal.com.ph">Contact Support</a>
          </Button>
        </section>

      </Motion>
    </div>
  </div>
</template>
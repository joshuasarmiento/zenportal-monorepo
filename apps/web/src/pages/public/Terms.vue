<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Gavel, AlertTriangle } from 'lucide-vue-next'

const router = useRouter()
const lastUpdated = 'January 24, 2026'
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-foreground selection:bg-blue-500/30 pt-24 pb-20">
    
    <div class="max-w-4xl mx-auto px-6">
      <Button variant="ghost" class="mb-8 pl-0 hover:bg-transparent hover:text-blue-600" @click="router.push('/')">
        <ArrowLeft class="mr-2 h-4 w-4" /> Back to Home
      </Button>

      <div class="space-y-4 mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">Terms and Conditions</h1>
        <p class="text-muted-foreground text-lg">
          Please read these terms carefully before using ZenPortal.
        </p>
      </div>

      <div class="space-y-12 text-foreground/90 leading-relaxed">

        <section class="space-y-4">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            1. Acceptance of Terms
          </h2>
          <p class="text-muted-foreground">
            By accessing and using ZenPortal (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">2. Service Description</h2>
          <p class="text-muted-foreground">
            ZenPortal provides a platform for freelancers and agencies to log work, track earnings, and present "Proof of Work" reports to clients via web dashboards. The Service allows users to embed content from third-party providers such as Google Drive and Loom.
          </p>
          <div class="bg-muted/50 p-4 rounded-lg border border-border text-sm text-muted-foreground">
            <strong>Note:</strong> We are not a bank, wallet, or payment processor. We track <em>estimated</em> earnings based on data you input. Actual payments are handled outside of our platform by your clients.
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">3. Accounts and Security</h2>
          <p class="text-muted-foreground">
            You must register an account using Clerk authentication to access the Service. You are responsible for maintaining the security of your account. You are fully responsible for all activities that occur under the account and any other actions taken in connection with the account.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">4. Subscriptions and Payment</h2>
          <ul class="list-disc pl-6 space-y-3 text-muted-foreground">
            <li><strong>Free Tier:</strong> We offer a "Starter" plan at no cost, which includes limited active clients and history.</li>
            <li><strong>Pro Tier:</strong> The "Agency Pro" plan is a paid subscription ($12/month) that unlocks unlimited clients, custom branding, and full history.</li>
            <li><strong>Billing:</strong> Payments are processed via Stripe. Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period.</li>
            <li><strong>Refunds:</strong> Refunds are handled on a case-by-case basis. Generally, we do not offer refunds for partial months of service.</li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">5. Fair Use Policy</h2>
          <p class="text-muted-foreground">
            While the "Agency Pro" plan offers "Unlimited Clients," this is subject to fair use. Accounts found to be using the Service for non-human automated logging, reselling the service as a white-label platform without permission, or generating excessive server load may be terminated or throttled.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">6. User Content</h2>
          <p class="text-muted-foreground">
            You retain full ownership of the data, text, and links you upload to ZenPortal. However, by posting content, you grant us a license to display, modify, and distribute this content solely for the purpose of providing the Service (e.g., displaying your report to your client via a Magic Link).
          </p>
          <p class="text-muted-foreground">
            You agree not to use the Service to upload illegal, offensive, or harmful content.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">7. Disclaimer of Warranties</h2>
          <p class="text-muted-foreground">
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. ZenPortal makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content, or materials included therein.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">8. Limitation of Liability</h2>
          <p class="text-muted-foreground">
            ZenPortal shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from the use of or inability to use the service.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">9. Governing Law</h2>
          <p class="text-muted-foreground">
            These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
          <p class="text-muted-foreground text-sm mt-2">
            Disputes arising from these terms shall be resolved in the appropriate courts of Camarines Sur, Philippines.
          </p>
        </section>

        <Separator class="my-8" />

        <section class="text-center pb-8">
          <p class="text-muted-foreground mb-4">Questions about the Terms of Service?</p>
          <Button variant="outline" as-child>
            <a href="mailto:support@zenportal.io">Contact Support</a>
          </Button>
        </section>

      </div>
    </div>
  </div>
</template>
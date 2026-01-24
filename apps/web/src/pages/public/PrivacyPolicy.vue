<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Shield, Lock, EyeOff } from 'lucide-vue-next'

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
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p class="text-muted-foreground text-lg">
          Last updated: {{ lastUpdated }}
        </p>
      </div>

      <div class="grid gap-8">
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <Card class="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900">
            <CardContent class="pt-6">
              <EyeOff class="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 class="font-bold mb-2">No Spyware</h3>
              <p class="text-sm text-muted-foreground">We do not take screenshots, log keystrokes, or track your webcam.</p>
            </CardContent>
          </Card>
          <Card class="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900">
            <CardContent class="pt-6">
              <Lock class="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
              <h3 class="font-bold mb-2">Secure Auth</h3>
              <p class="text-sm text-muted-foreground">Authentication is handled by Clerk. We never see or store your passwords.</p>
            </CardContent>
          </Card>
          <Card class="bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900">
            <CardContent class="pt-6">
              <Shield class="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
              <h3 class="font-bold mb-2">Client Privacy</h3>
              <p class="text-sm text-muted-foreground">Magic Links are secure. Only those with the link can view the dashboard.</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div class="space-y-12 text-foreground/90 leading-relaxed">
          
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">1. Introduction</h2>
            <p class="text-muted-foreground">
              Welcome to ZenPortal ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (zenportal.io) and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">2. Information We Collect</h2>
            <ul class="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Identity Data:</strong> Includes first name, last name, username, or similar identifier provided via Clerk authentication.</li>
              <li><strong>Contact Data:</strong> Includes email address.</li>
              <li><strong>Transaction Data:</strong> Includes details about payments to and from you and other details of products you have purchased from us. We use Stripe for payment processing; we do not store your credit card information on our servers.</li>
              <li><strong>Usage Data:</strong> Includes information about how you use our website, such as work logs, client profiles created, and feature usage.</li>
              <li><strong>Content Data:</strong> We store the text summaries, links to external evidence (Google Drive, Loom), and client configurations you input into the system.</li>
            </ul>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">3. How We Use Your Data</h2>
            <p class="text-muted-foreground">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul class="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide the Service, specifically allowing you to create Client Portals and log work.</li>
              <li>To process your subscription payments via Stripe.</li>
              <li>To send you notifications, such as weekly recaps or alerts when a client views your report.</li>
              <li>To improve our website, products/services, marketing, and customer relationships.</li>
            </ul>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">4. Client Portals & Magic Links</h2>
            <p class="text-muted-foreground">
              ZenPortal allows you to generate public "Magic Links" for your clients. Any person who possesses this URL will be able to view the specific work logs and profile information associated with that link. It is your responsibility to share these links securely. We are not responsible for data exposure resulting from users sharing Magic Links publicly.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">5. Third-Party Services</h2>
            <p class="text-muted-foreground">
              We may employ third-party companies and individuals to facilitate our Service. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
            <ul class="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Clerk:</strong> For authentication and user management.</li>
              <li><strong>Stripe:</strong> For payment processing.</li>
              <li><strong>Vercel:</strong> For hosting and serverless infrastructure.</li>
              <li><strong>Turso/SQLite:</strong> For database storage.</li>
            </ul>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">6. Data Retention</h2>
            <p class="text-muted-foreground">
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
            <p class="text-muted-foreground">
              For users on the "Starter" (Free) plan, we may limit the history of visible work logs to 30 days, though the data may remain in our backups for a longer period.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">7. Your Legal Rights</h2>
            <p class="text-muted-foreground">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data, and (where the lawful ground of processing is consent) to withdraw consent.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-bold">8. Contact Us</h2>
            <p class="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us via email at: <a href="mailto:support@zenportal.io" class="text-blue-600 hover:underline">support@zenportal.io</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>
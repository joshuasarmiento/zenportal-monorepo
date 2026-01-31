<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Eye, Server, ShieldCheck, FileLock } from 'lucide-vue-next'

const lastUpdated = 'January 25, 2026'
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black pt-32 pb-20 overflow-x-hidden">
    
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>

    <div class="max-w-4xl mx-auto px-6 relative z-10">
      
      <div class="space-y-6 mb-16 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-2">
           <Badge variant="outline" class="rounded-full px-3 py-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
             Legal
           </Badge>
        </div>
        <h1 class="text-5xl md:text-6xl font-semibold tracking-tighter text-zinc-900 dark:text-white">Privacy Policy</h1>
        <p class="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl">
          We process data. You control it. Simple as that.
        </p>
        <div class="flex items-center justify-center md:justify-start gap-2 text-sm text-zinc-400 font-mono">
          <FileLock class="h-4 w-4" />
          <span>Last updated: {{ lastUpdated }}</span>
        </div>
      </div>

      <div class="grid gap-12">
        
        <div class="grid md:grid-cols-3 gap-6">
          <Card class="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div class="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
               <Eye class="h-5 w-5 text-zinc-900 dark:text-white" />
            </div>
            <h3 class="font-bold text-lg mb-2 tracking-tight">No Tracking</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">No tracking cookies. No ad sales. You are the customer, not the product.</p>
          </Card>
          <Card class="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div class="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
               <ShieldCheck class="h-5 w-5 text-zinc-900 dark:text-white" />
            </div>
            <h3 class="font-bold text-lg mb-2 tracking-tight">Data Processor</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">We process Client Data solely on your behalf and instructions.</p>
          </Card>
          <Card class="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div class="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
               <Server class="h-5 w-5 text-zinc-900 dark:text-white" />
            </div>
            <h3 class="font-bold text-lg mb-2 tracking-tight">Encryption</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Data is encrypted at rest and in transit (TLS 1.3).</p>
          </Card>
        </div>

        <div class="space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">1. Your Role vs. Our Role</h2>
            <p>
              <strong class="text-zinc-900 dark:text-white">You are the Data Controller:</strong> You input data about your clients. You are responsible for ensuring you have the legal right to input that data.
              <br/>
              <strong class="text-zinc-900 dark:text-white">We are the Data Processor:</strong> We provide the infrastructure (ZenPortal) to store and display that data.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">2. Information We Collect</h2>
            <ul class="list-disc pl-5 space-y-2 marker:text-zinc-300 dark:marker:text-zinc-700">
              <li><strong class="text-zinc-900 dark:text-white">Account Info:</strong> Email/Name via Clerk.</li>
              <li><strong class="text-zinc-900 dark:text-white">Professional Profile:</strong> Bio, Headlines, and Social Links you choose to display publicly.</li>
              <li><strong class="text-zinc-900 dark:text-white">Billing Info:</strong> Stored securely by PayMongo. We never see your card number.</li>
              <li><strong class="text-zinc-900 dark:text-white">Client Data:</strong> Names, work logs (including videos/attachments), and client contacts.</li>
            </ul>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">3. Sub-Processors</h2>
            <p>
              To provide the Service for $12/mo, we rely on best-in-class infrastructure partners. You consent to data processing by:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900">
                    <strong class="text-zinc-900 dark:text-white">Turso</strong> (Database)
                </div>
                <div class="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900">
                    <strong class="text-zinc-900 dark:text-white">Clerk</strong> (Auth)
                </div>
                <div class="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900">
                    <strong class="text-zinc-900 dark:text-white">PayMongo</strong> (Payments)
                </div>
                <div class="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900">
                    <strong class="text-zinc-900 dark:text-white">Vercel</strong> (Hosting)
                </div>
                <div class="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900">
                    <strong class="text-zinc-900 dark:text-white">Resend</strong> (Emails)
                </div>
                <div class="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900">
                    <strong class="text-zinc-900 dark:text-white">Cloudflare</strong> (Security/CDN)
                </div>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">4. Deletion & Export</h2>
            <p>
              If you cancel, your data is soft-deleted. If you request permanent deletion, we will wipe your data from active databases within 30 days. Backups may persist for up to 90 days for disaster recovery.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">5. Security</h2>
            <p>
              We maintain reasonable administrative, technical, and physical safeguards. However, no service is 100% secure. You accept that using an online service involves inherent risks.
            </p>
          </section>

          <Separator class="my-8 bg-zinc-200 dark:bg-zinc-800" />

          <section class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">6. Contact</h2>
            <p>
              <a href="mailto:support@zenportal.com.ph" class="text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 decoration-blue-200">support@zenportal.com.ph</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>
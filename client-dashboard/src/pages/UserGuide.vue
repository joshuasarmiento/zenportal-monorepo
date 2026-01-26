<script setup lang="ts">
// import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {
  Zap,
  Settings,
  AlertTriangle,
  DollarSign,
  Video,
  KeyRound
} from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/dashboard">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>User Guide</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        <div class="max-w-4xl mx-auto w-full space-y-12 pb-20">
      
          <section class="text-center space-y-4 pt-4">
            <h1 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">How to use ZenPortal</h1>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              The complete guide to managing clients, logging "Proof of Work," and getting paid faster.
            </p>
          </section>

          <Tabs defaultValue="getting-started" class="w-full">
            <TabsList class="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted rounded-xl border border-border">
              <TabsTrigger value="getting-started" class="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="clients" class="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                Clients & Access
              </TabsTrigger>
              <TabsTrigger value="logging" class="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                Logging Work
              </TabsTrigger>
              <TabsTrigger value="earnings" class="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                Earnings & Goals
              </TabsTrigger>
               <TabsTrigger value="automation" class="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                API & Automation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started" class="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div class="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle class="flex items-center gap-2"><Zap class="h-5 w-5 text-yellow-500"/> The Philosophy</CardTitle>
                  </CardHeader>
                  <CardContent class="text-muted-foreground leading-relaxed">
                    ZenPortal is designed to replace "End of Day" emails. Instead of sending a messy WhatsApp message, you log your work here. Your clients get a professional, live dashboard where they can see exactly what you worked on.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle class="flex items-center gap-2"><Settings class="h-5 w-5 text-slate-500"/> Setup Your Brand</CardTitle>
                  </CardHeader>
                  <CardContent class="text-muted-foreground leading-relaxed">
                    Go to <strong>Settings</strong> to customize your portal.
                    <ul class="list-disc list-inside mt-2 space-y-1">
                      <li><strong>Accent Color:</strong> Choose a color that matches your brand.</li>
                      <li><strong>Notifications:</strong> Decide if you want emails when clients view your report.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clients" class="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div class="space-y-4">
                <h2 class="text-2xl font-bold text-foreground">Managing Clients</h2>
                <p class="text-muted-foreground">ZenPortal uses a <strong>Passwordless</strong> system for clients. We call it the "Magic Link".</p>
              </div>

              <Accordion type="single" collapsible class="w-full bg-background rounded-xl border border-border px-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I add a client?</AccordionTrigger>
                  <AccordionContent class="text-muted-foreground">
                    Go to the <strong>Clients</strong> tab and click "Add Client". You only need their Company Name and an Hourly Rate (for your internal tracking). The contact email is optional but recommended for sending notifications.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What is the "Magic Link"?</AccordionTrigger>
                  <AccordionContent class="text-muted-foreground">
                    <p class="mb-2">Every client you create gets a unique, secret URL (e.g., <code>zenportal.io/c/abc-123</code>). </p>
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900 mb-2">
                      <strong>Tip:</strong> You send this link to your client <em>once</em>. They can bookmark it to see your work anytime. They do not need to create an account or remember a password.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I archive a client?</AccordionTrigger>
                  <AccordionContent class="text-muted-foreground">
                    Yes. If a contract ends, edit the client and set their status to <strong>Archived</strong>. This hides them from your main list but keeps your earnings history intact.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="logging" class="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div class="grid md:grid-cols-3 gap-8">
                <div class="md:col-span-2 space-y-6">
                  <h2 class="text-2xl font-bold text-foreground">The "Proof of Work" Methodology</h2>
                  <p class="text-muted-foreground">
                    Clients trust what they can see. ZenPortal encourages you to attach evidence to every log.
                  </p>

                  <div class="space-y-4">
                    <div class="flex gap-4">
                      <div class="h-10 w-10 shrink-0 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Zap class="h-5 w-5" />
                      </div>
                      <div>
                        <h3 class="font-bold text-foreground">1. The Summary</h3>
                        <p class="text-sm text-muted-foreground">Write bullet points. Be specific. Instead of "Worked on site", write "Fixed navbar responsiveness on mobile".</p>
                      </div>
                    </div>

                    <div class="flex gap-4">
                       <div class="h-10 w-10 shrink-0 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400">
                        <Video class="h-5 w-5" />
                      </div>
                      <div>
                        <h3 class="font-bold text-foreground">2. Video Updates (Loom or Drive)</h3>
                        <p class="text-sm text-muted-foreground mb-2">
                          Record a quick screen share. We support <strong>Loom</strong>, but for free unlimited recording, we recommend <strong>Screenity</strong>.
                        </p>
                        <div class="text-xs bg-muted p-3 rounded-md border border-border">
                          <strong>Pro Tip (Save Money):</strong> Use <a href="https://screenity.io" target="_blank" class="underline text-blue-500">Screenity</a> to record directly to Google Drive. Paste the Drive link in ZenPortal, and we will embed it just like a Loom video. No 5-minute limits!
                        </div>
                      </div>
                    </div>

                     <div class="flex gap-4">
                       <div class="h-10 w-10 shrink-0 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                        <AlertTriangle class="h-5 w-5" />
                      </div>
                      <div>
                        <h3 class="font-bold text-foreground">3. Handling Blockers</h3>
                        <p class="text-sm text-muted-foreground">
                          Stuck waiting for a password? Toggle <strong>"I am Blocked"</strong> when logging work. 
                          This puts a big <Badge variant="destructive">Blocked</Badge> badge on the report, forcing the client to pay attention.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-background rounded-xl p-6 border border-border shadow-sm">
                  <h3 class="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-4">Example Log</h3>
                  <Card class="bg-muted/50">
                    <CardHeader class="pb-3">
                      <div class="flex justify-between">
                        <Badge variant="secondary" class="bg-background">Alpha Corp</Badge>
                        <span class="text-xs text-muted-foreground">2 hrs</span>
                      </div>
                    </CardHeader>
                    <CardContent class="text-sm space-y-3">
                      <p>Fixed homepage layout bugs.</p>
                      <div class="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900 text-xs flex items-center gap-2">
                        <Video class="h-3 w-3" /> Watch Video (Drive)
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="earnings" class="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div class="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 class="text-2xl font-bold mb-4 text-foreground">Tracking Your Revenue</h2>
                  <div class="prose dark:prose-invert text-muted-foreground">
                    <p>
                      ZenPortal tracks your <strong>estimated earnings</strong> based on the hourly rate you assigned to each client.
                    </p>
                    <ul class="mt-4 space-y-2">
                      <li><strong>Monthly Goal:</strong> We set a default goal of $2,000/mo. The progress bar shows how close you are.</li>
                      <li><strong>Pending Payments:</strong> This metric is calculated based on hours logged that haven't been marked as "Paid".</li>
                    </ul>
                  </div>
                </div>
                
                <Card class="bg-slate-900 text-white border-slate-800 dark:bg-slate-950">
                  <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                      <DollarSign class="h-5 w-5 text-green-400" />
                      Weekly Recap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p class="text-slate-300 mb-4">
                      Every Sunday, ZenPortal sends you an email summary of your total hours and earnings for the week.
                    </p>
                    <Button variant="secondary" size="sm" class="w-full" @click="router.push('/settings')">
                      Check Email Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="automation" class="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div class="space-y-4">
                <h2 class="text-2xl font-bold text-foreground flex items-center gap-3"><KeyRound class="h-6 w-6 text-blue-500" /> API & Automation</h2>
                <p class="text-muted-foreground">For <Badge variant="secondary" class="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">Pro</Badge> users who want to automate their workflow, ZenPortal provides a programmatic API.</p>
              </div>

              <Accordion type="single" collapsible class="w-full bg-background rounded-xl border border-border px-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is an API and why would I use it?</AccordionTrigger>
                  <AccordionContent class="text-muted-foreground">
                    <p>Think of an API as a messenger that lets different software applications talk to each other. You can use it to automate repetitive tasks.</p>
                    <p class="mt-2">For example, you could write a script to automatically create a work log in ZenPortal every time you finish a task in a different app like Trello or a desktop time tracker.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I get my API Keys?</AccordionTrigger>
                  <AccordionContent class="text-muted-foreground">
                    <p class="mb-2">
                      Go to <a href="/settings" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">Settings -> API Access</a>.
                      You can generate two types of keys: a <code class="bg-muted px-1 py-0.5 rounded">Read-Only</code> key for fetching data, and a <code class="bg-muted px-1 py-0.5 rounded">Write-Access</code> key for creating data.
                    </p>
                    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900 mb-2">
                      <strong class="text-red-700 dark:text-red-400">Important:</strong> Treat your API keys like passwords. Never share them publicly or commit them to GitHub.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Where can I find the technical details?</AccordionTrigger>
                  <AccordionContent class="text-muted-foreground">
                    For developers, we have complete technical documentation with code examples for `curl`, JavaScript, and Python.
                    <br />
                    <Button variant="outline" size="sm" class="mt-4" @click="router.push('/docs')">
                       View API Documentation
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

          </Tabs>

          <Separator />

          <section class="text-center py-8">
            <h3 class="text-xl font-bold mb-2 text-foreground">Still have questions?</h3>
            <p class="text-muted-foreground mb-6">Priority support is available for Pro users.</p>
            <Button size="lg" as-child>
               <a href="mailto:support@zenportal.io">Contact Support</a>
            </Button>
          </section>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
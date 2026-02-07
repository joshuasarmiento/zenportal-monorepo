<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Terminal } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
    <div class="space-y-8">
        <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-900">
                <Terminal class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h2 class="text-2xl font-bold tracking-tight text-foreground">API & Automation</h2>
                <p class="text-muted-foreground text-sm">Automate your workflow programmatically.</p>
            </div>
        </div>

        <div class="bg-muted/50 border border-border rounded-xl p-6">
            <div class="flex items-center gap-2 mb-4">
                <Badge variant="secondary" class="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-3">Pro Feature</Badge>
            </div>
            <p class="text-muted-foreground leading-relaxed mb-0">
                ZenPortal provides a REST API for <strong class="text-foreground">Agency Pro</strong> users. You can use it to automatically create logs from GitHub commits, sync clients from your CRM, or export data to Google Sheets.
            </p>
        </div>

        <Accordion type="single" collapsible class="w-full space-y-4">
            <AccordionItem value="item-1" class="border border-border rounded-xl px-4 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger class="hover:no-underline font-medium text-foreground">What can I do with the API?</AccordionTrigger>
                <AccordionContent class="text-muted-foreground leading-relaxed pt-2 pb-4">
                    <ul class="list-disc list-inside space-y-2 marker:text-muted-foreground/60">
                        <li><strong>Auto-Log Work:</strong> Script your machine to POST a log entry every time you close a Jira ticket.</li>
                        <li><strong>Sync Earnings:</strong> Fetch your `earnings` endpoint to display on your personal Notion dashboard.</li>
                        <li><strong>Backup Data:</strong> Periodically fetch all logs and save them to your own database.</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" class="border border-border rounded-xl px-4 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger class="hover:no-underline font-medium text-foreground">How do I get my API Keys?</AccordionTrigger>
                <AccordionContent class="text-muted-foreground leading-relaxed pt-2 pb-4">
                    <p class="mb-4">
                        Go to <span class="font-bold text-foreground cursor-pointer hover:underline" @click="router.push('/settings/api')">Settings -> API Access</span>.
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div class="p-3 bg-card border border-border rounded-lg">
                            <div class="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">Read-Only Key</div>
                            <p class="text-xs text-muted-foreground">Safe for fetching data. GET requests only.</p>
                        </div>
                        <div class="p-3 bg-card border border-border rounded-lg">
                            <div class="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">Write-Access Key</div>
                            <p class="text-xs text-muted-foreground">Allows modification. POST/PUT/DELETE.</p>
                        </div>
                    </div>
                    <div class="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30 text-sm text-red-800 dark:text-red-300">
                        <strong>Security Warning:</strong> Treat your API keys like passwords. Never share them publicly or commit them to GitHub.
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" class="border border-border rounded-xl px-4 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger class="hover:no-underline font-medium text-foreground">Developer Documentation</AccordionTrigger>
                <AccordionContent class="text-muted-foreground leading-relaxed pt-2 pb-4">
                    <p class="mb-4">
                        We have a complete Postman collection and OpenAPI spec available.
                    </p>
                    <div class="bg-zinc-950 rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-x-auto border border-zinc-800">
                        <span class="text-purple-400">curl</span> -X GET https://api.zenportal.com.ph/v1/me \<br/>
                        &nbsp;&nbsp;-H <span class="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span>
                    </div>
                    <Button variant="outline" size="sm" class="mt-4 gap-2 rounded-full" @click="router.push('/docs')">
                        <BookOpen class="h-4 w-4" /> View Full Docs
                    </Button>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>
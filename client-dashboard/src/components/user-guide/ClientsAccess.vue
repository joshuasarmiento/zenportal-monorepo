<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Users, Link } from 'lucide-vue-next'
</script>

<template>
    <div class="space-y-8">
        <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                <Users class="h-6 w-6 text-foreground" />
            </div>
            <div>
                <h2 class="text-2xl font-bold tracking-tight text-foreground">Managing Clients</h2>
                <p class="text-muted-foreground text-sm">How to set up access without forcing clients to sign up.</p>
            </div>
        </div>

        <Accordion type="single" collapsible class="w-full space-y-4">
            <AccordionItem value="item-1" class="border border-border rounded-xl px-4 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger class="hover:no-underline font-medium text-foreground">How do I add a client?</AccordionTrigger>
                <AccordionContent class="text-muted-foreground leading-relaxed pt-2 pb-4">
                    Go to the <strong>Clients</strong> tab and click "Add Client". You only need their Company Name and an Hourly Rate (for your internal tracking). The contact email is optional but recommended for sending notifications.
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" class="border border-border rounded-xl px-4 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger class="hover:no-underline font-medium text-foreground">What is the "Magic Link"?</AccordionTrigger>
                <AccordionContent class="text-muted-foreground leading-relaxed pt-2 pb-4">
                    <p class="mb-4">
                        ZenPortal is <strong>Passwordless</strong> for clients. Every client profile generates a unique, secret URL (e.g., <code class="bg-muted px-1.5 py-0.5 rounded text-foreground text-xs">app.zenportal.com.ph/c/abc-123</code>).
                    </p>
                    <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-3 items-start">
                        <Link class="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div class="text-sm text-blue-900 dark:text-blue-200">
                            <strong>Pro Tip:</strong> You send this link to your client <em>once</em>. They bookmark it to see your work anytime. No logins, no forgotten passwords.
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" class="border border-border rounded-xl px-4 data-[state=open]:bg-muted/30 transition-colors">
                <AccordionTrigger class="hover:no-underline font-medium text-foreground">Can I archive a client?</AccordionTrigger>
                <AccordionContent class="text-muted-foreground leading-relaxed pt-2 pb-4">
                    Yes. If a contract ends, edit the client and set their status to <strong>Archived</strong>. This hides them from your main list but keeps your earnings history intact for reporting.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>
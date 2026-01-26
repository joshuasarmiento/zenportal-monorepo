<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
</script>
<template>
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
</template>
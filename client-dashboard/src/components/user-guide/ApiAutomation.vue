<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  KeyRound
} from 'lucide-vue-next'

const router = useRouter()
</script>
<template>
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
</template>
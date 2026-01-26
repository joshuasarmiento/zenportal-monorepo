<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  AlertTriangle,
  Video,
} from 'lucide-vue-next'
</script>
<template>
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
</template>
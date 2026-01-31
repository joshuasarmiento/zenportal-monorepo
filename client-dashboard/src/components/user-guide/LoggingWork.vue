<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Video, FileText, CheckCircle2 } from 'lucide-vue-next'
</script>

<template>
    <div class="space-y-8">
        <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
                <FileText class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Logging Work</h2>
                <p class="text-zinc-500 dark:text-zinc-400 text-sm">How to create logs that build trust.</p>
            </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-12">
            <div class="lg:col-span-2 space-y-10">
                <div class="prose prose-zinc dark:prose-invert">
                    <p class="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Clients trust what they can see. ZenPortal is built around the concept of <strong>Proof of Work</strong>. Instead of just saying "I worked 2 hours," you show <em>what</em> you did.
                    </p>
                </div>

                <div class="space-y-6">
                    <div class="flex gap-5">
                        <div class="h-8 w-8 shrink-0 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">1</div>
                        <div>
                            <h3 class="font-bold text-zinc-900 dark:text-white text-lg">The Summary</h3>
                            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">Write bullet points. Be specific. Instead of "Worked on site", write "Fixed navbar responsiveness on mobile".</p>
                        </div>
                    </div>

                    <div class="flex gap-5">
                        <div class="h-8 w-8 shrink-0 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">2</div>
                        <div>
                            <h3 class="font-bold text-zinc-900 dark:text-white text-lg">Evidence (The "Proof")</h3>
                            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                                Attach a Loom video or a Google Drive link. This is the "killer feature" that stops clients from asking for screenshots.
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-5">
                        <div class="h-8 w-8 shrink-0 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">3</div>
                        <div>
                            <h3 class="font-bold text-zinc-900 dark:text-white text-lg">Handling Blockers</h3>
                            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                                Stuck waiting for a password? Toggle <strong>"I am Blocked"</strong> when logging work. 
                                This puts a big <span class="text-red-600 font-bold text-xs bg-red-50 px-1 py-0.5 rounded">BLOCKED</span> badge on the report, forcing the client to pay attention.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-1">
                <div class="sticky top-24">
                    <h3 class="font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4">Example Log Entry</h3>
                    
                    <Card class="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
                        <CardHeader class="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <div class="flex justify-between items-center">
                                <Badge variant="secondary" class="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 font-bold">Alpha Corp</Badge>
                                <span class="text-xs font-medium text-zinc-400 flex items-center gap-1">
                                    <CheckCircle2 class="h-3 w-3 text-green-500" /> Completed
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent class="p-5 space-y-4">
                            <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                - Implemented new Hero Section<br/>
                                - Fixed mobile menu bug
                            </p>
                            <div class="bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/30 text-xs font-bold flex items-center gap-2 w-fit">
                                <Video class="h-3 w-3" /> Watch Video Walkthrough
                            </div>
                            <div class="text-xs text-zinc-400 font-medium pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
                                <span>Logged 2.5 hrs</span>
                                <span>Today</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>
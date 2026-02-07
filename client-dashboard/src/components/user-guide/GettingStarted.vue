<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Settings, Rocket } from 'lucide-vue-next'
</script>

<template>
    <div class="space-y-8">
        <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-orange-100 dark:border-orange-900">
                <Rocket class="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
                <h2 class="text-2xl font-bold tracking-tight text-foreground">Quick Start</h2>
                <p class="text-muted-foreground text-sm">Get up and running in less than 2 minutes.</p>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
            <Card class="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                    <div class="h-10 w-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mb-2">
                        <Zap class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <CardTitle class="text-lg font-bold text-foreground tracking-tight">The Philosophy</CardTitle>
                </CardHeader>
                <CardContent class="text-muted-foreground leading-relaxed text-sm">
                    ZenPortal is designed to replace "End of Day" emails. Instead of sending a messy WhatsApp message, you log your work here. Your clients get a professional, live dashboard where they can see exactly what you worked on.
                </CardContent>
            </Card>

            <Card class="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                    <div class="h-10 w-10 bg-muted rounded-lg flex items-center justify-center mb-2">
                        <Settings class="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle class="text-lg font-bold text-foreground tracking-tight">Setup Your Brand</CardTitle>
                </CardHeader>
                <CardContent class="text-muted-foreground leading-relaxed text-sm">
                    Go to <strong>Settings</strong> to customize your portal.
                    <ul class="list-disc list-inside mt-3 space-y-2 marker:text-muted-foreground/60">
                        <li><strong>Accent Color:</strong> Choose a color that matches your brand identity.</li>
                        <li><strong>Notifications:</strong> Decide if you want emails when clients view your report.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
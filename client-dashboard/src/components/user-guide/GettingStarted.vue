<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Zap,
  Settings,
} from 'lucide-vue-next'
</script>
<template>
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
</template>
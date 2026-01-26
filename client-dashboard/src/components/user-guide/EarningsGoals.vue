<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
} from 'lucide-vue-next'

const router = useRouter()
</script>
<template>
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
            <Button variant="secondary" size="sm" class="w-full" @click="router.push('/settings/notifications')">
                Check Email Settings
            </Button>
            </CardContent>
        </Card>
    </div>
</template>
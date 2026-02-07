<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Mail } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
    <div class="space-y-8">
        <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center border border-green-100 dark:border-green-900">
                <TrendingUp class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
                <h2 class="text-2xl font-bold tracking-tight text-foreground">Tracking Your Revenue</h2>
                <p class="text-muted-foreground text-sm">Understand your financial health.</p>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8 items-start">
            <div class="text-muted-foreground leading-relaxed space-y-4">
                <p>
                    ZenPortal tracks your <strong>estimated earnings</strong> based on the hourly rate you assigned to each client profile.
                </p>
                <ul class="space-y-4 mt-4">
                    <li class="flex gap-3">
                        <div class="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 text-foreground font-bold text-xs">1</div>
                        <div>
                            <strong class="text-foreground">Monthly Goal:</strong> We set a default goal of $2,000/mo. The progress bar on the Dashboard shows how close you are to this target.
                        </div>
                    </li>
                    <li class="flex gap-3">
                        <div class="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 text-foreground font-bold text-xs">2</div>
                        <div>
                            <strong class="text-foreground">Pending Revenue:</strong> This metric is calculated based on hours logged that haven't been invoiced or paid yet.
                        </div>
                    </li>
                </ul>
            </div>
            
            <Card class="bg-foreground text-background border-none shadow-xl overflow-hidden relative">
                <div class="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-[50px] rounded-full"></div>

                <CardHeader>
                    <CardTitle class="flex items-center gap-2 text-lg font-bold tracking-tight">
                        <Mail class="h-5 w-5" />
                        Weekly Recap
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p class="text-background/80 mb-6 text-sm leading-relaxed">
                        Every Sunday, ZenPortal sends you an automated email summary of your total hours, top clients, and earnings for the week.
                    </p>
                    <Button variant="secondary" size="sm" class="w-full rounded-full font-bold bg-background text-foreground hover:bg-background/90 border-0" @click="router.push('/settings/notifications')">
                        Check Email Settings
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
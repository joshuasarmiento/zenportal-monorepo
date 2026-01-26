<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import LoomPlayer from '../components/video/VideoPlayer.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertOctagon, Clock, FileText, ExternalLink, Pencil } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const { fetchApi } = useApi()
const log = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
    try { log.value = await fetchApi(`/logs/${route.params.id}`) } catch (err) { alert('Log not found'); router.push('/') } finally { loading.value = false }
})
</script>

<template>
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header
                class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
                <div class="flex items-center gap-2">
                    <SidebarTrigger class="-ml-1" />
                    <Separator orientation="vertical" class="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                        <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator class="hidden md:block" />
                        <BreadcrumbItem><BreadcrumbPage>Log Detail</BreadcrumbPage></BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div class="ml-auto" v-if="log">
                    <Button variant="outline" size="sm" @click="router.push(`/log/${log.id}/edit`)" class="gap-2">
                        <Pencil class="h-4 w-4" /> Edit Log
                    </Button>
                </div>
            </header>

            <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
                <div v-if="loading" class="text-center py-20">Loading...</div>

                <div v-else-if="log" class="max-w-3xl mx-auto space-y-6 w-full">

                    <div v-if="log.isBlocked"
                        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl p-6 flex items-start gap-4">
                        <div
                            class="bg-red-100 dark:bg-red-900/50 p-2 rounded-full text-red-600 dark:text-red-400 shrink-0">
                            <AlertOctagon class="h-6 w-6" />
                        </div>
                        <div>
                            <h3 class="font-bold text-red-900 dark:text-red-400">Work Blocked</h3>
                            <p class="text-red-800 dark:text-red-300 mt-1 text-sm">{{ log.blockerDetails }}</p>
                        </div>
                    </div>

                    <Card class="overflow-hidden">
                        <div class="bg-muted/30 px-6 py-4 border-b border-border flex justify-between items-center">
                            <Badge variant="secondary"
                                class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                {{ log.client?.companyName }}
                            </Badge>
                            <span class="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                                <Clock class="h-4 w-4" /> {{ log.hoursWorked }} Hours Logged
                            </span>
                        </div>

                        <div v-if="log.videoUrl" class="bg-black border-b border-border">
                            <LoomPlayer :url="log.videoUrl" />
                        </div>

                        <CardContent class="p-8 space-y-6">
                            <div>
                                <h3 class="text-foreground font-bold text-lg mb-2">Accomplishments</h3>
                                <p class="text-muted-foreground whitespace-pre-line leading-relaxed">{{ log.summary }}
                                </p>
                            </div>

                            <div v-if="log.attachmentUrl">
                                <h3 class="text-foreground font-bold text-sm mb-2 uppercase tracking-wide">Attachments
                                </h3>
                                <a :href="log.attachmentUrl" target="_blank"
                                    class="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition group">
                                    <div
                                        class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded">
                                        <FileText class="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p class="font-medium text-foreground group-hover:text-primary transition">View
                                            Attached File</p>
                                        <p class="text-xs text-muted-foreground truncate max-w-sm">{{ log.attachmentUrl
                                            }}</p>
                                    </div>
                                    <ExternalLink
                                        class="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary" />
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>
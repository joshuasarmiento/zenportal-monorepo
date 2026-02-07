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
        <SidebarInset class="bg-muted/50">
            <header
                class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-6 sticky top-0 z-10">
                <div class="flex items-center gap-2">
                    <SidebarTrigger class="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                    <Separator orientation="vertical" class="mr-2 h-4 bg-border" />
                    <Breadcrumb>
                        <BreadcrumbList>
                        <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="/dashboard" class="text-muted-foreground hover:text-foreground">Dashboard</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator class="hidden md:block" />
                        <BreadcrumbItem><BreadcrumbPage class="font-semibold text-foreground tracking-tight">Log Detail</BreadcrumbPage></BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div class="ml-auto" v-if="log">
                    <Button variant="outline" size="sm" @click="router.push(`/log/${log.id}/edit`)" class="gap-2 h-9 rounded-full border-border text-muted-foreground hover:text-foreground font-medium">
                        <Pencil class="h-3.5 w-3.5" /> Edit Log
                    </Button>
                </div>
            </header>

            <div class="flex flex-1 flex-col p-6 md:p-10 overflow-y-auto">
                <div v-if="loading" class="text-center py-20 text-muted-foreground font-medium">Loading...</div>

                <div v-else-if="log" class="max-w-3xl mx-auto space-y-8 w-full">

                    <div v-if="log.isBlocked"
                        class="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex items-start gap-5 shadow-sm">
                        <div
                            class="bg-destructive/20 p-2.5 rounded-xl text-destructive shrink-0">
                            <AlertOctagon class="h-6 w-6" />
                        </div>
                        <div>
                            <h3 class="font-bold text-destructive text-lg tracking-tight">Work Blocked</h3>
                            <p class="text-destructive/80 mt-1 text-sm leading-relaxed">{{ log.blockerDetails }}</p>
                        </div>
                    </div>

                    <Card class="overflow-hidden border border-border bg-card shadow-sm">
                        <div class="bg-muted/50 px-8 py-5 border-b border-border/50 flex justify-between items-center">
                            <Badge variant="secondary"
                                class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1 text-xs font-bold rounded-md uppercase tracking-wider">
                                {{ log.client?.companyName }}
                            </Badge>
                            <span class="flex items-center gap-2 text-muted-foreground font-medium text-sm bg-background px-3 py-1 rounded-full border border-border shadow-sm">
                                <Clock class="h-4 w-4" /> {{ log.hoursWorked }} Hours
                            </span>
                        </div>

                        <div v-if="log.videoUrl" class="bg-black border-b border-border">
                            <LoomPlayer :url="log.videoUrl" />
                        </div>

                        <CardContent class="p-8 md:p-10 space-y-10">
                            <div>
                                <h3 class="text-foreground font-bold text-xl mb-4 tracking-tight">Accomplishments</h3>
                                <div class="prose prose-zinc dark:prose-invert max-w-none">
                                    <p class="whitespace-pre-line leading-relaxed text-muted-foreground">{{ log.summary }}</p>
                                </div>
                            </div>

                            <div v-if="log.attachmentUrl">
                                <h3 class="text-muted-foreground font-bold text-xs mb-4 uppercase tracking-widest">Attachments</h3>
                                <a :href="log.attachmentUrl" target="_blank"
                                    class="flex items-center gap-4 p-4 border border-border rounded-2xl hover:bg-muted/50 transition-all group w-fit pr-6">
                                    <div
                                        class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                        <FileText class="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p class="font-bold text-foreground text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">View Attached File</p>
                                        <p class="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5">{{ log.attachmentUrl }}</p>
                                    </div>
                                    <ExternalLink
                                        class="h-4 w-4 text-muted-foreground ml-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>
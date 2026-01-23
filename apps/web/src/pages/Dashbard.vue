<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '../lib/api'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Clock, Briefcase, AlertCircle, Video, Paperclip, Check, ChevronRight, FileQuestion } from 'lucide-vue-next'

const router = useRouter()
const { fetchApi } = useApi()
const logs = ref<any[]>([])
const stats = ref({ hoursThisMonth: 0, activeClients: 0, pendingBlockers: 0 })
const loading = ref(true)

onMounted(async () => {
    try {
        const [logsRes, statsRes] = await Promise.all([fetchApi('/logs'), fetchApi('/stats')])
        logs.value = logsRes
        stats.value = statsRes
    } catch (err) { console.error(err) } finally { loading.value = false }
})

const navigateToLog = () => router.push('/log/new')
const viewLog = (id: string) => router.push(`/log/${id}`)
</script>

<template>
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header
                class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border bg-background px-4 sticky top-0 z-10">
                <div class="flex items-center gap-2">
                    <SidebarTrigger class="-ml-1" />
                    <Separator orientation="vertical" class="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem class="hidden md:block">
                                <BreadcrumbLink href="#">Platform</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator class="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div class="ml-auto">
                    <Button @click="navigateToLog" class="gap-2">
                        <PlusCircle class="h-4 w-4" /> Log Work
                    </Button>
                </div>
            </header>

            <div class="flex flex-1 flex-col gap-4 p-4 pt-4 bg-muted/40">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
                            <Clock class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ stats.hoursThisMonth }} h</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
                            <Briefcase class="h-4 w-4 text-green-600 dark:text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ stats.activeClients }}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium text-muted-foreground">Total Blockers</CardTitle>
                            <AlertCircle class="h-4 w-4 text-red-600 dark:text-red-400" />
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.pendingBlockers }}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card class="flex-1 flex flex-col min-h-[500px]">
                    <CardHeader class="border-b border-border">
                        <CardTitle>Recent Proof of Work</CardTitle>
                    </CardHeader>
                    <CardContent class="px-4 flex-1 flex flex-col">
                        <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20">
                            <div
                                class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4">
                            </div>
                            <p class="text-muted-foreground">Loading your data...</p>
                        </div>
                        <div v-else-if="logs.length === 0"
                            class="flex-1 flex flex-col items-center justify-center py-20 text-center">
                            <FileQuestion class="h-12 w-12 text-muted-foreground mb-3" />
                            <h3 class="text-lg font-bold">No work logged yet</h3>
                            <p class="text-muted-foreground mb-6">Create your first entry to impress your client.</p>
                        </div>
                        <div v-else class="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead class="w-1/3">Summary</TableHead>
                                        <TableHead>Evidence</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead class="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="log in logs" :key="log.id" @click="viewLog(log.id)"
                                        class="cursor-pointer hover:bg-muted/50 transition-colors group"
                                        :class="{ 'bg-red-50/50 dark:bg-red-900/20': log.isBlocked }">
                                        <TableCell class="font-medium text-muted-foreground">{{ log.date }}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary"
                                                class="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300">
                                                {{ log.client?.companyName || 'Unknown' }}
                                            </Badge>
                                        </TableCell>
                                        <TableCell class="truncate max-w-[200px] font-medium">{{ log.summary }}
                                        </TableCell>
                                        <TableCell>
                                            <div class="flex flex-col gap-1 items-start">
                                                <div v-if="log.videoUrl"
                                                    class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                                                    <Video class="h-3.5 w-3.5" /> Loom</div>
                                                <div v-if="log.attachmentUrl"
                                                    class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                                                    <Paperclip class="h-3.5 w-3.5" /> File
                                                </div>
                                                <span v-if="!log.videoUrl && !log.attachmentUrl"
                                                    class="text-muted-foreground text-xs">No evidence</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge v-if="log.isBlocked" variant="destructive" class="gap-1">
                                                <AlertCircle class="h-3 w-3" /> Blocked
                                            </Badge>
                                            <Badge v-else variant="outline"
                                                class="gap-1 border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                                <Check class="h-3 w-3" /> Done
                                            </Badge>
                                        </TableCell>
                                        <TableCell class="text-right">
                                            <ChevronRight
                                                class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors inline-block" />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>
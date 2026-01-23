<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../lib/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore' // Import User Store
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Search, Plus, Loader2, Link as LinkIcon, Pencil, UserPlus, Lock, Crown } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const userStore = useUserStore()
const { fetchApi } = useApi()

const clients = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('newest')

const FREE_LIMIT = 1

onMounted(async () => {
  if (!userStore.user) await userStore.fetchUser()
  try { clients.value = await fetchApi('/clients') } catch (err) { console.error(err) } finally { loading.value = false }
})

// Computed Properties for Limits
const isPro = computed(() => userStore.user?.tier === 'pro')
const activeCount = computed(() => clients.value.filter(c => c.status === 'active').length)
const isLimitReached = computed(() => !isPro.value && activeCount.value >= FREE_LIMIT)
const usagePercent = computed(() => isPro.value ? 0 : (activeCount.value / FREE_LIMIT) * 100)

const processedClients = computed(() => {
  let result = [...clients.value]
  if (statusFilter.value !== 'all') result = result.filter(c => c.status === statusFilter.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => c.companyName.toLowerCase().includes(q))
  }
  result.sort((a, b) => {
    if (sortBy.value === 'name') return a.companyName.localeCompare(b.companyName)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
  return result
})

const copyLink = (token: string) => {
  if (!token) return toast.error('Error: No token found')
  navigator.clipboard.writeText(`${window.location.origin}/c/${token}`)
  toast.success('Magic Link copied!')
}

const goToAdd = () => {
  if (isLimitReached.value) return
  router.push('/clients/new')
}

const goToEdit = (id: string) => router.push(`/clients/${id}/edit`)

const goToUpgrade = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/billing/checkout', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (err) {
    alert('Failed to start checkout')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
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
                <BreadcrumbPage>Clients</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="ml-auto flex items-center gap-4">
          <div v-if="!loading && !isPro" class="hidden md:flex flex-col items-end gap-1 w-32">
            <div class="flex justify-between w-full text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              <span>Client Limit</span>
              <span :class="{'text-orange-600 font-bold': isLimitReached}">{{ activeCount }}/{{ FREE_LIMIT }}</span>
            </div>
            <Progress :model-value="usagePercent" class="h-1.5" :class="{'bg-orange-100 dark:bg-orange-900/30': isLimitReached}" />
          </div>

          <div v-if="loading" class="h-9 w-32 bg-muted animate-pulse rounded-md"></div>

          <Button 
            v-else
            @click="isLimitReached ? goToUpgrade() : goToAdd()"
            class="gap-2 transition-all"
            :variant="isLimitReached ? 'outline' : 'default'"
            :class="isLimitReached ? 'text-xs h-8 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800' : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900'"
          >
            <Lock v-if="isLimitReached" class="h-4 w-4" />
            <UserPlus v-else class="h-4 w-4" /> 
            {{ isLimitReached ? 'Upgrade to Add' : 'Add Client' }}
          </Button>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input v-model="searchQuery" type="text" placeholder="Search companies..." class="pl-9 bg-background" />
          </div>
          <Select v-model="statusFilter">
            <SelectTrigger class="w-[180px] bg-background">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="sortBy">
            <SelectTrigger class="w-[180px] bg-background">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 class="h-8 w-8 animate-spin text-primary mb-4" />
          <p class="text-muted-foreground">Loading clients...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="(c, index) in processedClients" :key="c.id"
            class="hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden">
            
            <div v-if="c.status === 'archived'" class="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 pointer-events-none" />

            <CardHeader class="flex flex-row items-start justify-between space-y-0 pb-2 relative z-20">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                :class="index % 2 === 0 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300'">
                {{ c.companyName.substring(0, 2).toUpperCase() }}
              </div>
              <Badge :variant="c.status === 'archived' ? 'secondary' : 'default'" class="uppercase">
                {{ c.status || 'Active' }}
              </Badge>
            </CardHeader>
            <CardContent class="pb-2 relative z-20">
              <CardTitle class="text-lg">{{ c.companyName }}</CardTitle>
              <CardDescription class="truncate mt-1">{{ c.contactEmail || c.contactName || 'No contact info' }}
              </CardDescription>
            </CardContent>
            <CardFooter class="flex flex-col gap-4 mt-auto pt-4 relative z-20">
              <div class="w-full flex items-center justify-between text-sm border-t border-border pt-4">
                <span class="text-muted-foreground">Rate</span>
                <span class="font-medium">${{ c.hourlyRate }}/hr</span>
              </div>
              <div class="flex gap-2 w-full">
                <Button variant="outline" class="flex-1 gap-2" @click="copyLink(c.accessToken)">
                  <LinkIcon class="h-4 w-4" /> Copy Link
                </Button>
                <Button variant="ghost" size="icon" @click="goToEdit(c.id)" class="border border-border">
                  <Pencil class="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <button 
            v-if="!isLimitReached"
            @click="goToAdd"
            class="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-muted/50 transition cursor-pointer min-h-[280px] group bg-background"
          >
            <div class="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              <Plus class="h-6 w-6" />
            </div>
            <span class="font-medium">Add New Client</span>
          </button>

          <button 
            v-else
            @click="goToUpgrade"
            class="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl p-6 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition cursor-pointer min-h-[280px] group bg-background"
          >
            <div class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Crown class="h-6 w-6" />
            </div>
            <span class="font-bold text-lg">Unlock Unlimited Clients</span>
            <p class="text-sm text-center mt-2 text-muted-foreground max-w-[200px]">
              You've reached the free limit. Upgrade to Pro to manage more clients.
            </p>
          </button>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
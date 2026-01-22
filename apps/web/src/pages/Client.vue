<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../lib/api'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Plus, 
  Loader2, 
  Link as LinkIcon, 
  Pencil, 
  UserPlus, 
  Check,
  Copy
} from 'lucide-vue-next'

const router = useRouter()
const clients = ref<any[]>([])
const loading = ref(true)
const { fetchApi } = useApi()

// Filters & Sort State
const searchQuery = ref('')
const statusFilter = ref('all') 
const sortBy = ref('newest')             

onMounted(async () => {
  try {
    clients.value = await fetchApi('/clients')
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

const processedClients = computed(() => {
  let result = [...clients.value]
  if (statusFilter.value !== 'all') {
    result = result.filter(c => c.status === statusFilter.value)
  }
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
  if (!token) return alert('Error: No token found')
  const url = `${window.location.origin}/c/${token}`
  navigator.clipboard.writeText(url)
  alert('Magic Link copied!')
}

const goToAdd = () => router.push('/clients/new')
const goToEdit = (id: string) => router.push(`/clients/${id}/edit`)
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 sticky top-0 z-10">
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
        
        <div class="ml-auto">
          <Button @click="goToAdd" class="gap-2 bg-slate-900 hover:bg-slate-800">
            <UserPlus class="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-[#F3F4F6] overflow-y-auto">
        
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search companies..." 
              class="pl-9 bg-white"
            />
          </div>
          
          <Select v-model="statusFilter">
            <SelectTrigger class="w-[180px] bg-white">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="sortBy">
            <SelectTrigger class="w-[180px] bg-white">
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
          
          <Card v-for="(c, index) in processedClients" :key="c.id" class="hover:shadow-md transition-shadow flex flex-col">
            <CardHeader class="flex flex-row items-start justify-between space-y-0 pb-2">
               <div 
                class="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                :class="index % 2 === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'"
              >
                {{ c.companyName.substring(0, 2).toUpperCase() }}
              </div>
              <Badge :variant="c.status === 'archived' ? 'secondary' : 'default'" class="uppercase">
                {{ c.status || 'Active' }}
              </Badge>
            </CardHeader>

            <CardContent class="pb-2">
              <CardTitle class="text-lg">{{ c.companyName }}</CardTitle>
              <CardDescription class="truncate mt-1">
                {{ c.contactEmail || c.contactName || 'No contact info' }}
              </CardDescription>
            </CardContent>
            
            <CardFooter class="flex flex-col gap-4 mt-auto pt-4">
              <div class="w-full flex items-center justify-between text-sm border-t pt-4">
                <span class="text-muted-foreground">Rate</span>
                <span class="font-medium">${{ c.hourlyRate }}/hr</span>
              </div>
              
              <div class="flex gap-2 w-full">
                <Button variant="outline" class="flex-1 gap-2" @click="copyLink(c.accessToken)">
                  <LinkIcon class="h-4 w-4" /> Copy Link
                </Button>
                <Button variant="ghost" size="icon" @click="goToEdit(c.id)" class="border">
                  <Pencil class="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <button @click="goToAdd" class="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-blue-50/50 transition cursor-pointer min-h-[280px] group bg-white">
            <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
              <Plus class="h-6 w-6" />
            </div>
            <span class="font-medium">Add New Client</span>
          </button>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { X, CheckCircle, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const { fetchApi } = useApi()
const loading = ref(false)

const form = ref({
  companyName: '',
  contactName: '',
  contactEmail: '',
  hourlyRate: 25.00,
})

const submit = async () => {
  loading.value = true
  try {
    await fetchApi('/clients', { method: 'POST', body: JSON.stringify(form.value) })
    toast.success('Client created successfully')
    router.push('/clients')
  } catch (err: any) {
    if (err.message?.includes('Limit')) {
      toast.error(err.message || 'Limit reached')
    } else {
      toast.error('Failed to create client')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="bg-zinc-50 dark:bg-black">
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" />
          <Separator orientation="vertical" class="mr-2 h-4 bg-zinc-200 dark:bg-zinc-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="#" class="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Platform</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="/clients" class="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Clients</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage class="font-semibold text-zinc-900 dark:text-white tracking-tight">Add New</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-6 md:p-10 overflow-y-auto">
        <div class="max-w-2xl mx-auto w-full">
          <Card class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <CardHeader class="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6">
              <CardTitle class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Add New Client</CardTitle>
              <Button variant="ghost" size="icon" @click="router.back()" class="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                <X class="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent class="pt-8">
              <form @submit.prevent="submit" class="space-y-8">
                <div class="space-y-2">
                  <Label class="text-sm font-semibold text-zinc-900 dark:text-white">Company Name</Label>
                  <Input v-model="form.companyName" required placeholder="e.g. Alpha Corp" class="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <Label class="text-sm font-semibold text-zinc-900 dark:text-white">Contact Name (Optional)</Label>
                    <Input v-model="form.contactName" placeholder="e.g. Jim Halpert" class="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg" />
                  </div>
                  <div class="space-y-2">
                    <Label class="text-sm font-semibold text-zinc-900 dark:text-white">Contact Email (Optional)</Label>
                    <Input v-model="form.contactEmail" type="email" placeholder="jim@alpha.com" class="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg" />
                  </div>
                </div>

                <div class="space-y-2">
                  <Label class="text-sm font-semibold text-zinc-900 dark:text-white">Hourly Rate (USD)</Label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-zinc-500 font-bold">$</span>
                    <Input v-model="form.hourlyRate" type="number" step="0.01" class="pl-7 h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg" placeholder="25.00" />
                  </div>
                  <p class="text-[11px] text-zinc-500 font-medium">Used to calculate your earnings estimates.</p>
                </div>

                <div class="flex justify-end pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <Button :disabled="loading" class="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full px-6 font-bold shadow-sm">
                    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                    <span v-else class="flex items-center gap-2"><CheckCircle class="h-4 w-4" /> Create Client</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { X, CheckCircle, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const { fetchApi } = useApi()
const loading = ref(false)

const form = ref({
  companyName: '',
  contactName: '',
  contactEmail: '',
  hourlyRate: 25.00
})

const submit = async () => {
  loading.value = true
  try {
    await fetchApi('/clients', { method: 'POST', body: JSON.stringify(form.value) })
    router.push('/clients')
  } catch (err) {
    alert('Failed to create client.')
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
              <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="#">Platform</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="/clients">Clients</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Add New</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        <div class="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between border-b border-border pb-4">
              <CardTitle>Add New Client</CardTitle>
              <Button variant="ghost" size="icon" @click="router.back()">
                <X class="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent class="pt-6">
              <form @submit.prevent="submit" class="space-y-6">
                <div class="space-y-2">
                  <Label>Company Name</Label>
                  <Input v-model="form.companyName" required placeholder="e.g. Alpha Corp" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <Label>Contact Name (Optional)</Label>
                    <Input v-model="form.contactName" placeholder="e.g. Jim Halpert" />
                  </div>
                  <div class="space-y-2">
                    <Label>Contact Email (Optional)</Label>
                    <Input v-model="form.contactEmail" type="email" placeholder="jim@alpha.com" />
                  </div>
                </div>

                <div class="space-y-2">
                  <Label>Hourly Rate (USD)</Label>
                  <div class="relative">
                    <span class="absolute left-3 top-2.5 text-muted-foreground font-bold">$</span>
                    <Input v-model="form.hourlyRate" type="number" step="0.01" class="pl-7" placeholder="25.00" />
                  </div>
                  <p class="text-xs text-muted-foreground">Used to calculate your earnings estimates.</p>
                </div>

                <div class="flex justify-end pt-4 border-t border-border">
                  <Button :disabled="loading">
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
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApi } from '../lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { X, Loader2, Save } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const { fetchApi } = useApi()
const loading = ref(true)
const saving = ref(false)
const clientId = route.params.id as string

const form = ref({ companyName: '', contactName: '', contactEmail: '', hourlyRate: 0, status: 'active' })

onMounted(async () => {
  try {
    const data = await fetchApi(`/clients/${clientId}`)
    form.value = { ...data, status: data.status || 'active' }
  } catch (err) {
    toast.error('Could not load client details')
    router.push('/clients')
  } finally {
    loading.value = false
  }
})

const submit = async () => {
  saving.value = true
  try {
    await fetchApi(`/clients/${clientId}`, { method: 'PUT', body: JSON.stringify(form.value) })
    toast.success('Client updated successfully')
    router.push('/clients')
  } catch (err) { 
    toast.error('Failed to update client') 
  } finally { 
    saving.value = false 
  }
}
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="bg-muted/50">
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-6 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
          <Separator orientation="vertical" class="mr-2 h-4 bg-border" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="/clients" class="text-muted-foreground hover:text-foreground">Clients</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage class="font-semibold text-foreground tracking-tight">Edit Client</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-6 md:p-10 overflow-y-auto">
        <div class="max-w-2xl mx-auto w-full">
          <Card class="border border-border bg-card shadow-sm">
            <CardHeader class="flex flex-row items-center justify-between border-b border-border/50 pb-6">
              <CardTitle class="text-xl font-bold tracking-tight text-foreground">Edit Client</CardTitle>
              <Button variant="ghost" size="icon" @click="router.back()" class="text-muted-foreground hover:text-foreground">
                <X class="h-4 w-4" />
              </Button>
            </CardHeader>

            <div v-if="loading" class="p-20 flex justify-center"><Loader2 class="h-8 w-8 animate-spin text-muted-foreground" /></div>

            <CardContent v-else class="pt-8">
              <form @submit.prevent="submit" class="space-y-8">
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label class="text-sm font-semibold">Company Name</Label>
                        <Input v-model="form.companyName" required class="h-10 bg-background border-border" />
                    </div>
                    <div class="space-y-2">
                        <Label class="text-sm font-semibold">Status</Label>
                        <Select v-model="form.status">
                          <SelectTrigger class="h-10 bg-background border-border">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent class="bg-card border-border">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2"><Label class="text-sm font-semibold">Contact Name</Label><Input v-model="form.contactName" class="h-10 bg-background border-border" /></div>
                  <div class="space-y-2"><Label class="text-sm font-semibold">Contact Email</Label><Input v-model="form.contactEmail" type="email" class="h-10 bg-background border-border" /></div>
                </div>
                <div class="space-y-2">
                  <Label class="text-sm font-semibold">Hourly Rate</Label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-muted-foreground font-bold">$</span>
                    <Input v-model="form.hourlyRate" type="number" step="0.01" class="pl-7 h-10 bg-background border-border" />
                  </div>
                </div>
                <div class="flex justify-end pt-6 border-t border-border/50">
                  <Button :disabled="saving" class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-bold shadow-sm">
                    <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                    <span v-else class="flex items-center gap-2"><Save class="h-4 w-4" /> Update Client</span>
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
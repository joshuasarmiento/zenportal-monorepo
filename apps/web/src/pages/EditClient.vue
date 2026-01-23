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
import { X, Loader2 } from 'lucide-vue-next'
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
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="/clients">Clients</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Edit Client</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        <div class="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between border-b border-border pb-4">
              <CardTitle>Edit Client</CardTitle>
              <Button variant="ghost" size="icon" @click="router.back()"><X class="h-4 w-4" /></Button>
            </CardHeader>

            <div v-if="loading" class="p-10 flex justify-center"><Loader2 class="h-8 w-8 animate-spin text-muted-foreground" /></div>

            <CardContent v-else class="pt-6">
              <form @submit.prevent="submit" class="space-y-6">
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label>Company Name</Label>
                        <Input v-model="form.companyName" required />
                    </div>
                    <div class="space-y-2">
                        <Label>Status</Label>
                        <Select v-model="form.status">
                          <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2"><Label>Contact Name</Label><Input v-model="form.contactName" /></div>
                  <div class="space-y-2"><Label>Contact Email</Label><Input v-model="form.contactEmail" type="email" /></div>
                </div>
                <div class="space-y-2">
                  <Label>Hourly Rate</Label>
                  <div class="relative">
                    <span class="absolute left-3 top-2.5 text-muted-foreground font-bold">$</span>
                    <Input v-model="form.hourlyRate" type="number" step="0.01" class="pl-7" />
                  </div>
                </div>
                <div class="flex justify-end pt-4 border-t border-border">
                  <Button :disabled="saving">
                    <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                    {{ saving ? 'Saving...' : 'Update Client' }}
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
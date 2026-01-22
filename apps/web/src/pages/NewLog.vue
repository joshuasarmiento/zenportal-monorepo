<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { X, Loader2, AlertOctagon } from 'lucide-vue-next'

const router = useRouter()
const { fetchApi } = useApi()
const clients = ref<any[]>([])
const loading = ref(false)

const form = ref({
  clientId: '',
  date: new Date().toISOString().split('T')[0],
  summary: '',
  hoursWorked: 0,
  videoUrl: '',
  attachmentUrl: '',
  isBlocked: false,
  blockerDetails: ''
})

onMounted(async () => {
  try {
    clients.value = await fetchApi('/clients')
    if (clients.value.length > 0) form.value.clientId = clients.value[0].id
  } catch (e) { console.error(e) }
})

const submit = async () => {
  loading.value = true
  try {
    await fetchApi('/logs', { method: 'POST', body: JSON.stringify(form.value) })
    router.push('/dashboard')
  } catch (err) { alert('Failed to save log.') } finally { loading.value = false }
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
              <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Log Work</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        <div class="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between border-b border-border pb-4">
              <CardTitle>Log New Work</CardTitle>
              <Button variant="ghost" size="icon" @click="router.back()"><X class="h-4 w-4" /></Button>
            </CardHeader>

            <CardContent class="pt-6">
              <form @submit.prevent="submit" class="space-y-6">
                <div class="space-y-2">
                  <Label>Select Client</Label>
                  <Select v-model="form.clientId">
                    <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="client in clients" :key="client.id" :value="client.id">{{ client.companyName }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <Label>Accomplishments (One per line)</Label>
                  <Textarea v-model="form.summary" rows="5" placeholder="- Fixed the homepage bug&#10;- Sent 50 cold emails" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label>Video Link (Loom)</Label>
                    <Input v-model="form.videoUrl" placeholder="https://loom.com/..." />
                  </div>
                  <div class="space-y-2">
                    <Label>Attachment Link</Label>
                    <Input v-model="form.attachmentUrl" placeholder="GDrive / Dropbox Link" />
                  </div>
                </div>

                <div class="space-y-2">
                    <Label>Hours Worked</Label>
                    <Input v-model="form.hoursWorked" type="number" step="0.5" />
                </div>

                <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-900">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="form.isBlocked" class="w-4 h-4 text-red-600 rounded focus:ring-red-500">
                    <span class="font-bold text-red-700 dark:text-red-400 text-sm">I am Blocked / Stuck</span>
                  </label>
                  <div v-if="form.isBlocked" class="mt-3">
                    <Input v-model="form.blockerDetails" class="bg-background border-red-200 dark:border-red-800" placeholder="What do you need from the client?" />
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <Button :disabled="loading">{{ loading ? 'Saving...' : 'Save Log' }}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
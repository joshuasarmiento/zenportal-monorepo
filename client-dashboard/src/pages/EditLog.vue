<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApi } from '../lib/api'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { X, Loader2, Save, Lock, Video } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const { fetchApi } = useApi()
const userStore = useUserStore()
const loading = ref(true)
const saving = ref(false)
const logId = route.params.id as string

const form = ref({
  clientName: '',
  date: '',
  summary: '',
  hoursWorked: 0,
  videoUrl: '',
  attachmentUrl: '',
  isBlocked: false,
  blockerDetails: ''
})

const isPro = computed(() => userStore.user?.tier === 'pro')

onMounted(async () => {
  await userStore.fetchUser()
  try {
    const data = await fetchApi(`/logs/${logId}`)
    form.value = {
      clientName: data.client?.companyName || 'Unknown Client',
      date: data.date,
      summary: data.summary,
      hoursWorked: data.hoursWorked,
      videoUrl: data.videoUrl || '',
      attachmentUrl: data.attachmentUrl || '',
      isBlocked: !!data.isBlocked,
      blockerDetails: data.blockerDetails || ''
    }
  } catch (err) {
    toast.error('Log not found')
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
})

const submit = async () => {
  saving.value = true
  try {
    // Sanitize data before sending
    const payload = { ...form.value }
    if (!isPro.value) {
      delete (payload as any).videoUrl
    }

    await fetchApi(`/logs/${logId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    toast.success('Log updated successfully')
    router.push(`/log/${logId}`)
  } catch (err) {
    toast.error('Failed to update log')
  } finally {
    saving.value = false
  }
}

const handleUpgrade = async () => {
  saving.value = true
  try {
    const res = await fetchApi('/api/billing/subscribe', { method: 'POST' })
    const session = res.data
    if (session?.attributes?.checkout_url) {
      localStorage.setItem('pending_checkout_id', session.id);
      window.location.href = session.attributes.checkout_url;
    } else {
      toast.error('Failed to create checkout session');
    }
  } catch (err: any) {
    toast.error('Failed to start checkout.', {
      description: err.message
    })
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
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink :href="`/log/${logId}`">Log Detail</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Log</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        <div class="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between border-b border-border pb-4">
              <CardTitle>Edit Log Entry</CardTitle>
              <Button variant="ghost" size="icon" @click="router.back()">
                <X class="h-4 w-4" />
              </Button>
            </CardHeader>

            <div v-if="loading" class="p-10 flex justify-center">
              <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
            </div>

            <CardContent v-else class="pt-6">
              <form @submit.prevent="submit" class="space-y-6">

                <div class="space-y-2">
                  <Label>Client</Label>
                  <Input v-model="form.clientName" disabled class="bg-muted text-muted-foreground" />
                </div>

                <div class="space-y-2">
                  <Label>Accomplishments</Label>
                  <Textarea v-model="form.summary" rows="5" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2 relative">
                    <div class="flex items-center justify-between">
                        <Label :class="{'text-muted-foreground': !isPro}">Video Update (Loom / Drive)</Label>
                        <span v-if="!isPro" class="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Lock class="h-2.5 w-2.5" /> PRO
                        </span>
                    </div>
                    
                    <div class="relative">
                        <Input 
                            v-model="form.videoUrl" 
                            :disabled="!isPro"
                            :placeholder="isPro ? 'Paste Loom or Drive link here...' : 'Upgrade to attach videos'" 
                            :class="{'pl-9': !isPro, 'opacity-60 cursor-not-allowed bg-muted': !isPro}"
                        />
                        <div v-if="!isPro" class="absolute left-3 top-2.5 text-muted-foreground">
                             <Video class="h-4 w-4" />
                        </div>
                    </div>
                    
                    <p v-if="!isPro" class="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline" @click="handleUpgrade">
                        <Lock class="h-2.5 w-2.5 inline mr-0.5" /> Unlock video embeds with Pro
                    </p>
                  </div>

                  <div class="space-y-2">
                    <Label>Attachment Link</Label>
                    <Input v-model="form.attachmentUrl" />
                  </div>
                </div>

                <div class="space-y-2">
                  <Label>Hours Worked</Label>
                  <Input v-model="form.hoursWorked" type="number" step="0.5" />
                </div>

                <div class="rounded-lg p-4 border transition-colors"
                  :class="form.isBlocked ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900' : 'bg-background border-border'">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="form.isBlocked"
                      class="w-4 h-4 text-red-600 rounded focus:ring-red-500">
                      <span class="font-bold text-sm"
                        :class="form.isBlocked ? 'text-red-700 dark:text-red-400' : 'text-foreground'">
                        I am Blocked / Stuck
                      </span>
                  </label>
                  <div v-if="form.isBlocked" class="mt-3">
                    <Label class="text-xs text-red-600 dark:text-red-400 mb-1 block">Reason</Label>
                    <Input v-model="form.blockerDetails" class="bg-background"
                      placeholder="What do you need from the client?" />
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <Button :disabled="saving">
                    <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                    <span v-else class="flex items-center gap-2">
                      <Save class="h-4 w-4" /> Save Changes
                    </span>
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
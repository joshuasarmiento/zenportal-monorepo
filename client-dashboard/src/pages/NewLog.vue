<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import { useUserStore } from '@/stores/userStore'
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
import { X, Loader2, Lock, Video } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const { fetchApi } = useApi()
const userStore = useUserStore()

const clients = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)

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

const isPro = computed(() => userStore.user?.tier === 'pro')

onMounted(async () => {
  if (!userStore.user) await userStore.fetchUser()

  try {
    clients.value = await fetchApi('/clients')
    if (clients.value.length > 0) form.value.clientId = clients.value[0].id
  } catch (e) {
    console.error(e)
  }
})

const submit = async () => {
  saving.value = true
  try {
    await fetchApi('/logs', { method: 'POST', body: JSON.stringify(form.value) })
    toast.success('Log saved successfully')
    router.push('/dashboard')
  } catch (err: any) {
    if (err.message?.includes('LIMIT_REACHED') || err.status === 403) {
      toast.error("Monthly limit reached! Upgrade to Pro to continue.")
    } else {
      toast.error('Failed to save log.')
    }
  } finally {
    saving.value = false
  }
}

const handleUpgrade = async () => {
  loading.value = true
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
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Log Work</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="ml-auto" v-if="!isPro">
          <Button @click="handleUpgrade" :disabled="loading" variant="outline" size="sm"
            class="text-xs h-8 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800 gap-1">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            <Lock v-else class="h-3 w-3" />
            {{ loading ? 'Redirecting...' : 'Upgrade to Pro' }}
          </Button>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        <div class="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between border-b border-border pb-4">
              <CardTitle>Log New Work</CardTitle>
              <Button variant="ghost" size="icon" @click="router.back()">
                <X class="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent class="pt-6">
              <form @submit.prevent="submit" class="space-y-6">
                <div class="space-y-2">
                  <Label>Select Client</Label>
                  <Select v-model="form.clientId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="client in clients" :key="client.id" :value="client.id">{{ client.companyName }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <Label>Accomplishments (One per line)</Label>
                  <Textarea v-model="form.summary" rows="5"
                    placeholder="- Fixed the homepage bug&#10;- Sent 50 cold emails" required />
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
                    
                    <p v-if="isPro" class="text-[10px] text-muted-foreground">
                      Tip: Use <a href="https://screenity.io" target="_blank" class="underline hover:text-primary">Screenity</a> for free unlimited recording.
                    </p>
                    <p v-else class="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline" @click="handleUpgrade">
                        <Lock class="h-2.5 w-2.5 inline mr-0.5" /> Unlock video embeds with Pro
                    </p>
                  </div>

                  <div class="space-y-2">
                    <Label>Attachment Link</Label>
                    <Input v-model="form.attachmentUrl" placeholder="GDrive / Dropbox Link"/>
                  </div>
                </div>

                <div class="space-y-2">
                  <Label>Hours Worked</Label>
                  <Input v-model="form.hoursWorked" type="number" step="0.5" required/>
                </div>

                <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-900">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="form.isBlocked"
                      class="w-4 h-4 text-red-600 rounded focus:ring-red-500">
                      <span class="font-bold text-red-700 dark:text-red-400 text-sm">I am Blocked / Stuck</span>
                  </label>
                  <div v-if="form.isBlocked" class="mt-3">
                    <Input v-model="form.blockerDetails" class="bg-background border-red-200 dark:border-red-800"
                      placeholder="What do you need from the client?" />
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <Button :disabled="saving">
                    <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                    {{ saving ? 'Saving...' : 'Save Log' }}
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
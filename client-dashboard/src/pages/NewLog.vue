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
import { X, Loader2, Lock, Video, CheckCircle2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { authClient } from '@/lib/auth-client'

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
    const { data, error } = await authClient.dodopayments.checkoutSession({
      slug: 'pro-plan',
    })

    if (error) {
      toast.error(error.message || "Failed to create checkout session")
      return
    }

    if (data?.url) {
      window.location.href = data.url
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
    <SidebarInset class="bg-zinc-50 dark:bg-black">
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" />
          <Separator orientation="vertical" class="mr-2 h-4 bg-zinc-200 dark:bg-zinc-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/dashboard" class="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage class="font-semibold text-zinc-900 dark:text-white tracking-tight">Log Work</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="ml-auto" v-if="!isPro">
          <Button @click="handleUpgrade" :disabled="loading" variant="outline" size="sm"
            class="text-xs h-8 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800 gap-1 rounded-full">
            <Loader2 v-if="loading" class="mr-2 h-3 w-3 animate-spin" />
            <Lock v-else class="h-3 w-3" />
            {{ loading ? 'Redirecting...' : 'Upgrade to Pro' }}
          </Button>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-6 md:p-10 overflow-y-auto">
        <div class="max-w-2xl mx-auto w-full">
          <Card class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <CardHeader class="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6">
              <CardTitle class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Log New Work</CardTitle>
              <Button variant="ghost" size="icon" @click="router.back()" class="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                <X class="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent class="pt-8">
              <form @submit.prevent="submit" class="space-y-8">
                <div class="space-y-2">
                  <Label class="text-sm font-semibold">Select Client</Label>
                  <Select v-model="form.clientId">
                    <SelectTrigger class="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent class="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                      <SelectItem v-for="client in clients" :key="client.id" :value="client.id">{{ client.companyName }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <Label class="text-sm font-semibold">Accomplishments (One per line)</Label>
                  <Textarea v-model="form.summary" rows="5" class="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 resize-none"
                    placeholder="- Fixed the homepage bug&#10;- Sent 50 cold emails" required />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div class="space-y-2 relative">
                    <div class="flex items-center justify-between">
                        <Label class="text-sm font-semibold" :class="{'text-zinc-400': !isPro}">Video Update (Loom / Drive)</Label>
                        <span v-if="!isPro" class="text-[10px] font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Lock class="h-2.5 w-2.5" /> PRO
                        </span>
                    </div>
                    
                    <div class="relative">
                        <Input 
                            v-model="form.videoUrl" 
                            :disabled="!isPro"
                            :placeholder="isPro ? 'Paste Loom or Drive link here...' : 'Upgrade to attach videos'" 
                            class="h-10 border-zinc-200 dark:border-zinc-800"
                            :class="!isPro ? 'pl-9 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed' : 'bg-zinc-50 dark:bg-zinc-900'"
                        />
                        <div v-if="!isPro" class="absolute left-3 top-3 text-zinc-400">
                             <Video class="h-4 w-4" />
                        </div>
                    </div>
                    
                    <p v-if="isPro" class="text-[10px] text-zinc-500 font-medium">
                      Tip: Use <a href="https://screenity.io" target="_blank" class="underline hover:text-zinc-900 dark:hover:text-white">Screenity</a> for free unlimited recording.
                    </p>
                    <p v-else class="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline" @click="handleUpgrade">
                        <Lock class="h-2.5 w-2.5 inline mr-0.5" /> Unlock video embeds with Pro
                    </p>
                  </div>

                  <div class="space-y-2">
                    <Label class="text-sm font-semibold">Attachment Link</Label>
                    <Input v-model="form.attachmentUrl" placeholder="GDrive / Dropbox Link" class="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"/>
                  </div>
                </div>

                <div class="space-y-2">
                  <Label class="text-sm font-semibold">Hours Worked</Label>
                  <Input v-model="form.hoursWorked" type="number" step="0.5" required class="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"/>
                </div>

                <div class="rounded-xl p-5 border transition-all duration-300" 
                     :class="form.isBlocked ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800'">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="form.isBlocked"
                      class="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-zinc-300">
                      <span class="font-bold text-sm"
                        :class="form.isBlocked ? 'text-red-700 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400'">
                        I am Blocked / Stuck
                      </span>
                  </label>
                  <div v-if="form.isBlocked" class="mt-4 animate-in slide-in-from-top-2">
                    <Input v-model="form.blockerDetails" class="bg-white dark:bg-zinc-900 border-red-200 dark:border-red-900/30"
                      placeholder="What do you need from the client?" />
                  </div>
                </div>

                <div class="flex justify-end pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <Button :disabled="saving" class="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full px-8 font-bold shadow-sm">
                    <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                    <span v-else class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4" /> Save Log</span>
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
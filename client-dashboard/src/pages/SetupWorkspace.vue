<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useApi } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Building2, User, Check } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const userStore = useUserStore()
const { fetchApi } = useApi()

const step = ref<'selection' | 'agency-details'>('selection')
const loading = ref(false)

const agencyForm = ref({
  name: '',
  slug: ''
})

const createFreelancerWorkspace = async () => {
    loading.value = true
    try {
        const userName = userStore.user?.name || 'My Workspace'
        const slug = userName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000)
        
        const res = await fetchApi('/api/workspaces', {
            method: 'POST',
            body: JSON.stringify({
                name: userName,
                slug: slug,
                type: 'freelancer'
            })
        })
        
        await userStore.fetchUser(true) // Refresh user & workspaces
        toast.success("Workspace created!")
        
        // Auto-switch to new workspace
        if (res.id) {
            userStore.switchWorkspace(res.id)
        } else {
             router.push('/dashboard')
        }
    } catch (e: any) {
        toast.error(e.message || "Failed to create workspace")
    } finally {
        loading.value = false
    }
}

const createAgencyWorkspace = async () => {
    if (!agencyForm.value.name || !agencyForm.value.slug) {
        return toast.error("Please fill in all fields")
    }

    loading.value = true
    try {
        const res = await fetchApi('/api/workspaces', {
            method: 'POST',
            body: JSON.stringify({
                name: agencyForm.value.name,
                slug: agencyForm.value.slug,
                type: 'agency'
            })
        })
        
        await userStore.fetchUser(true)
        toast.success("Agency workspace created!")
        
        if (res.id) {
            userStore.switchWorkspace(res.id)
        } else {
             router.push('/dashboard')
        }
    } catch (e: any) {
        toast.error(e.message || "Failed to create workspace")
    } finally {
        loading.value = false
    }
}

const generateSlug = () => {
    agencyForm.value.slug = agencyForm.value.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 font-sans">
    <div class="w-full max-w-3xl">
      
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
           {{ step === 'selection' ? 'How do you plan to use ZenPortal?' : 'Set up your Agency' }}
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400">
           {{ step === 'selection' ? 'Choose the workspace type that fits your needs.' : 'Give your team a home.' }}
        </p>
      </div>

      <div v-if="step === 'selection'" class="grid md:grid-cols-2 gap-6">
          <!-- Freelancer Option -->
          <Card class="cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors border-2 border-transparent hover:shadow-lg" @click="createFreelancerWorkspace">
              <CardContent class="p-8 flex flex-col items-center text-center gap-4">
                  <div class="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <User class="h-8 w-8" />
                  </div>
                  <div>
                      <h3 class="font-bold text-lg mb-1">Freelancer</h3>
                      <p class="text-sm text-zinc-500">I am a solo freelancer working with my own clients.</p>
                  </div>
                  <ul class="text-left text-sm text-zinc-600 dark:text-zinc-400 space-y-2 mt-2">
                       <li class="flex items-center gap-2"><Check class="h-4 w-4 text-green-500" /> Track Hours & Earnings</li>
                       <li class="flex items-center gap-2"><Check class="h-4 w-4 text-green-500" /> Share Client Portals</li>
                       <li class="flex items-center gap-2"><Check class="h-4 w-4 text-green-500" /> Simple Billing Management</li>
                  </ul>
                  <Button class="w-full mt-4" :disabled="loading">
                      <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                      Select Freelancer
                  </Button>
              </CardContent>
          </Card>

          <!-- Agency Option -->
          <Card class="cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-colors border-2 border-transparent hover:shadow-lg" @click="step = 'agency-details'">
              <CardContent class="p-8 flex flex-col items-center text-center gap-4">
                  <div class="h-16 w-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Building2 class="h-8 w-8" />
                  </div>
                  <div>
                      <h3 class="font-bold text-lg mb-1">Agency</h3>
                      <p class="text-sm text-zinc-500">I manage a team of freelancers or employees.</p>
                  </div>
                   <ul class="text-left text-sm text-zinc-600 dark:text-zinc-400 space-y-2 mt-2">
                       <li class="flex items-center gap-2"><Check class="h-4 w-4 text-green-500" /> Everything in Freelancer</li>
                       <li class="flex items-center gap-2"><Check class="h-4 w-4 text-green-500" /> Invite Team Members</li>
                       <li class="flex items-center gap-2"><Check class="h-4 w-4 text-green-500" /> Unified Billing & Branding</li>
                  </ul>
                  <Button variant="outline" class="w-full mt-4">Select Agency</Button>
              </CardContent>
          </Card>
      </div>

      <div v-else class="max-w-md mx-auto">
          <Card>
              <CardContent class="p-6 grid gap-4">
                  <div class="grid gap-2">
                      <Label>Agency Name</Label>
                      <Input v-model="agencyForm.name" @input="generateSlug" placeholder="Acme Digital" />
                  </div>
                  <div class="grid gap-2">
                      <Label>Workspace URL</Label>
                      <div class="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md border border-zinc-200 dark:border-zinc-700">
                          <span>zenportal.io/w/</span>
                          <input v-model="agencyForm.slug" class="bg-transparent outline-none flex-1 text-zinc-900 dark:text-white" />
                      </div>
                  </div>
                  <div class="flex gap-4 mt-2">
                      <Button variant="ghost" @click="step = 'selection'">Back</Button>
                      <Button class="flex-1" @click="createAgencyWorkspace" :disabled="loading">
                           <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                           Create Workspace
                      </Button>
                  </div>
              </CardContent>
          </Card>
      </div>

    </div>
  </div>
</template>

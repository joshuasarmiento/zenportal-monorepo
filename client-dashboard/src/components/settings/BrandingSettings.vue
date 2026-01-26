<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Lock, Copy, Check, Loader2, Sparkles } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import { toast } from 'vue-sonner' 

const { fetchApi } = useApi()
const userStore = useUserStore()
const saving = ref(false)
const copied = ref(false)
const upgrading = ref(false)

const form = ref({
  portalSlug: '',
  accentColor: 'indigo',
  publicTemplate: 'modern',
  headline: '',
  bio: '',
  websiteUrl: '',
  linkedinUrl: '',
  twitterUrl: ''
})

const isPro = computed(() => userStore.user?.tier === 'pro')

// --- VISUAL PREVIEW CONFIGURATION ---
const templates = [
  { 
    id: 'modern', 
    name: 'Zen (Modern)', 
    desc: 'Soft glass, gradients, fluid.', 
    isPro: false,
    // Preview Styles matching the "Soft Glass" 2026 look
    containerClass: 'rounded-[16px] border border-zinc-200/50 shadow-sm font-sans bg-zinc-50/50',
    headerClass: 'h-10 w-full rounded-t-[16px] opacity-20 backdrop-blur-md',
    avatarClass: 'rounded-[10px] ring-2 ring-white/50 bg-white shadow-sm',
    buttonClass: 'rounded-full shadow-sm text-[8px] px-3 font-medium',
    cardBodyClass: 'bg-white/40 backdrop-blur-sm m-2 rounded-xl border border-white/50'
  },
  { 
    id: 'corporate', 
    name: 'Executive (Editorial)', 
    desc: 'Serif, sharp, minimal.', 
    isPro: true,
    // Preview Styles matching the "New York Editorial" look
    containerClass: 'rounded-none border border-zinc-200 bg-[#F9F9F9] font-serif',
    headerClass: 'hidden', 
    avatarClass: 'rounded-none border-2 border-white -mb-3 z-10 bg-white shadow-sm',
    buttonClass: 'rounded-none uppercase text-[7px] tracking-widest font-bold px-3 py-1.5',
    cardBodyClass: 'bg-white border-t-2 border-zinc-100 shadow-md mx-2 mt-4 mb-2 p-2'
  },
  { 
    id: 'creative', 
    name: 'Pop (Neo-Brutalism)', 
    desc: 'High contrast, bold borders.', 
    isPro: true,
    // Preview Styles matching the "Neo-Brutalism" look
    containerClass: 'rounded-lg border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-mono',
    headerClass: 'h-8 w-full border-b-2 border-black opacity-20',
    avatarClass: 'rounded-md border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    buttonClass: 'rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-bold text-[8px]',
    cardBodyClass: 'bg-transparent p-2'
  }
]

const colors = [
  { name: 'indigo', hex: 'bg-indigo-600', text: 'text-indigo-600', ring: 'ring-indigo-600' },
  { name: 'blue', hex: 'bg-blue-600', text: 'text-blue-600', ring: 'ring-blue-600' },
  { name: 'emerald', hex: 'bg-emerald-600', text: 'text-emerald-600', ring: 'ring-emerald-600' },
  { name: 'rose', hex: 'bg-rose-600', text: 'text-rose-600', ring: 'ring-rose-600' },
  { name: 'gray', hex: 'bg-zinc-900', text: 'text-zinc-900', ring: 'ring-zinc-900' }
]

// Helper to get current color object for the preview
const activeColor = computed(() => {
    return colors.find(c => c.name === form.value.accentColor) || colors[0]
})

onMounted(async () => {
  await userStore.fetchUser()
  if (userStore.user) {
    form.value.portalSlug = userStore.user.portalSlug || ''
    form.value.accentColor = userStore.user.accentColor || 'indigo'
    form.value.publicTemplate = userStore.user.publicTemplate || 'modern'
    form.value.headline = userStore.user.headline || ''
    form.value.bio = userStore.user.bio || ''
    form.value.websiteUrl = userStore.user.websiteUrl || ''
    form.value.linkedinUrl = userStore.user.linkedinUrl || ''
    form.value.twitterUrl = userStore.user.twitterUrl || ''
  }
})

const selectTemplate = (t: typeof templates[0]) => {
  if (t.isPro && !isPro.value) {
    // Prevent selection if locked
    return
  }
  form.value.publicTemplate = t.id
}

const save = async () => {
  saving.value = true
  try {
    const updatedUser = await fetchApi('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(form.value)
    })
    userStore.user = { ...userStore.user, ...updatedUser }
    toast.success("Settings saved!")
  } catch (err) {
    toast.error("Error saving settings")
  } finally {
    saving.value = false
  }
}

const copyLink = () => {
  if (!form.value.portalSlug) return
  const url = `${window.location.origin}/p/${form.value.portalSlug}`
  navigator.clipboard.writeText(url).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}

const handleUpgrade = async () => {
  upgrading.value = true
  try {
    const res = await fetchApi('/billing/checkout', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (err) {
    toast.error('Failed to initiate upgrade.')
  } finally {
    upgrading.value = false
  }
}
</script>

<template>
  <Card class="relative overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm">
    <CardHeader class="border-b border-border/40 pb-6">
      <CardTitle>Profile & Branding</CardTitle>
      <CardDescription>Customize how clients see your portal.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-10 pt-8">
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
            <Label class="text-base font-semibold">Interface Style</Label>
            <span v-if="!isPro" class="text-xs text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                Upgrade to unlock more themes
            </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="t in templates" 
            :key="t.id"
            @click="selectTemplate(t)"
            class="group relative flex flex-col gap-3"
            :class="[t.isPro && !isPro ? 'cursor-not-allowed opacity-70' : 'cursor-pointer']"
          >
            <div 
              class="relative w-full h-40 overflow-hidden transition-all duration-300 border-2 bg-zinc-50/50 dark:bg-zinc-900/50"
              :class="[
                form.publicTemplate === t.id 
                  ? `ring-2 ring-offset-2 ${activeColor?.ring} border-transparent scale-[1.02]` 
                  : 'border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-lg',
                t.isPro && !isPro ? 'grayscale-[0.5]' : ''
              ]"
              style="border-radius: 16px;" 
            >
               <div class="absolute inset-0 pointer-events-none p-3 flex flex-col" :class="t.containerClass">
                  <div v-if="t.id !== 'corporate'" :class="[t.headerClass, activeColor?.hex]"></div>
                  
                  <div class="flex gap-2 items-start relative z-10" :class="t.id === 'corporate' ? 'justify-center mt-2' : '-mt-4 px-2'">
                      <div class="h-8 w-8 bg-zinc-100 shrink-0 flex items-center justify-center text-[10px] font-bold text-zinc-400" :class="t.avatarClass">
                        A
                      </div>
                      <div v-if="t.id !== 'corporate'" class="space-y-1 pt-5 w-full">
                          <div class="h-1.5 w-12 bg-zinc-800 rounded-full opacity-20"></div>
                          <div class="h-1 w-8 bg-zinc-400 rounded-full opacity-20"></div>
                      </div>
                  </div>

                  <div :class="t.cardBodyClass">
                      <div v-if="t.id === 'corporate'" class="flex flex-col items-center gap-1 mb-2">
                           <div class="h-1 w-16 bg-zinc-900 rounded-full opacity-80"></div>
                           <div class="h-0.5 w-8 bg-zinc-400 rounded-full opacity-50"></div>
                      </div>
                      <div class="space-y-1.5 opacity-30">
                          <div class="h-1 w-full bg-zinc-400 rounded-full"></div>
                          <div class="h-1 w-2/3 bg-zinc-400 rounded-full"></div>
                      </div>
                  </div>

                  <div class="mt-auto flex justify-end">
                      <div class="flex items-center justify-center text-white" :class="[t.buttonClass, activeColor?.hex]">
                          Login
                      </div>
                  </div>
               </div>

               <div v-if="form.publicTemplate === t.id" class="absolute top-3 right-3 z-20 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full p-1 shadow-sm">
                  <Check class="h-3 w-3" />
               </div>

               <div v-if="t.isPro && !isPro" class="absolute inset-0 z-30 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-[1px]">
                  <div @click.stop="handleUpgrade" class="bg-white dark:bg-zinc-900 text-foreground px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold border hover:scale-105 transition-transform cursor-pointer">
                      <Lock class="h-3 w-3 text-indigo-500" />
                      <span>PRO</span>
                  </div>
               </div>
            </div>
            
            <div class="space-y-0.5 px-1">
                <div class="flex items-center justify-between">
                    <h4 class="font-bold text-sm text-foreground flex items-center gap-2">
                        {{ t.name }}
                        <Sparkles v-if="t.isPro" class="h-3 w-3 text-indigo-500" />
                    </h4>
                </div>
                <p class="text-xs text-muted-foreground">{{ t.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div class="grid gap-8 sm:grid-cols-2">
        <div class="space-y-3">
          <Label>Portal Link</Label>
          <div class="flex items-center gap-2">
            <div class="flex flex-1 rounded-md shadow-sm">
               <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted/50 text-muted-foreground text-sm font-medium">/p/</span>
              <Input v-model="form.portalSlug" placeholder="agency-name" class="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-background" />
            </div>
            <Button variant="outline" size="icon" @click="copyLink" :title="copied ? 'Copied' : 'Copy'">
              <Check v-if="copied" class="h-4 w-4 text-green-600" />
              <Copy v-else class="h-4 w-4" />
            </Button>
          </div>
          <p class="text-[11px] text-muted-foreground">This is the unique URL your clients will visit.</p>
        </div>

        <div class="space-y-3 relative">
          <div class="flex items-center justify-between">
            <Label :class="{'text-muted-foreground': !isPro}">Accent Color</Label>
            <span v-if="!isPro" class="text-[10px] font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock class="h-2.5 w-2.5" /> PRO
            </span>
          </div>
          
          <div class="flex gap-3 transition-opacity" :class="{ 'opacity-40 pointer-events-none select-none': !isPro }">
            <button v-for="color in colors" :key="color.name" 
              @click="form.accentColor = color.name" 
              class="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="[color.hex, form.accentColor === color.name ? `ring-2 ring-offset-2 ${color.ring}` : 'ring-1 ring-black/5']"
            ></button>
          </div>

          <div v-if="!isPro" class="mt-2 text-[11px] text-muted-foreground">
              <span class="cursor-pointer font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1" @click="handleUpgrade">
                 <Loader2 v-if="upgrading" class="h-2.5 w-2.5 animate-spin" />
                 Upgrade to unlock branding
              </span>
          </div>
        </div>
      </div>

      <Separator />

      <div class="space-y-5">
        <div class="space-y-2">
          <Label>Headline</Label>
          <Input v-model="form.headline" placeholder="e.g. Senior Full Stack Developer" class="bg-background" />
        </div>
        <div class="space-y-2">
          <Label>About / Bio</Label>
          <Textarea v-model="form.bio" placeholder="Tell your clients a bit about yourself..." rows="4" class="resize-none bg-background" />
        </div>
        <div class="grid gap-5 sm:grid-cols-3">
            <div class="space-y-2"><Label>Website</Label><Input v-model="form.websiteUrl" placeholder="https://" class="bg-background" /></div>
            <div class="space-y-2"><Label>LinkedIn</Label><Input v-model="form.linkedinUrl" placeholder="https://" class="bg-background" /></div>
            <div class="space-y-2"><Label>Twitter</Label><Input v-model="form.twitterUrl" placeholder="https://" class="bg-background" /></div>
        </div>
      </div>

    </CardContent>

    <CardFooter class="border-t border-border/40 pt-6 flex justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
      <div class="text-xs text-muted-foreground">
        Changes reflect immediately on your public portal.
      </div>
      <Button @click="save" :disabled="saving">
        <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </Button>
    </CardFooter>
  </Card>
</template>
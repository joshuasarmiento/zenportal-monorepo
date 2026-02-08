<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Lock, Copy, Check, Loader2, Sparkles, Paintbrush } from 'lucide-vue-next'
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

const isPro = computed(() => userStore.isPro)

const templates = [
  { 
    id: 'modern', 
    name: 'Zen (Modern)', 
    desc: 'Soft glass, gradients, fluid.', 
    isPro: false,
    containerClass: 'rounded-2xl border border-zinc-200/50 shadow-sm font-sans bg-zinc-50/50',
    headerClass: 'h-10 w-full rounded-t-2xl opacity-20 backdrop-blur-md',
    avatarClass: 'rounded-xl ring-2 ring-white/50 bg-white shadow-sm',
    buttonClass: 'rounded-full shadow-sm text-[8px] px-3 font-medium',
    cardBodyClass: 'bg-white/40 backdrop-blur-sm m-2 rounded-xl border border-white/50'
  },
  { 
    id: 'corporate', 
    name: 'Executive (Editorial)', 
    desc: 'Serif, sharp, minimal.', 
    isPro: true,
    containerClass: 'rounded-none border border-border bg-[#F9F9F9] font-serif',
    headerClass: 'hidden', 
    avatarClass: 'rounded-none border-2 border-white -mb-3 z-10 bg-white shadow-sm',
    buttonClass: 'rounded-none uppercase text-[7px] tracking-widest font-bold px-3 py-1.5',
    cardBodyClass: 'bg-white border-t-2 border-muted shadow-md mx-2 mt-4 mb-2 p-2'
  },
  { 
    id: 'creative', 
    name: 'Pop (Neo-Brutalism)', 
    desc: 'High contrast, bold borders.', 
    isPro: true,
    containerClass: 'rounded-lg border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-mono',
    headerClass: 'h-8 w-full border-b-2 border-black opacity-20',
    avatarClass: 'rounded-md border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    buttonClass: 'rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-bold text-[8px]',
    cardBodyClass: 'bg-transparent p-2'
  }
]

const colors = [
  { name: 'indigo', hex: 'bg-indigo-600', ring: 'ring-indigo-600' },
  { name: 'blue', hex: 'bg-blue-600', ring: 'ring-blue-600' },
  { name: 'emerald', hex: 'bg-emerald-600', ring: 'ring-emerald-600' },
  { name: 'rose', hex: 'bg-rose-600', ring: 'ring-rose-600' },
  { name: 'gray', hex: 'bg-zinc-900', ring: 'ring-zinc-900' }
]

const activeColor = computed(() => {
    return colors.find(c => c.name === form.value.accentColor) || colors[0]
})

onMounted(async () => {
  if (!userStore.user) await userStore.fetchUser()
  if (userStore.user) {
    const u = userStore.user as any
    form.value = {
      portalSlug: u.portalSlug || '',
      accentColor: u.accentColor || 'indigo',
      publicTemplate: u.publicTemplate || 'modern',
      headline: u.headline || '',
      bio: u.bio || '',
      websiteUrl: u.websiteUrl || '',
      linkedinUrl: u.linkedinUrl || '',
      twitterUrl: u.twitterUrl || ''
    }
  }
})

const selectTemplate = (t: typeof templates[0]) => {
  if (t.isPro && !isPro.value) return
  form.value.publicTemplate = t.id
}

const save = async () => {
  saving.value = true
  try {
    await fetchApi('/user/me', {
      method: 'PATCH',
      body: JSON.stringify(form.value)
    })
    await userStore.fetchUser(true)
    toast.success('Branding updated successfully!')
  } catch (err: any) {
    toast.error(err.message || 'Failed to save changes')
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

import { useRouter } from 'vue-router'
const router = useRouter()

const handleUpgrade = () => {
  router.push('/settings/billing')
}
</script>

<template>
  <Card class="relative overflow-hidden border border-border bg-card shadow-sm">
    <CardHeader class="border-b border-border pb-6">
      <div class="flex items-center gap-2 mb-1">
         <div class="p-2 bg-muted rounded-lg">
            <Paintbrush class="h-4 w-4 text-foreground" />
         </div>
         <CardTitle class="text-lg font-bold text-foreground tracking-tight">Profile & Branding</CardTitle>
      </div>
      <CardDescription class="text-muted-foreground">Customize how clients see your portal.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-10 pt-8">
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
            <Label class="text-sm font-bold uppercase tracking-widest text-muted-foreground">Interface Style</Label>
            <span v-if="!isPro" class="text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                Upgrade to unlock styles
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
              class="relative w-full h-44 overflow-hidden transition-all duration-300 border-2 bg-muted/20"
              :class="[
                form.publicTemplate === t.id 
                  ? `ring-2 ring-offset-2 ${activeColor?.ring} border-transparent dark:ring-offset-zinc-950` 
                  : 'border-border hover:border-foreground/20 hover:shadow-lg',
                t.isPro && !isPro ? 'grayscale-[0.5]' : ''
              ]"
              style="border-radius: 16px;" 
            >
               <div class="absolute inset-0 pointer-events-none p-4 flex flex-col" :class="t.containerClass">
                  <div v-if="t.id !== 'corporate'" :class="[t.headerClass, activeColor?.hex]"></div>
                  
                  <div class="flex gap-2 items-start relative z-10" :class="t.id === 'corporate' ? 'justify-center mt-2' : '-mt-4 px-2'">
                      <div class="h-8 w-8 bg-zinc-100 shrink-0 flex items-center justify-center text-[10px] font-bold text-zinc-400" :class="t.avatarClass">
                        A
                      </div>
                      <div v-if="t.id !== 'corporate'" class="space-y-1 pt-5 w-full">
                          <div class="h-1.5 w-12 bg-zinc-800 rounded-full opacity-10"></div>
                          <div class="h-1 w-8 bg-zinc-400 rounded-full opacity-10"></div>
                      </div>
                  </div>

                  <div :class="t.cardBodyClass">
                      <div v-if="t.id === 'corporate'" class="flex flex-col items-center gap-1 mb-2">
                           <div class="h-1 w-16 bg-zinc-900 rounded-full opacity-80"></div>
                           <div class="h-0.5 w-8 bg-zinc-400 rounded-full opacity-50"></div>
                      </div>
                      <div class="space-y-1.5 opacity-20">
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

               <div v-if="form.publicTemplate === t.id" class="absolute top-3 right-3 z-20 bg-foreground text-background rounded-full p-1 shadow-md">
                  <Check class="h-3 w-3" />
               </div>

               <div v-if="t.isPro && !isPro" class="absolute inset-0 z-30 flex items-center justify-center bg-white/40 dark:bg-black/60 backdrop-blur-[2px]">
                  <div @click.stop="handleUpgrade" class="bg-card text-foreground px-3 py-1.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold border border-border hover:scale-105 transition-transform cursor-pointer">
                      <Lock class="h-3 w-3 text-indigo-500" />
                      <span>Unlock</span>
                  </div>
               </div>
            </div>
            
            <div class="px-1">
                <div class="flex items-center justify-between">
                    <h4 class="font-bold text-sm text-foreground flex items-center gap-2">
                        {{ t.name }}
                        <Sparkles v-if="t.isPro" class="h-3 w-3 text-indigo-500 fill-indigo-500" />
                    </h4>
                </div>
                <p class="text-xs text-muted-foreground">{{ t.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator class="bg-border" />

      <div class="grid gap-8 sm:grid-cols-2">
        <div class="space-y-3">
          <Label class="text-sm font-semibold">Portal Link</Label>
          <div class="flex items-center gap-2">
            <div class="flex flex-1 rounded-lg shadow-sm border border-border bg-muted/50 overflow-hidden">
               <span class="inline-flex items-center px-3 border-r border-border bg-muted text-muted-foreground text-sm font-mono">/p/</span>
              <Input v-model="form.portalSlug" placeholder="agency-name" class="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-10 font-medium" />
            </div>
            <Button variant="outline" size="icon" @click="copyLink" :title="copied ? 'Copied' : 'Copy'" class="rounded-lg border-border">
              <Check v-if="copied" class="h-4 w-4 text-green-600" />
              <Copy v-else class="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <p class="text-[11px] text-muted-foreground">This is the unique URL your clients will visit.</p>
        </div>

        <div class="space-y-3 relative">
          <div class="flex items-center justify-between">
            <Label class="text-sm font-semibold" :class="{'text-muted-foreground': !isPro}">Accent Color</Label>
            <span v-if="!isPro" class="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1 border border-border">
                <Lock class="h-2.5 w-2.5" /> PRO
            </span>
          </div>
          
          <div class="flex gap-3 transition-opacity" :class="{ 'opacity-40 pointer-events-none select-none': !isPro }">
            <button v-for="color in colors" :key="color.name" 
              @click="form.accentColor = color.name" 
              class="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 shadow-sm border border-black/5 dark:border-white/10"
              :class="[color.hex, form.accentColor === color.name ? `ring-2 ring-offset-2 ${color.ring}` : '']"
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

      <Separator class="bg-border" />

      <div class="space-y-6">
        <div class="space-y-2">
          <Label class="text-sm font-semibold">Headline</Label>
          <Input v-model="form.headline" placeholder="e.g. Senior Full Stack Developer" class="bg-muted/30 border-border rounded-lg h-10" />
        </div>
        <div class="space-y-2">
          <Label class="text-sm font-semibold">About / Bio</Label>
          <Textarea v-model="form.bio" placeholder="Tell your clients a bit about yourself..." rows="4" class="resize-none bg-muted/30 border-border rounded-lg" />
        </div>
        <div class="grid gap-6 sm:grid-cols-3">
            <div class="space-y-2"><Label class="text-sm font-semibold">Website</Label><Input v-model="form.websiteUrl" placeholder="https://" class="bg-muted/30 border-border rounded-lg" /></div>
            <div class="space-y-2"><Label class="text-sm font-semibold">LinkedIn</Label><Input v-model="form.linkedinUrl" placeholder="https://" class="bg-muted/30 border-border rounded-lg" /></div>
            <div class="space-y-2"><Label class="text-sm font-semibold">Twitter</Label><Input v-model="form.twitterUrl" placeholder="https://" class="bg-muted/30 border-border rounded-lg" /></div>
        </div>
      </div>

    </CardContent>

    <CardFooter class="border-t border-border pt-6 flex justify-between bg-muted/50">
      <div class="text-xs text-muted-foreground font-medium">
        Changes reflect immediately.
      </div>
      <Button @click="save" :disabled="saving" class="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 font-bold shadow-sm">
        <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </Button>
    </CardFooter>
  </Card>
</template>
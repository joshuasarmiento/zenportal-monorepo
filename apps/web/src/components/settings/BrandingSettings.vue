<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Lock, Copy, Check, Loader2 } from 'lucide-vue-next'

const { fetchApi } = useApi()
const userStore = useUserStore()
const saving = ref(false)
const copied = ref(false)

const form = ref({
  portalSlug: '',
  accentColor: 'indigo'
})

const colors = [
  { name: 'indigo', hex: 'bg-indigo-600', ring: 'ring-indigo-600' },
  { name: 'blue', hex: 'bg-blue-600', ring: 'ring-blue-600' },
  { name: 'emerald', hex: 'bg-emerald-600', ring: 'ring-emerald-600' },
  { name: 'rose', hex: 'bg-rose-600', ring: 'ring-rose-600' },
  { name: 'gray', hex: 'bg-gray-900', ring: 'ring-gray-900' }
]

const isPro = computed(() => userStore.user?.tier === 'pro')

onMounted(async () => {
  await userStore.fetchUser()
  if (userStore.user) {
    form.value.portalSlug = userStore.user.portalSlug || ''
    form.value.accentColor = userStore.user.accentColor || 'indigo'
  }
})

const save = async () => {
  saving.value = true
  try {
    const updatedUser = await fetchApi('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(form.value)
    })
    userStore.user = { ...userStore.user, ...updatedUser }
    alert('Branding saved!')
  } catch (err) {
    alert('Error saving settings')
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
</script>

<template>
  <Card class="relative overflow-hidden">
    
    <div v-if="!isPro"
      class="absolute inset-0 bg-white/60 dark:bg-background/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
      <div class="bg-white dark:bg-card p-6 rounded-xl shadow-xl border border-blue-100 dark:border-border max-w-sm">
        <div class="bg-blue-100 dark:bg-primary/10 text-blue-600 dark:text-primary rounded-full flex items-center justify-center mx-auto mb-4 w-12 h-12">
          <Lock class="h-6 w-6" />
        </div>
        <h3 class="text-lg font-bold text-foreground mb-2">Unlock Branding</h3>
        <p class="text-sm text-muted-foreground mb-6">Use your own logo and colors with Agency Pro.</p>
        <Button class="w-full">
          Upgrade for $12/mo
        </Button>
      </div>
    </div>

    <CardHeader class="border-b border-border pb-6">
      <CardTitle>Portal Appearance</CardTitle>
      <CardDescription>Customize how clients see your work logs.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-6 pt-6">
      <div class="space-y-2">
        <Label>Portal Link</Label>
        <div class="flex items-center gap-2">
          <div class="flex flex-1 rounded-md shadow-sm">
             <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
              portal.app/
            </span>
            <Input 
              v-model="form.portalSlug" 
              placeholder="your-agency"
              :disabled="!isPro"
              class="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0 relative"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            @click="copyLink" 
            :disabled="!isPro || !form.portalSlug"
            :title="copied ? 'Copied!' : 'Copy Link'"
          >
            <Check v-if="copied" class="h-4 w-4 text-green-600 dark:text-green-400" />
            <Copy v-else class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div class="space-y-3">
        <Label>Accent Color</Label>
        <div class="flex gap-3">
          <button v-for="color in colors" :key="color.name" 
            @click="form.accentColor = color.name" 
            :disabled="!isPro"
            class="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed"
            :class="[
              color.hex,
              form.accentColor === color.name ? `ring-2 ring-offset-2 ${color.ring}` : ''
            ]"
          ></button>
        </div>
      </div>
    </CardContent>

    <CardFooter class="border-t border-border pt-6 flex justify-end">
      <Button @click="save" :disabled="saving || !isPro">
        <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </Button>
    </CardFooter>
  </Card>
</template>
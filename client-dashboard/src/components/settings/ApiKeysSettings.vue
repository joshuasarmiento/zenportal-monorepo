<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApi } from '@/lib/api'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, Copy, Check, KeyRound, AlertTriangle, Sparkles, Lock } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { fetchApi } = useApi()
const userStore = useUserStore()
const generating = ref(false)
const upgrading = ref(false)

const copiedKey = ref<'read' | 'write' | null>(null)

const isPro = computed(() => userStore.isPro)

const readKey = computed(() => (userStore.user as any)?.apiKeyRead)
const writeKey = computed(() => (userStore.user as any)?.apiKeyWrite)

const generateKeys = async () => {
  generating.value = true
  try {
    await fetchApi('/user/api-key', { method: 'POST' })
    await userStore.fetchUser(true) 
    toast.success('API Keys generated successfully!')
  } catch (err: any) {
    toast.error(err.message || 'Failed to generate keys')
  } finally {
    generating.value = false
  }
}

const copyToClipboard = (keyType: 'read' | 'write') => {
  const key = keyType === 'read' ? readKey.value : writeKey.value
  if (!key) return

  navigator.clipboard.writeText(key)
  copiedKey.value = keyType
  toast.success(`API ${keyType} key copied.`)
  setTimeout(() => { copiedKey.value = null }, 2000)
}

const handleUpgrade = async () => {
  upgrading.value = true
  try {
    const res = await fetchApi('/api/billing/subscribe', { method: 'POST' })
    const session = res.data
    if (session?.attributes?.checkout_url) {
      window.location.href = session.attributes.checkout_url;
    }
  } catch (err: any) {
    toast.error('Failed to start upgrade.', { description: err.message })
  } finally {
    upgrading.value = false
  }
}
</script>

<template>
  <Card class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
    <CardHeader class="border-b border-zinc-100 dark:border-zinc-800 pb-6">
      <CardTitle class="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
        <div class="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
           <KeyRound class="h-4 w-4" />
        </div>
        API Access
      </CardTitle>
      <CardDescription class="text-zinc-500">
        Generate keys for programmatic access.
      </CardDescription>
    </CardHeader>
    <CardContent class="pt-8 space-y-8">

      <Alert v-if="isPro" variant="destructive" class="border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-800/30 dark:bg-orange-900/10 dark:text-orange-200 [&>svg]:text-orange-600">
        <AlertTriangle class="h-4 w-4" />
        <AlertTitle class="font-bold tracking-tight">Security Warning</AlertTitle>
        <AlertDescription class="text-orange-800 dark:text-orange-300/80 text-sm">
          Treat your API keys like passwords. Do not share them publicly.
        </AlertDescription>
      </Alert>

      <div v-if="!isPro" class="text-center bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-10 rounded-2xl">
          <div class="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
            <Lock class="h-6 w-6" />
          </div>
          <h3 class="font-bold text-lg mb-2 text-zinc-900 dark:text-white">API Access is a Pro Feature</h3>
          <p class="text-zinc-500 text-sm mb-8 max-w-xs mx-auto">Upgrade to Agency Pro to generate API keys and build custom integrations.</p>
          <Button @click="handleUpgrade" :disabled="upgrading" class="rounded-full font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
            <Loader2 v-if="upgrading" class="h-4 w-4 mr-2 animate-spin" />
            <Sparkles v-else class="h-4 w-4 mr-2" />
            {{ upgrading ? 'Redirecting...' : 'Upgrade Now' }}
          </Button>
      </div>
      
      <div v-else-if="readKey || writeKey" class="space-y-6">
        <div class="space-y-3">
          <Label class="text-sm font-semibold">Read-Only Key</Label>
          <div class="flex items-center gap-2">
            <Input :model-value="readKey" readonly class="font-mono text-xs bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 h-10 text-zinc-600 dark:text-zinc-400" />
            <Button variant="outline" size="icon" @click="copyToClipboard('read')" class="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <Check v-if="copiedKey === 'read'" class="h-4 w-4 text-green-600" />
              <Copy v-else class="h-4 w-4 text-zinc-500" />
            </Button>
          </div>
          <p class="text-[11px] text-zinc-400">Use this key to fetch data (GET requests).</p>
        </div>
        <div class="space-y-3">
          <Label class="text-sm font-semibold">Write-Access Key</Label>
          <div class="flex items-center gap-2">
            <Input :model-value="writeKey" readonly class="font-mono text-xs bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 h-10 text-zinc-600 dark:text-zinc-400" />
            <Button variant="outline" size="icon" @click="copyToClipboard('write')" class="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <Check v-if="copiedKey === 'write'" class="h-4 w-4 text-green-600" />
              <Copy v-else class="h-4 w-4 text-zinc-500" />
            </Button>
          </div>
          <p class="text-[11px] text-zinc-400">Use this key to modify data (POST/PATCH/DELETE).</p>
        </div>
      </div>
    </CardContent>

    <CardFooter v-if="isPro" class="border-t border-zinc-100 dark:border-zinc-800 pt-6 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
      <p class="text-xs text-zinc-500 font-medium">
        Generating new keys invalidates old ones.
      </p>
      <Button variant="outline" class="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20" @click="generateKeys" :disabled="generating">
        <Loader2 v-if="generating" class="mr-2 h-4 w-4 animate-spin" />
        Regenerate Keys
      </Button>
    </CardFooter>

  </Card>
</template>
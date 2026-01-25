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

const isPro = computed(() => userStore.user?.tier === 'pro')
const readKey = computed(() => userStore.user?.apiKeyRead)
const writeKey = computed(() => userStore.user?.apiKeyWrite)

const generateKeys = async () => {
  generating.value = true
  try {
    const newKeys = await fetchApi('/auth/api-key', { method: 'POST' })
    // The user object in the store is now stale, so we force a refetch.
    await userStore.fetchUser(true) 
    toast.success('API Keys generated successfully!')
  } catch (err: any) {
    toast.error('Failed to generate keys', { description: err.message })
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
    const res = await fetchApi('/billing/checkout', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (err) {
    toast.error('Failed to start upgrade.')
  } finally {
    upgrading.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader class="border-b border-border pb-6">
      <CardTitle class="flex items-center gap-2">
        <KeyRound class="h-5 w-5" />
        API Access
      </CardTitle>
      <CardDescription>
        Generate and manage API keys for programmatic access to your data.
      </CardDescription>
    </CardHeader>
    <CardContent class="pt-6 space-y-8">

      <Alert v-if="isPro" variant="destructive" class="border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-200 [&>svg]:text-orange-500">
        <AlertTriangle class="h-4 w-4" />
        <AlertTitle class="font-bold">Security Warning</AlertTitle>
        <AlertDescription class="text-orange-800 dark:text-orange-300">
          Treat your API keys like passwords. Do not share them publicly or commit them to version control.
        </AlertDescription>
      </Alert>

      <div v-if="!isPro" class="text-center bg-muted/50 p-8 rounded-lg">
          <div class="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
            <Lock class="h-6 w-6" />
          </div>
          <h3 class="font-bold text-lg mb-2">API Access is a Pro Feature</h3>
          <p class="text-muted-foreground text-sm mb-6">Upgrade to Agency Pro to generate API keys and build custom integrations.</p>
          <Button @click="handleUpgrade" :disabled="upgrading">
            <Loader2 v-if="upgrading" class="h-4 w-4 mr-2 animate-spin" />
            <Sparkles v-else class="h-4 w-4 mr-2" />
            {{ upgrading ? 'Redirecting...' : 'Upgrade Now' }}
          </Button>
      </div>
      
      <div v-else-if="readKey || writeKey" class="space-y-6">
        <div class="space-y-2">
          <Label>Read-Only Key</Label>
          <div class="flex items-center gap-2">
            <Input :model-value="readKey" readonly class="font-mono bg-muted/50" />
            <Button variant="outline" size="icon" @click="copyToClipboard('read')">
              <Check v-if="copiedKey === 'read'" class="h-4 w-4 text-green-600" />
              <Copy v-else class="h-4 w-4" />
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">Use this key to fetch data from the API (e.g., get all logs).</p>
        </div>
        <div class="space-y-2">
          <Label>Write-Access Key</Label>
          <div class="flex items-center gap-2">
            <Input :model-value="writeKey" readonly class="font-mono bg-muted/50" />
            <Button variant="outline" size="icon" @click="copyToClipboard('write')">
              <Check v-if="copiedKey === 'write'" class="h-4 w-4 text-green-600" />
              <Copy v-else class="h-4 w-4" />
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">Use this key to create or modify data (e.g., create a new log).</p>
        </div>
      </div>
    </CardContent>

    <CardFooter v-if="isPro" class="border-t border-border pt-6 flex items-center justify-between bg-muted/30">
      <p class="text-sm text-muted-foreground">
        Generating new keys will invalidate the old ones.
      </p>
      <Button variant="destructive" @click="generateKeys" :disabled="generating">
        <Loader2 v-if="generating" class="mr-2 h-4 w-4 animate-spin" />
        Generate Keys
      </Button>
    </CardFooter>

  </Card>
</template>
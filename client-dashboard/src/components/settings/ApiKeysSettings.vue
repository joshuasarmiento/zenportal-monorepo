<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApi } from '@/lib/api'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Copy, Check, KeyRound, AlertTriangle, Sparkles, Lock, RefreshCw, EyeOff } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { fetchApi } = useApi()
const userStore = useUserStore()
const generating = ref(false)
const upgrading = ref(false)
const showNewKeysDialog = ref(false)

const copiedKey = ref<'read' | 'write' | null>(null)
const isPro = computed(() => userStore.isPro)

const newKeys = ref<{ apiKeyRead: string, apiKeyWrite: string } | null>(null)

const hasExistingKeys = computed(() => {
  return !!(userStore.user as any)?.apiKeyRead
})

const generateKeys = async () => {
  generating.value = true
  newKeys.value = null // Reset
  try {
    const res = await fetchApi('/user/api-key', { method: 'POST' })
    newKeys.value = res
    showNewKeysDialog.value = true // Open Modal
    
    toast.success('API Keys generated successfully!')
  } catch (err: any) {
    toast.error(err.message || 'Failed to generate keys')
  } finally {
    generating.value = false
  }
}

const copyToClipboard = (keyType: 'read' | 'write') => {
  if (!newKeys.value) return
  
  const key = keyType === 'read' ? newKeys.value.apiKeyRead : newKeys.value.apiKeyWrite
  if (!key) return

  navigator.clipboard.writeText(key)
  copiedKey.value = keyType
  toast.success(`API ${keyType} key copied.`)
  setTimeout(() => { copiedKey.value = null }, 2000)
}

import { useRouter } from 'vue-router'
const router = useRouter()

const handleUpgrade = () => {
  router.push('/settings/billing')
}
</script>

<template>
  <Card class="border border-border bg-card shadow-sm">
    <CardHeader class="border-b border-border pb-6">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
           <CardTitle class="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
            <div class="p-2 bg-muted rounded-lg">
               <KeyRound class="h-4 w-4" />
            </div>
            API Access
          </CardTitle>
          <CardDescription class="text-muted-foreground">
            Manage programmatic access to your ZenPortal workspace.
          </CardDescription>
        </div>
        <Button v-if="isPro" variant="outline" size="sm" @click="generateKeys" :disabled="generating" class="border-border">
           <RefreshCw v-if="generating" class="h-3.5 w-3.5 mr-2 animate-spin" />
           <KeyRound v-else class="h-3.5 w-3.5 mr-2" />
           {{ hasExistingKeys ? 'Roll Keys' : 'Generate Keys' }}
        </Button>
      </div>
    </CardHeader>
    
    <CardContent class="pt-8">
      
      <!-- PRO UPGRADE WALL -->
      <!-- PRO UPGRADE WALL -->
      <div v-if="!isPro" class="text-center bg-muted/50 border border-border p-10 rounded-2xl">
          <div class="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
            <Lock class="h-6 w-6" />
          </div>
          <h3 class="font-bold text-lg mb-2 text-foreground">API Access is a Pro Feature</h3>
          <p class="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">Upgrade to Agency Pro to generate API keys and build custom integrations.</p>
          <Button @click="handleUpgrade" :disabled="upgrading" class="rounded-full font-bold bg-primary text-primary-foreground">
            <Loader2 v-if="upgrading" class="h-4 w-4 mr-2 animate-spin" />
            <Sparkles v-else class="h-4 w-4 mr-2" />
            {{ upgrading ? 'Redirecting...' : 'Upgrade Now' }}
          </Button>
      </div>

      <!-- EXISTING KEYS VIEW -->
      <div v-else-if="hasExistingKeys" class="space-y-6">
        <Alert class="border-blue-100 bg-blue-50 text-blue-900 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-200">
          <AlertTitle class="font-semibold text-sm flex items-center gap-2">
            <Check class="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Active API Keys
          </AlertTitle>
          <AlertDescription class="text-xs text-blue-800 dark:text-blue-300/80 mt-1">
            Your API keys are active. To prevent abuse, we only show the full key once upon generation.
          </AlertDescription>
        </Alert>

        <div class="grid gap-6 md:grid-cols-2">
            <div class="space-y-2">
                <Label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Read-Only Key</Label>
                <div class="relative">
                    <Input value="zen_read_••••••••••••••••••••" readonly disabled class="font-mono text-sm bg-muted/50" />
                    <EyeOff class="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                </div>
            </div>
             <div class="space-y-2">
                <Label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Write-Access Key</Label>
                <div class="relative">
                    <Input value="zen_write_••••••••••••••••••••" readonly disabled class="font-mono text-sm bg-muted/50" />
                     <EyeOff class="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                </div>
            </div>
        </div>
        
        <p class="text-xs text-muted-foreground pt-4 border-t border-border">
            Need to rotate your keys? Click <strong>Roll Keys</strong> above. This will immediately invalidate existing keys.
        </p>
      </div>

      <!-- EMPTY STATE -->
      <div v-else class="text-center py-12 text-muted-foreground">
        <div class="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
             <KeyRound class="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 class="text-sm font-semibold text-foreground mb-1">No API Keys</h3>
        <p class="text-xs text-muted-foreground max-w-sm mx-auto">Generate keys to access the ZenPortal API programmatically.</p>
        <Button variant="link" @click="generateKeys" class="text-indigo-600 dark:text-indigo-400 mt-2">Generate First Key</Button>
      </div>

    </CardContent>
    
    <!-- NEW KEYS DIALOG -->
    <Dialog v-model:open="showNewKeysDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <div class="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md text-green-600">
                <Check class="h-4 w-4" />
            </div>
            API Keys Generated
          </DialogTitle>
          <DialogDescription>
            Please copy your keys now. They will <strong>not</strong> be shown again.
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="newKeys" class="space-y-4 py-4">
             <div class="space-y-2">
                <Label class="text-xs font-bold text-muted-foreground uppercase">Read-Only Key</Label>
                <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                        <Input :model-value="newKeys.apiKeyRead" readonly class="font-mono text-xs pr-10 bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800 text-zinc-600 dark:text-zinc-300" />
                    </div>
                    <Button size="icon" variant="outline" @click="copyToClipboard('read')" class="shrink-0">
                         <Check v-if="copiedKey === 'read'" class="h-4 w-4 text-green-600" />
                         <Copy v-else class="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div class="space-y-2">
                <Label class="text-xs font-bold text-muted-foreground uppercase">Write-Access Key</Label>
                <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                        <Input :model-value="newKeys.apiKeyWrite" readonly class="font-mono text-xs pr-10 bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800 text-zinc-600 dark:text-zinc-300" />
                    </div>
                    <Button size="icon" variant="outline" @click="copyToClipboard('write')" class="shrink-0">
                         <Check v-if="copiedKey === 'write'" class="h-4 w-4 text-green-600" />
                         <Copy v-else class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
            <Alert variant="destructive" class="mt-4 border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-900/30 dark:bg-orange-900/10">
                <AlertTriangle class="h-4 w-4 text-orange-600 mr-2" />
                <AlertDescription class="text-xs font-medium text-orange-800 dark:text-orange-200">
                    Store these securely. We cannot recover them if lost.
                </AlertDescription>
            </Alert>
        </div>

        <DialogFooter class="sm:justify-start">
          <Button type="button" variant="secondary" class="w-full" @click="showNewKeysDialog = false">
            I have stored my keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </Card>
</template>
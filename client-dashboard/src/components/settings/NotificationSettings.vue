<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Loader2, Eye, Calendar, Megaphone, BellRing } from 'lucide-vue-next'
import { toast } from 'vue-sonner' 

const { fetchApi } = useApi()
const userStore = useUserStore()
const saving = ref(false)

const settings = ref({
  notifyClientView: true,
  notifyWeeklyRecap: true,
  notifyMarketing: false
})

const syncSettings = () => {
    if (userStore.user) {
    const u = userStore.user as any
    // Map with explicit checks
    settings.value = {
        notifyClientView: !!(u.notifyClientView ?? true),
        notifyWeeklyRecap: !!(u.notifyWeeklyRecap ?? true),
        notifyMarketing: !!(u.notifyMarketing ?? false)
    }
  }
}

watch(() => userStore.user, syncSettings, { immediate: true })

onMounted(async () => {
  if (!userStore.user) await userStore.fetchUser()
  // syncSettings will be called by watch when userStore.user changes
})

const save = async () => {
  saving.value = true
  try {
    // Updated endpoint to /user/me to match your userRouter
    await fetchApi('/user/me', {
      method: 'PATCH',
      body: JSON.stringify(settings.value)
    })
    toast.success('Notification preferences saved!')
    await userStore.fetchUser(true)
  } catch (err: any) {
    toast.error('Failed to save settings')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader class="border-b border-border pb-6">
      <div class="flex items-center gap-2">
        <BellRing class="h-5 w-5 text-primary" />
        <CardTitle>Email Alerts</CardTitle>
      </div>
      <CardDescription>Control when ZenPortal sends you emails.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-6 pt-6">
      
      <div class="flex items-start justify-between space-x-4">
        <div class="flex gap-3 items-center">
          <div class="mt-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
            <Eye class="h-5 w-5" />
          </div>
          <div class="space-y-0.5">
            <Label class="text-base font-semibold">Client Views Report</Label>
            <p class="text-sm text-muted-foreground">
              Get an email notification the moment a client opens their magic link.
            </p>
          </div>
        </div>
        <Switch v-model="settings.notifyClientView" />
      </div>

      <div class="flex items-start justify-between space-x-4">
        <div class="flex gap-3 items-center">
          <div class="mt-1 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-green-600 dark:text-green-400">
            <Calendar class="h-5 w-5" />
          </div>
          <div class="space-y-0.5">
            <Label class="text-base font-semibold">Weekly Earnings Recap</Label>
            <p class="text-sm text-muted-foreground">
              Receive a summary of hours logged and total earnings every Sunday.
            </p>
          </div>
        </div>
        <Switch v-model="settings.notifyWeeklyRecap" />
      </div>

      <div class="flex items-start justify-between space-x-4">
        <div class="flex gap-3 items-center">
          <div class="mt-1 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-orange-600 dark:text-orange-400">
            <Megaphone class="h-5 w-5" />
          </div>
          <div class="space-y-0.5">
            <Label class="text-base font-semibold">Marketing & Tips</Label>
            <p class="text-sm text-muted-foreground">
              Occasional news about new features and freelance tips.
            </p>
          </div>
        </div>
        <Switch v-model="settings.notifyMarketing" />
      </div>

    </CardContent>
    
    <CardFooter class="border-t border-border pt-6 flex justify-end">
      <Button variant="default" @click="save" :disabled="saving">
        <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
        {{ saving ? 'Saving Preferences...' : 'Save Changes' }}
      </Button>
    </CardFooter>
  </Card>
</template>
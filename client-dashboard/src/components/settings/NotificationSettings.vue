<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Loader2, Eye, Calendar, Megaphone, BellRing, Mail } from 'lucide-vue-next'
import { toast } from 'vue-sonner' 

const { fetchApi } = useApi()
const userStore = useUserStore()
const saving = ref(false)

const settings = ref({
  notifyClientView: true,
  notifyClientOnLog: true,
  notifyWeeklyRecap: true,
  notifyMarketing: false
})

const syncSettings = () => {
    if (userStore.user) {
    const u = userStore.user as any
    settings.value = {
        notifyClientView: !!(u.notifyClientView ?? true),
        notifyClientOnLog: !!(u.notifyClientOnLog ?? true),
        notifyWeeklyRecap: !!(u.notifyWeeklyRecap ?? true),
        notifyMarketing: !!(u.notifyMarketing ?? false)
    }
  }
}

watch(() => userStore.user, syncSettings, { immediate: true })

onMounted(async () => {
  if (!userStore.user) await userStore.fetchUser()
})

const save = async () => {
  saving.value = true
  try {
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
  <Card class="border border-border bg-card shadow-sm">
    <CardHeader class="border-b border-border pb-6">
      <div class="flex items-center gap-2 mb-1">
        <div class="p-2 bg-muted rounded-lg">
           <BellRing class="h-4 w-4 text-foreground" />
        </div>
        <CardTitle class="text-lg font-bold text-foreground tracking-tight">Email Alerts</CardTitle>
      </div>
      <CardDescription class="text-muted-foreground">Control when ZenPortal sends you emails.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-8 pt-8">
      
      <div class="flex items-start justify-between space-x-4">
        <div class="flex gap-4 items-start">
          <div class="mt-0.5 bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
            <Eye class="h-5 w-5" />
          </div>
          <div class="space-y-1">
            <Label class="text-base font-semibold text-foreground">Client Views Report</Label>
            <p class="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Get notified when a client opens their magic link.
              <span class="text-xs text-muted-foreground/80 block mt-1">(Includes a 6-hour cooldown to prevent spam)</span>
            </p>
          </div>
        </div>
        <Switch v-model="settings.notifyClientView" />
      </div>

      <div class="flex items-start justify-between space-x-4">
        <div class="flex gap-4 items-start">
          <div class="mt-0.5 bg-violet-50 dark:bg-violet-900/20 p-2.5 rounded-xl text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
            <Mail class="h-5 w-5" />
          </div>
          <div class="space-y-1">
            <Label class="text-base font-semibold text-foreground">Email Clients on Log</Label>
            <p class="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Automatically send an email summary to clients when you add a new work log.
            </p>
          </div>
        </div>
        <Switch v-model="settings.notifyClientOnLog" />
      </div>

      <div class="flex items-start justify-between space-x-4">
        <div class="flex gap-4 items-start">
          <div class="mt-0.5 bg-green-50 dark:bg-green-900/20 p-2.5 rounded-xl text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800">
            <Calendar class="h-5 w-5" />
          </div>
          <div class="space-y-1">
            <Label class="text-base font-semibold text-foreground">Weekly Earnings Recap</Label>
            <p class="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Receive a summary of hours logged and total earnings every Sunday.
            </p>
          </div>
        </div>
        <Switch v-model="settings.notifyWeeklyRecap" />
      </div>

      <div class="flex items-start justify-between space-x-4">
        <div class="flex gap-4 items-start">
          <div class="mt-0.5 bg-orange-50 dark:bg-orange-900/20 p-2.5 rounded-xl text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800">
            <Megaphone class="h-5 w-5" />
          </div>
          <div class="space-y-1">
            <Label class="text-base font-semibold text-foreground">Marketing & Tips</Label>
            <p class="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Occasional news about new features and freelance tips.
            </p>
          </div>
        </div>
        <Switch v-model="settings.notifyMarketing" />
      </div>

    </CardContent>
    
    <CardFooter class="border-t border-border pt-6 flex justify-end bg-muted/50">
      <Button variant="default" @click="save" :disabled="saving" class="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 font-bold shadow-sm">
        <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
        {{ saving ? 'Saving Preferences...' : 'Save Changes' }}
      </Button>
    </CardFooter>
  </Card>
</template>
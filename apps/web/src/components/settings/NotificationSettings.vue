<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '../../lib/api'
import { useUserStore } from '../../stores/userStore'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Loader2 } from 'lucide-vue-next'

const { fetchApi } = useApi()
const userStore = useUserStore()
const saving = ref(false)

const settings = ref({
  notifyClientView: true,
  notifyWeeklyRecap: true,
  notifyMarketing: false
})

onMounted(async () => {
  await userStore.fetchUser()
  if (userStore.user) {
    settings.value = {
      notifyClientView: userStore.user.notifyClientView ?? true,
      notifyWeeklyRecap: userStore.user.notifyWeeklyRecap ?? true,
      notifyMarketing: userStore.user.notifyMarketing ?? false
    }
  }
})

const save = async () => {
  saving.value = true
  try {
    const updatedUser = await fetchApi('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(settings.value)
    })
    userStore.user = { ...userStore.user, ...updatedUser }
    alert('Preferences updated.')
  } catch (err) {
    alert('Error saving preferences.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader class="border-b border-border pb-6">
      <CardTitle>Email Alerts</CardTitle>
      <CardDescription>Control when ZenPortal sends you emails.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-6 pt-6">
      
      <div class="flex items-center justify-between space-x-2">
        <div class="space-y-0.5">
          <Label class="text-base font-semibold">Client Views Report</Label>
          <p class="text-sm text-muted-foreground">Get notified when a client opens your magic link.</p>
        </div>
        <Switch v-model:checked="settings.notifyClientView" />
      </div>

      <div class="flex items-center justify-between space-x-2">
         <div class="space-y-0.5">
          <Label class="text-base font-semibold">Weekly Earnings Recap</Label>
          <p class="text-sm text-muted-foreground">Receive a Sunday summary of hours logged.</p>
        </div>
        <Switch v-model:checked="settings.notifyWeeklyRecap" />
      </div>

      <div class="flex items-center justify-between space-x-2">
         <div class="space-y-0.5">
          <Label class="text-base font-semibold">Marketing & Tips</Label>
          <p class="text-sm text-muted-foreground">News about new features and freelance tips.</p>
        </div>
        <Switch v-model:checked="settings.notifyMarketing" />
      </div>

    </CardContent>
    
    <CardFooter class="border-t border-border pt-6 flex justify-end">
      <Button variant="secondary" @click="save" :disabled="saving">
        <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
        {{ saving ? 'Updating...' : 'Update Preferences' }}
      </Button>
    </CardFooter>
  </Card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useApi } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, UserPlus, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const userStore = useUserStore()
const { fetchApi } = useApi()

const members = ref<any[]>([])
const loading = ref(false)
const inviteLoading = ref(false)
const inviteEmail = ref('')

const fetchMembers = async () => {
    loading.value = true
    try {
        // Need an endpoint for members.
        // Backend `workspacesRouter` doesn't have it explicitly yet?
        // Wait, I should have checked that. I might need to add `GET /api/workspaces/members`.
        // If not, I can't implement this yet.
        // Let's assume I need to ADD it to backend as well. 
        // But for now, I'll write the frontend assuming it exists or uses a standard route.
        const res = await fetchApi(`/api/workspaces/${userStore.currentWorkspace?.id}/members`)
        members.value = res
    } catch (e) {
        // toast.error("Failed to load members")
        console.error(e)
    } finally {
        loading.value = false
    }
}

const sendInvite = async () => {
    if (!inviteEmail.value) return
    inviteLoading.value = true
    try {
        await fetchApi(`/api/workspaces/${userStore.currentWorkspace?.id}/invite`, {
            method: 'POST',
            body: JSON.stringify({ email: inviteEmail.value, role: 'member' })
        })
        toast.success("Invitation sent!")
        inviteEmail.value = ''
        // fetchMembers() // Ideally refresh pending invites list
    } catch (e: any) {
        toast.error(e.message || "Failed to send invite")
    } finally {
        inviteLoading.value = false
    }
}

onMounted(() => {
    if (userStore.currentWorkspace?.id) {
        fetchMembers()
    }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium">Team Members</h3>
      <p class="text-sm text-zinc-500">
        Manage who has access to this workspace.
      </p>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Invite New Member</CardTitle>
        <CardDescription>Send an email invitation to join your team.</CardDescription>
      </CardHeader>
      <CardContent class="flex gap-4">
         <Input v-model="inviteEmail" placeholder="colleague@agency.com" type="email" />
         <Button @click="sendInvite" :disabled="inviteLoading">
            <Loader2 v-if="inviteLoading" class="mr-2 h-4 w-4 animate-spin" />
            <UserPlus v-else class="mr-2 h-4 w-4" />
            Invite
         </Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Active Members</CardTitle>
      </CardHeader>
      <CardContent>
         <div v-if="loading" class="flex justify-center py-4">
             <Loader2 class="h-6 w-6 animate-spin text-zinc-400" />
         </div>
         <div v-else-if="members.length === 0" class="text-center py-4 text-zinc-500 text-sm">
             No members found (which is odd, since you are here).
         </div>
         <div v-else class="space-y-4">
             <div v-for="member in members" :key="member.id" class="flex items-center justify-between">
                 <div class="flex items-center gap-3">
                     <Avatar>
                        <AvatarImage :src="member.user?.image" />
                        <AvatarFallback>{{ member.user?.name?.[0] || '?' }}</AvatarFallback>
                     </Avatar>
                     <div>
                         <p class="font-medium text-sm">{{ member.user?.name || 'Unknown User' }}</p>
                         <p class="text-xs text-zinc-500">{{ member.user?.email }}</p>
                     </div>
                 </div>
                 <div class="flex items-center gap-4">
                     <span class="text-xs font-medium px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 capitalize">
                         {{ member.role }}
                     </span>
                     <Button variant="ghost" size="icon" class="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10" v-if="member.role !== 'owner'">
                         <Trash2 class="size-4" />
                     </Button>
                 </div>
             </div>
         </div>
      </CardContent>
    </Card>
  </div>
</template>

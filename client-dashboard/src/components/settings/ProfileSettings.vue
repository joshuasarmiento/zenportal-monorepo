<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { authClient } from '@/lib/auth-client'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'vue-sonner'
import { 
  Loader2, 
  User, 
  Lock, 
  Save, 
  Trash2,  
  KeyRound,
  Laptop,
  Smartphone,
  Globe,
  Monitor,
  LogOut
} from 'lucide-vue-next'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const userStore = useUserStore()
const isLoadingProfile = ref(false)
const isLoadingPassword = ref(false)
const isDeleting = ref(false)
const isDeleteDialogOpen = ref(false)
const deleteConfirmationStep = ref(1)
const deleteInput = ref('')

const form = ref({
    name: '',
    image: '',
    email: ''
})

const passForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const hasPassword = computed(() => {
    const accounts = (userStore.user as any)?.accounts || []
    return accounts.some((acc: any) => acc.type === 'credential' || acc.providerId === 'email')
})


const sessions = ref<any[]>([])
const isLoadingSessions = ref(false)

const loadSessions = async () => {
    isLoadingSessions.value = true
    try {
        const { data, error } = await authClient.listSessions()
        if (error) {
            console.error(error)
             // fallback or toast
        } else if (data) {
            sessions.value = data
        }
    } catch (e) {
        console.error("Failed to load sessions", e)
    } finally {
        isLoadingSessions.value = false
    }
}

const handleRevokeSession = async (token: string) => {
    try {
        const { error } = await authClient.revokeSession({
            token
        })
        
        if (!error) {
            toast.success("Session revoked")
            sessions.value = sessions.value.filter(s => s.token !== token)
        } else {
             toast.error("Failed to revoke session")
        }
    } catch (e) {
        toast.error("Error revoking session")
    }
}

onMounted(async () => {
    if (!userStore.user) await userStore.fetchUser()
    loadSessions()
    
    if (userStore.user) {
        form.value.name = userStore.user.name || ''
        form.value.image = userStore.user.image || ''
        form.value.email = userStore.user.email || ''
    }
})

const handleUpdateProfile = async () => {
    isLoadingProfile.value = true
    try {
        const { error } = await authClient.updateUser({
            name: form.value.name,
            image: form.value.image
        })

        if (error) {
            toast.error(error.message || "Failed to update profile")
        } else {
            toast.success("Profile updated successfully")
            await userStore.fetchUser(true)
        }
    } catch (e) {
        toast.error("An unexpected error occurred")
    } finally {
        isLoadingProfile.value = false
    }
}

const handleRequestSetPassword = async () => {
    if (passForm.value.newPassword !== passForm.value.confirmPassword) {
        toast.error("Passwords do not match")
        return
    }

    if (passForm.value.newPassword.length < 8) {
         toast.error("Password must be at least 8 characters")
         return
    }

    isLoadingPassword.value = true
    try {
        if (hasPassword.value) {
            // Change Password Flow
            const { error } = await authClient.changePassword({
                newPassword: passForm.value.newPassword,
                currentPassword: passForm.value.currentPassword,
                revokeOtherSessions: true
            })
            
            if (error) {
                toast.error(error.message || "Failed to change password")
            } else {
                toast.success("Password updated successfully")
                passForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
            }

        } else {
            // Set Password Flow (Trusted)
            // Since user is logged in via Google, we trust them to set a password directly.
            const sessionToken = localStorage.getItem('better-auth.session_token') || ''
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/set-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     // creds usually handled by cookie, but let's be safe if using Bearer
                     'Authorization': `Bearer ${sessionToken}` 
                },
                credentials: 'include',
                body: JSON.stringify({
                    password: passForm.value.newPassword
                })
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || "Failed to set password")
            } else {
                toast.success("Password set successfully")
                passForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
                await userStore.fetchUser(true)
            }
        }
    } catch (e) {
        toast.error("An unexpected error occurred")
    } finally {
        isLoadingPassword.value = false
    }
}


const handleDeleteAccount = () => {
    isDeleteDialogOpen.value = true
    deleteConfirmationStep.value = 1
    deleteInput.value = ''
}

const confirmDelete = async () => {
    if (deleteConfirmationStep.value === 1) {
        if (deleteInput.value.toLowerCase() === 'delete') {
            deleteConfirmationStep.value = 2
            deleteInput.value = ''
        } else {
            toast.error('Please type "delete" to continue')
        }
        return
    }

    if (deleteConfirmationStep.value === 2) {
        if (deleteInput.value.toLowerCase() === 'delete account') {
            await performDelete()
        } else {
            toast.error('Please type "delete account" to confirm')
        }
    }
}

const performDelete = async () => {
    isDeleting.value = true
    try {
        const { error } = await authClient.deleteUser()
        if (error) {
            toast.error(error.message || "Failed to delete account")
            isDeleteDialogOpen.value = false
        } else {
            toast.success("Account deleted. Goodbye!")
            window.location.href = '/login'
        }
    } catch (e) {
        toast.error("An unexpected error occurred")
        isDeleteDialogOpen.value = false
    } finally {
        isDeleting.value = false
    }
}

</script>

<template>
    <div class="space-y-8 max-w-4xl mx-auto pb-20">
        
        <Card class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <CardHeader class="border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div class="flex items-center gap-2 mb-1">
                    <div class="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                        <User class="h-4 w-4 text-zinc-900 dark:text-white" />
                    </div>
                    <CardTitle class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Personal Information</CardTitle>
                </div>
                <CardDescription class="text-zinc-500">Update your public identity on the portal.</CardDescription>
            </CardHeader>
            <CardContent class="pt-8">
                <form @submit.prevent="handleUpdateProfile" class="space-y-8">
                    <div class="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div class="relative group">
                            <Avatar class="h-24 w-24 border-4 border-zinc-50 dark:border-zinc-900 shadow-lg">
                                <AvatarImage :src="form.image" class="object-cover" />
                                <AvatarFallback class="text-2xl font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                    {{ userStore.initials }}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div class="flex-1 w-full space-y-2">
                            <Label for="avatar" class="text-sm font-semibold">Avatar Image URL</Label>
                            <Input id="avatar" v-model="form.image" placeholder="https://example.com/photo.jpg" class="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10" />
                            <p class="text-[11px] text-zinc-400 font-medium">Paste a direct link to an image (square format recommended).</p>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="grid gap-2">
                            <Label for="name" class="text-sm font-semibold">Display Name</Label>
                            <Input id="name" v-model="form.name" class="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="email" class="text-sm font-semibold">Email Address</Label>
                            <Input id="email" v-model="form.email" disabled class="bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 h-10 text-zinc-500 cursor-not-allowed" />
                        </div>
                    </div>

                    <div class="flex justify-end pt-2">
                        <Button type="submit" :disabled="isLoadingProfile" class="rounded-full px-8 font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm">
                            <Loader2 v-if="isLoadingProfile" class="mr-2 h-4 w-4 animate-spin" />
                            <Save v-else class="mr-2 h-4 w-4" />
                            Save Profile
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

        <Card class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <CardHeader class="border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div class="flex items-center gap-2 mb-1">
                    <div class="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                        <Lock class="h-4 w-4 text-zinc-900 dark:text-white" />
                    </div>
                    <CardTitle class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Account Security</CardTitle>
                </div>
                <CardDescription class="text-zinc-500">
                    {{ hasPassword ? 'Regularly update your password to keep your account safe.' : 'You currently log in via Google. Set a password to enable email login.' }}
                </CardDescription>
            </CardHeader>
            <CardContent class="pt-8">
                <div v-if="!hasPassword" class="mb-8">
                    <Alert class="bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800 dark:text-blue-200">
                        <KeyRound class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertTitle class="text-blue-700 dark:text-blue-400 font-bold">Google Authentication Active</AlertTitle>
                        <AlertDescription class="text-blue-600/80 dark:text-blue-300/80 text-sm mt-1">
                            You are logged in via Google. You can set a password below to enable email login as an alternative.
                        </AlertDescription>
                    </Alert>
                </div>

                <form @submit.prevent="handleRequestSetPassword" class="space-y-6 max-w-md">
                    <div v-if="hasPassword" class="grid gap-2">
                        <Label for="current-pass" class="text-sm font-semibold">Current Password</Label>
                        <Input id="current-pass" type="password" v-model="passForm.currentPassword" required class="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10" />
                    </div>
                    
                    <div class="grid gap-2">
                        <Label for="new-pass" class="text-sm font-semibold">{{ hasPassword ? 'New Password' : 'Create Password' }}</Label>
                        <Input id="new-pass" type="password" v-model="passForm.newPassword" required class="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="confirm-pass" class="text-sm font-semibold">Confirm Password</Label>
                        <Input id="confirm-pass" type="password" v-model="passForm.confirmPassword" required class="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10" />
                    </div>

                    <div class="pt-4">
                        <Button type="submit" variant="secondary" :disabled="isLoadingPassword" class="rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700">
                            <Loader2 v-if="isLoadingPassword" class="mr-2 h-4 w-4 animate-spin" />
                            {{ hasPassword ? 'Change Password' : 'Set Account Password' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

        <Card class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <CardHeader class="border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div class="flex items-center gap-2 mb-1">
                    <div class="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                        <Monitor class="h-4 w-4 text-zinc-900 dark:text-white" />
                    </div>
                    <CardTitle class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Active Sessions</CardTitle>
                </div>
                <CardDescription class="text-zinc-500">
                    Manage devices where you are currently logged in.
                </CardDescription>
            </CardHeader>
            <CardContent class="pt-8">
                <div v-if="isLoadingSessions" class="flex justify-center py-8">
                    <Loader2 class="h-6 w-6 animate-spin text-zinc-400" />
                </div>
                <div v-else class="space-y-4">
                    <div v-for="session in sessions" :key="session.token" class="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div class="flex items-center gap-4">
                            <div class="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                                <Laptop v-if="(session.userAgent || '').includes('Mac') || (session.userAgent || '').includes('Windows')" class="h-5 w-5 text-zinc-500" />
                                <Smartphone v-else-if="(session.userAgent || '').includes('iPhone') || (session.userAgent || '').includes('Android')" class="h-5 w-5 text-zinc-500" />
                                <Globe v-else class="h-5 w-5 text-zinc-500" />
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <p class="text-sm font-semibold text-zinc-900 dark:text-white">{{ session.userAgent ? session.userAgent.substring(0, 90) + '...' : 'Unknown Device' }}</p>
                                    <span v-if="session.isCurrent" class="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide">Current</span>
                                </div>
                                <div class="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                                    <span>{{ session.ipAddress || 'Unknown IP' }}</span>
                                    <span class="text-zinc-300 dark:text-zinc-700">•</span>
                                    <span>Expires {{ new Date(session.expiresAt).toLocaleDateString() }}</span>
                                </div>
                            </div>
                        </div>
                        <Button 
                            v-if="!session.isCurrent"
                            variant="ghost" 
                            size="sm"
                            @click="handleRevokeSession(session.token)"
                            class="text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut class="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div v-if="sessions.length === 0" class="text-center py-8 text-zinc-500 text-sm">
                        No active sessions found.
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card class="border border-red-100 bg-red-50/30 dark:bg-red-950/5 dark:border-red-900/30 shadow-none">
            <CardHeader>
                <CardTitle class="text-red-700 dark:text-red-400 flex items-center gap-2 text-lg font-bold tracking-tight">
                    <Trash2 class="h-5 w-5" /> 
                    Danger Zone
                </CardTitle>
                <CardDescription class="text-red-600/70 dark:text-red-400/60">These actions are permanent and cannot be reversed.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="space-y-1">
                        <p class="text-sm font-bold text-red-900 dark:text-red-200">Delete Account</p>
                        <p class="text-xs text-red-700/60 dark:text-red-400/60">Permanently delete your profile, work logs, and all agency data.</p>
                    </div>
                    <Button 
                        variant="destructive" 
                        @click="handleDeleteAccount" 
                        :disabled="isDeleting"
                        class="rounded-full shadow-sm bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                        <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
                        Delete Account
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>

    <Dialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription class="pt-2 text-zinc-900 dark:text-zinc-100 font-medium">
            Are you sure you want to delete your account? All logs, clients, and data will be erased forever.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4 space-y-4">
             <div class="space-y-2">
                 <Label v-if="deleteConfirmationStep === 1">To confirm, type “delete”</Label>
                 <Label v-else>To confirm, type “delete account”</Label>
                 
                 <Input 
                    v-model="deleteInput"
                    :placeholder="deleteConfirmationStep === 1 ? 'delete' : 'delete account'"
                    @keydown.enter="confirmDelete"
                    class="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                 />
             </div>
        </div>

        <DialogFooter class="flex-col sm:justify-between sm:flex-row items-center gap-4">
          <p class="text-xs text-red-600 font-semibold order-2 sm:order-1">Deleting account cannot be undone</p>
          <div class="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
              <Button variant="outline" @click="isDeleteDialogOpen = false" :disabled="isDeleting">Cancel</Button>
              <Button 
                variant="destructive" 
                @click="confirmDelete" 
                :disabled="isDeleting || !deleteInput"
                class="bg-red-600 hover:bg-red-700 font-bold"
              >
                <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
                {{ deleteConfirmationStep === 1 ? 'Next' : 'Delete Forever' }}
              </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
</template>
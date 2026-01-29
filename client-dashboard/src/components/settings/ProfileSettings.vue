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
  KeyRound 
} from 'lucide-vue-next'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const userStore = useUserStore()
const isLoadingProfile = ref(false)
const isLoadingPassword = ref(false)
const isDeleting = ref(false)

// Profile Form State
const form = ref({
    name: '',
    image: '',
    email: ''
})

// Password Form State
const passForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// Check if user has a password (credential account) or is Google-only
const hasPassword = computed(() => {
    // Better Auth accounts are usually accessible via the user/session object
    const accounts = (userStore.user as any)?.accounts || []
    return accounts.some((acc: any) => acc.type === 'credential' || acc.providerId === 'email')
})

onMounted(async () => {
    if (!userStore.user) await userStore.fetchUser()
    
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

// Correct usage in your script
const handleRequestSetPassword = async () => {
    isLoadingPassword.value = true
    try {
        const { error } = await authClient.emailOtp.sendVerificationOtp({
            email: form.value.email,
            type: "forget-password"
        });

        if (error) {
            toast.error(error.message || "Failed to send reset email")
        } else {
            toast.info("Check your email for the password setup link")
        }
    } catch (e) {
        toast.error("An unexpected error occurred")
    } finally {
        isLoadingPassword.value = false
    }
}


const handleDeleteAccount = async () => {
    const confirm = window.confirm("PERMANENT ACTION: Are you sure you want to delete your account? All logs, clients, and data will be erased forever.")
    if (!confirm) return

    isDeleting.value = true
    try {
        const { error } = await authClient.deleteUser()
        if (error) {
            toast.error(error.message || "Failed to delete account")
        } else {
            toast.success("Account deleted. Goodbye!")
            window.location.href = '/login'
        }
    } catch (e) {
        toast.error("An unexpected error occurred")
    } finally {
        isDeleting.value = false
    }
}
</script>

<template>
    <div class="space-y-8 max-w-4xl mx-auto pb-20">
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <User class="h-5 w-5 text-blue-500" /> 
                    Personal Information
                </CardTitle>
                <CardDescription>Update your public identity on the portal.</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleUpdateProfile" class="space-y-6">
                    <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <Avatar class="h-20 w-20 border-2 border-muted">
                            <AvatarImage :src="form.image" />
                            <AvatarFallback class="text-xl font-bold bg-blue-50 text-blue-600">
                                {{ userStore.initials }}
                            </AvatarFallback>
                        </Avatar>
                        <div class="flex-1 w-full space-y-2">
                            <Label for="avatar">Avatar Image URL</Label>
                            <Input id="avatar" v-model="form.image" placeholder="https://example.com/photo.jpg" />
                            <p class="text-[11px] text-muted-foreground italic">We recommend a square image for best results.</p>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="name">Display Name</Label>
                            <Input id="name" v-model="form.name" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="email">Email Address</Label>
                            <Input id="email" v-model="form.email" disabled class="bg-muted/50 cursor-not-allowed" />
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <Button type="submit" :disabled="isLoadingProfile" class="rounded-xl px-8">
                            <Loader2 v-if="isLoadingProfile" class="mr-2 h-4 w-4 animate-spin" />
                            <Save v-else class="mr-2 h-4 w-4" />
                            Save Profile
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <Lock class="h-5 w-5 text-blue-500" /> 
                    Account Security
                </CardTitle>
                <CardDescription>
                    {{ hasPassword ? 'Regularly update your password to keep your account safe.' : 'You currently log in via Google. Set a password to enable email login.' }}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="!hasPassword" class="mb-6">
                    <Alert class="bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800">
                        <KeyRound class="h-4 w-4 text-blue-600" />
                        <AlertTitle class="text-blue-700 dark:text-blue-400">Google Authentication Active</AlertTitle>
                        <AlertDescription class="text-blue-600/80">
                            Setting a password allows you to access your account if you lose access to your Google account.
                        </AlertDescription>
                    </Alert>
                </div>

                <form @submit.prevent="handleRequestSetPassword" class="space-y-4 max-w-md">
                    <div v-if="hasPassword" class="grid gap-2">
                        <Label for="current-pass">Current Password</Label>
                        <Input id="current-pass" type="password" v-model="passForm.currentPassword" required />
                    </div>
                    
                    <div class="grid gap-2">
                        <Label for="new-pass">{{ hasPassword ? 'New Password' : 'Create Password' }}</Label>
                        <Input id="new-pass" type="password" v-model="passForm.newPassword" required />
                    </div>

                    <div class="grid gap-2">
                        <Label for="confirm-pass">Confirm Password</Label>
                        <Input id="confirm-pass" type="password" v-model="passForm.confirmPassword" required />
                    </div>

                    <div class="pt-2">
                        <Button type="submit" variant="secondary" :disabled="isLoadingPassword" class="rounded-xl">
                            <Loader2 v-if="isLoadingPassword" class="mr-2 h-4 w-4 animate-spin" />
                            {{ hasPassword ? 'Change Password' : 'Set Account Password' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

        <Card class="border-red-200 bg-red-50/30 dark:bg-red-950/10 dark:border-red-900/50">
            <CardHeader>
                <CardTitle class="text-red-600 flex items-center gap-2">
                    <Trash2 class="h-5 w-5" /> 
                    Danger Zone
                </CardTitle>
                <CardDescription class="text-red-500/80">These actions are permanent and cannot be reversed.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="space-y-1">
                        <p class="text-sm font-bold text-red-700 dark:text-red-400">Delete Account</p>
                        <p class="text-xs text-red-600/70">Permanently delete your profile, work logs, and all agency data.</p>
                    </div>
                    <Button 
                        variant="destructive" 
                        @click="handleDeleteAccount" 
                        :disabled="isDeleting"
                        class="rounded-xl shadow-lg shadow-red-500/20"
                    >
                        <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
                        Delete Account
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
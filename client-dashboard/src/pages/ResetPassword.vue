<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const email = ref(route.query.email as string || '')
const otp = ref('')
const newPassword = ref('')
const isLoading = ref(false)

// Inside ResetPassword.vue <script setup>
const handleCompleteReset = async () => {
    // Extract token from URL query parameters
    const token = route.query.token as string 
    
    if (!token) {
        toast.error("Invalid or missing reset token")
        return
    }

    isLoading.value = true
    try {
        const { error } = await authClient.resetPassword({
            newPassword: newPassword.value,
            token: token
        })

        if (error) {
            // Handle Compromised Password Error
            if (error.code === "PASSWORD_COMPROMISED") { //
                return toast.error(error.message || "This password is insecure. Please use a different one.")
            }
            return toast.error(error.message || "Reset failed")
        } else {
            toast.success("Password set successfully. You can now log in with email.")
            router.push('/login')
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card class="w-full max-w-md">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter the code sent to your email and your new password.</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleCompleteReset" class="space-y-4">
                    <div class="space-y-2">
                        <Label>Email</Label>
                        <Input v-model="email" type="email" disabled class="bg-muted" />
                    </div>
                    <div class="space-y-2">
                        <Label>Verification Code</Label>
                        <Input v-model="otp" placeholder="123456" required class="text-center font-mono" />
                    </div>
                    <div class="space-y-2">
                        <Label>New Password</Label>
                        <Input v-model="newPassword" type="password" required />
                    </div>
                    <Button type="submit" class="w-full" :disabled="isLoading">
                        {{ isLoading ? 'Resetting...' : 'Update Password' }}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
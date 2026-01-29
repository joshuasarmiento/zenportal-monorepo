<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)

const handleRequestReset = async () => {
    isLoading.value = true
    try {
        const { error } = await authClient.forgetPassword.emailOtp({
            email: email.value
        })

        if (error) {
            if (error.code === "PASSWORD_COMPROMISED") { //
                return toast.error(error.message || "This password is insecure. Please use a different one.")
            }
            return toast.error(error.message || "Reset failed")
        } else {
            toast.success("OTP sent! Please check your email.")
            // Redirect to the Reset Password page and pass the email in the URL
            router.push({ path: '/reset-password', query: { email: email.value } })
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
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>Enter your email to receive a reset code.</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleRequestReset" class="space-y-4">
                    <div class="space-y-2">
                        <Label>Email Address</Label>
                        <Input v-model="email" type="email" required placeholder="name@example.com" />
                    </div>
                    <Button type="submit" class="w-full" :disabled="isLoading">
                        {{ isLoading ? 'Sending...' : 'Send Reset Code' }}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, ShieldCheck } from 'lucide-vue-next'
import BackgroundNoise from '@/components/ui/background-noise/BackgroundNoise.vue'

const route = useRoute()
const router = useRouter()

const email = ref(route.query.email as string || '')
const otp = ref('')
const newPassword = ref('')
const isLoading = ref(false)

const handleCompleteReset = async () => {
    // If the URL has a token (magic link style), or if we are using OTP flow
    const token = route.query.token as string
    
    if (!token && !otp.value) {
        toast.error("Invalid or missing reset token")
        return
    }

    isLoading.value = true
    try {
        let error;
        
        if (token) {
             // Link Flow
            const res = await authClient.resetPassword({
                newPassword: newPassword.value,
                token: token
            })
            error = res.error;
        } else {
            // OTP Flow
            const res = await authClient.emailOtp.resetPassword({
                password: newPassword.value,
                email: email.value,
                otp: otp.value
            })
            error = res.error;
        }

        if (error) {
            if (error.code === "PASSWORD_COMPROMISED") { 
                return toast.error(error.message || "This password is insecure. Please use a different one.")
            }
            return toast.error(error.message || "Reset failed")
        } else {
            toast.success("Password set successfully. You can now log in.")
            router.push('/login')
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 relative overflow-hidden">
        
        <BackgroundNoise />

        <Card class="w-full pb-10 max-w-sm relative z-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50">
            <CardHeader class="pb-6">
                <div class="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
                    <ShieldCheck class="h-5 w-5 text-zinc-900 dark:text-white" />
                </div>
                <CardTitle class="text-xl font-bold tracking-tight">Reset Password</CardTitle>
                <CardDescription class="text-zinc-500">Secure your account with a new password.</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleCompleteReset" class="space-y-4">
                    <div class="space-y-2">
                        <Label class="font-semibold text-sm">Email</Label>
                        <Input v-model="email" type="email" disabled class="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 h-10 cursor-not-allowed" />
                    </div>
                    <div v-if="!route.query.token" class="space-y-2">
                        <Label class="font-semibold text-sm">Verification Code</Label>
                        <Input v-model="otp" placeholder="123456" required class="text-center font-mono text-lg tracking-widest bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 h-12" />
                    </div>
                    <div class="space-y-2">
                        <Label class="font-semibold text-sm">New Password</Label>
                        <Input v-model="newPassword" type="password" required class="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 h-10" />
                    </div>
                    <Button type="submit" class="w-full h-10 rounded-md font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200" :disabled="isLoading">
                        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                        {{ isLoading ? 'Resetting...' : 'Update Password' }}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
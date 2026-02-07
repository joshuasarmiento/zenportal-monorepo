<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, KeyRound } from 'lucide-vue-next'
import BackgroundNoise from '@/components/ui/background-noise/BackgroundNoise.vue'

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
            if (error.code === "PASSWORD_COMPROMISED") { 
                return toast.error(error.message || "This password is insecure. Please use a different one.")
            }
            return toast.error(error.message || "Reset failed")
        } else {
            toast.success("OTP sent! Please check your email.")
            router.push({ path: '/reset-password', query: { email: email.value } })
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-background font-sans text-foreground relative overflow-hidden">
        
        <BackgroundNoise />

        <Card class="w-full max-w-sm relative z-10 border border-border bg-card shadow-2xl shadow-muted/50">
            <CardHeader class="pb-6">
                <div class="h-10 w-10 bg-muted rounded-xl flex items-center justify-center mb-4">
                    <KeyRound class="h-5 w-5 text-foreground" />
                </div>
                <CardTitle class="text-xl font-bold tracking-tight">Forgot Password</CardTitle>
                <CardDescription class="text-muted-foreground">Enter your email to receive a reset code.</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleRequestReset" class="space-y-4">
                    <div class="space-y-2">
                        <Label class="font-semibold text-sm">Email Address</Label>
                        <Input v-model="email" type="email" required placeholder="m@example.com" class="bg-muted/50 border-border h-10" />
                    </div>
                    <Button type="submit" class="w-full h-10 rounded-md font-bold bg-primary text-primary-foreground hover:bg-primary/90" :disabled="isLoading">
                        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                        {{ isLoading ? 'Sending...' : 'Send Reset Code' }}
                    </Button>
                    <div class="text-center">
                        <router-link to="/login" class="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                            Back to Login
                        </router-link>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
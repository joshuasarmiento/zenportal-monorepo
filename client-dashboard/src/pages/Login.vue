<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge' 
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Loader2, ArrowRight, ShieldCheck } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const isLoading = ref(false)
const isOtpStep = ref(false)
const lastLoginMethod = ref<string | null>(null)

const email = ref('')
const password = ref('')
const otp = ref('')
const rememberMe = ref(false)

onMounted(() => {
    const method = authClient.getLastUsedLoginMethod()
    if (method) {
        lastLoginMethod.value = method
    }
})

const loginWithGoogle = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/dashboard",
    })
}

const handleInitialLogin = async () => {
    isLoading.value = true
    try {
        const { error } = await authClient.signIn.email({
            email: email.value,
            password: password.value,
        })

        if (error) return toast.error(error.message || "Invalid credentials")

        await authClient.emailOtp.sendVerificationOtp({ email: email.value, type: "sign-in" })
        isOtpStep.value = true
        toast.info("Security code sent to your inbox")
    } finally {
        isLoading.value = false
    }
}

const handleVerifyOtp = async () => {
    isLoading.value = true
    try {
        const { error } = await authClient.signIn.emailOtp({ email: email.value, otp: otp.value })
        if (error) return toast.error(error.message || "Error OTP")
        router.push('/dashboard')
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 relative overflow-hidden">
        
        <div class="fixed inset-0 z-0 pointer-events-none">
           <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <div class="w-full max-w-md relative z-10">
            <div class="flex flex-col gap-6">
                <Card class="overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50">
                    <CardContent class="grid p-0">
                        <div class="p-8 md:p-10">
                            <div class="flex flex-col gap-6">
                                <div class="flex flex-col items-center gap-2 text-center">
                                    <div class="h-10 w-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-zinc-500/20 dark:shadow-white/20">
                                        <Zap class="h-5 w-5 text-white dark:text-zinc-900 fill-current" />
                                    </div>
                                    <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        {{ isOtpStep ? 'Verify Identity' : 'Welcome back' }}
                                    </h1>
                                    <p class="text-zinc-500 dark:text-zinc-400 text-sm">
                                        {{ isOtpStep ? `Enter the code sent to ${email}` : 'Login to your ZenPortal account' }}
                                    </p>
                                </div>

                                <form v-if="!isOtpStep" @submit.prevent="handleInitialLogin" class="grid gap-4">
                                    <div class="grid gap-2">
                                        <Label for="email" class="font-medium">Email</Label>
                                        <Input
                                            id="email"
                                            v-model="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            class="h-10 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                                        />
                                    </div>
                                    <div class="grid gap-2">
                                        <div class="flex items-center">
                                            <Label for="password" class="font-medium">Password</Label>
                                            <router-link
                                                to="/forgot-password"
                                                class="ml-auto text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline-offset-4 hover:underline"
                                            >
                                                Forgot password?
                                            </router-link>
                                        </div>
                                        <Input 
                                            id="password" 
                                            v-model="password" 
                                            type="password" 
                                            required 
                                            class="h-10 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                                        />
                                    </div>
                                    
                                    <div class="flex items-center space-x-2 py-1">
                                        <Checkbox id="rem" :checked="rememberMe" @update:checked="(v: any) => rememberMe = v" />
                                        <label for="rem" class="text-sm text-zinc-500 font-medium cursor-pointer select-none">
                                            Stay signed in
                                        </label>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        class="w-full h-10 transition-all font-bold" 
                                        :variant="lastLoginMethod === 'email' ? 'default' : 'secondary'"
                                        :class="lastLoginMethod === 'email' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200' : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'"
                                        :disabled="isLoading"
                                    >
                                        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                                        <span v-else class="flex items-center">
                                            Login <ArrowRight class="ml-2 h-4 w-4" />
                                            <Badge v-if="lastLoginMethod === 'email'" variant="secondary" class="ml-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0">Last used</Badge>
                                        </span>
                                    </Button>
                                </form>

                                <form v-else @submit.prevent="handleVerifyOtp" class="grid gap-4">
                                    <div class="grid gap-2">
                                        <Label for="otp" class="text-center font-bold text-xs uppercase tracking-widest text-zinc-500">Security Code</Label>
                                        <Input
                                            id="otp"
                                            v-model="otp"
                                            placeholder="000000"
                                            class="text-center text-2xl h-14 tracking-[0.5em] font-mono bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" class="w-full h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold" :disabled="isLoading">
                                        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                                        <span v-else class="flex items-center justify-center">
                                            <ShieldCheck class="mr-2 h-4 w-4" /> Verify Account
                                        </span>
                                    </Button>
                                    <button type="button" @click="isOtpStep = false" class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline transition-colors">
                                        Change email address
                                    </button>
                                </form>

                                <template v-if="!isOtpStep">
                                    <div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-zinc-200 dark:after:border-zinc-800">
                                        <span class="relative z-10 bg-white dark:bg-zinc-900 px-2 text-zinc-400 uppercase text-[10px] font-bold tracking-widest">
                                            Or continue with
                                        </span>
                                    </div>

                                    <div class="grid grid-cols-1 gap-4">
                                        <Button 
                                            variant="outline" 
                                            type="button" 
                                            class="w-full h-10 relative bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800" 
                                            @click="loginWithGoogle"
                                            :class="lastLoginMethod === 'google' ? 'ring-2 ring-blue-500/20 border-blue-500/50 bg-blue-50 dark:bg-blue-900/10' : ''"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-2 h-4 w-4">
                                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                                            </svg>
                                            Google
                                            <Badge v-if="lastLoginMethod === 'google'" variant="secondary" class="ml-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0 absolute right-3">Last used</Badge>
                                        </Button>
                                    </div>
                                </template>

                                <div class="text-center text-sm text-zinc-500">
                                    Don't have an account?
                                    <router-link to="/sign-up" class="underline underline-offset-4 text-zinc-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        Sign up
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <p class="px-6 text-center text-xs text-zinc-500 text-balance">
                    By clicking continue, you agree to our <router-link to="/terms" class="underline hover:text-zinc-900 dark:hover:text-white">Terms of Service</router-link>
                    and <router-link to="/privacy-policy" class="underline hover:text-zinc-900 dark:hover:text-white">Privacy Policy</router-link>.
                </p>
            </div>
        </div>
    </div>
</template>
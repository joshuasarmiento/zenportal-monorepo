<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authClient } from '@/lib/auth-client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Zap, ShieldCheck, UserPlus, ShieldAlert } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const isLoading = ref(false)
const isOtpStep = ref(false)

const form = ref({ name: '', email: '', password: '' })
const otp = ref('')

// Social Login Logic
const loginWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: window.location.origin + "/dashboard",
  })
}

// Real-time strength visual
const passRules = computed(() => ({
    length: form.value.password.length >= 8,
    capitals: (form.value.password.match(/[A-Z]/g) || []).length >= 2,
    number: /[0-9]/.test(form.value.password)
}))

const handleSignup = async () => {
    if (!form.value.email || !form.value.password || !form.value.name) {
        return toast.error("Please fill in all fields")
    }
    
    isLoading.value = true
    try {
        const { error } = await authClient.signUp.email({
            email: form.value.email,
            password: form.value.password,
            name: form.value.name,
        })
        
        if (error) {
            if (error.code === "PASSWORD_COMPROMISED") { 
                return toast.error(error.message || "This password is insecure. Please use a different one.")
            }
            return toast.error(error.message || "Signup failed")
        }

        await authClient.emailOtp.sendVerificationOtp({ 
            email: form.value.email, 
            type: "email-verification" 
        })
        
        toast.success("Security code sent to your inbox!")
        isOtpStep.value = true
    } catch (e: any) {
        toast.error("An unexpected error occurred")
    } finally {
        isLoading.value = false
    }
}

const handleVerifySignup = async () => {
    isLoading.value = true
    try {
        const { error } = await authClient.emailOtp.verifyEmail({ 
            email: form.value.email, 
            otp: otp.value 
        })
        
        if (error) return toast.error(error.message || "Verification failed")
        
        toast.success("Account verified successfully!")
        router.push('/dashboard')
    } catch (e: any) {
        toast.error("Verification failed")
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
                    {{ isOtpStep ? 'Security Check' : 'Create Account' }}
                  </h1>
                  <p class="text-zinc-500 dark:text-zinc-400 text-sm">
                    {{ isOtpStep ? `Confirm the code sent to ${form.email}` : 'Join ZenPortal to manage your freelance agency' }}
                  </p>
                </div>

                <form v-if="!isOtpStep" @submit.prevent="handleSignup" class="grid gap-4">
                  <div class="grid gap-2">
                    <Label for="name" class="font-medium">Full Name</Label>
                    <Input id="name" v-model="form.name" placeholder="John Doe" required class="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                  </div>

                  <div class="grid gap-2">
                    <Label for="email" class="font-medium">Email</Label>
                    <Input id="email" v-model="form.email" type="email" placeholder="john@agency.com" required class="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                  </div>

                  <div class="grid gap-2">
                    <Label for="password" class="font-medium">Password</Label>
                    <Input id="password" v-model="form.password" type="password" required class="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                    
                    <div class="grid grid-cols-3 gap-2 mt-1 px-0.5">
                        <div class="h-1 rounded-full transition-colors duration-300" :class="passRules.length ? 'bg-blue-600 dark:bg-blue-500' : 'bg-zinc-100 dark:bg-zinc-800'"></div>
                        <div class="h-1 rounded-full transition-colors duration-300" :class="passRules.capitals ? 'bg-blue-600 dark:bg-blue-500' : 'bg-zinc-100 dark:bg-zinc-800'"></div>
                        <div class="h-1 rounded-full transition-colors duration-300" :class="passRules.number ? 'bg-blue-600 dark:bg-blue-500' : 'bg-zinc-100 dark:bg-zinc-800'"></div>
                    </div>
                    <p class="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-1 font-medium">
                        <ShieldAlert class="h-3 w-3" /> 8+ chars, 2 capitals, 1 number required.
                    </p>
                  </div>

                  <Button type="submit" class="w-full mt-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold" :disabled="isLoading">
                    <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                    <span v-else class="flex items-center">Get Started <UserPlus class="ml-2 h-4 w-4" /></span>
                  </Button>
                </form>

                <form v-else @submit.prevent="handleVerifySignup" class="grid gap-6">
                  <div class="grid gap-2">
                    <Label for="otp" class="text-center font-bold tracking-widest text-xs uppercase text-zinc-500">Verification Code</Label>
                    <Input
                      id="otp"
                      v-model="otp"
                      maxlength="6"
                      placeholder="000000"
                      class="text-center text-3xl h-16 tracking-[0.3em] font-mono rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                      required
                    />
                  </div>
                  <Button type="submit" class="w-full h-11 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold" :disabled="isLoading">
                    <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                    <span v-else class="flex items-center justify-center">
                      <ShieldCheck class="mr-2 h-4 w-4" /> Complete Signup
                    </span>
                  </Button>
                  <button type="button" @click="isOtpStep = false" class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline underline-offset-4 transition-colors">
                    Wait, that's the wrong email
                  </button>
                </form>

                <template v-if="!isOtpStep">
                  <div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-zinc-200 dark:after:border-zinc-800">
                    <span class="relative z-10 bg-white dark:bg-zinc-900 px-2 text-zinc-400 uppercase text-[10px] font-bold tracking-widest">
                      Or join with
                    </span>
                  </div>

                  <Button variant="outline" type="button" class="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 h-10 font-medium" @click="loginWithGoogle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-2 h-4 w-4">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                    </svg>
                    Google
                  </Button>
                </template>

                <div v-if="!isOtpStep" class="text-center text-sm text-zinc-500">
                  Already have a portal?
                  <router-link to="/login" class="underline underline-offset-4 text-zinc-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Log in
                  </router-link>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
        
        <p class="px-6 text-center text-xs text-zinc-500 text-balance">
          By creating an account, you agree to our <router-link to="/terms" class="underline hover:text-zinc-900 dark:hover:text-white">Terms</router-link>
          and <router-link to="/privacy-policy" class="underline hover:text-zinc-900 dark:hover:text-white">Privacy Policy</router-link>.
        </p>
      </div>
    </div>
  </div>
</template>
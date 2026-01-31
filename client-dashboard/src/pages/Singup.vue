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
            // Handle Compromised Password Error
            if (error.code === "PASSWORD_COMPROMISED") { //
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
  <div class="dark bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <div class="flex flex-col gap-6">
        <Card class="overflow-hidden p-0 shadow-2xl border-white/5">
          <CardContent class="grid p-0">
            
            <div class="p-6 md:p-8 bg-card">
              <div class="flex flex-col gap-6">
                <div class="flex flex-col items-center gap-2 text-center">
                  <div class="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center mb-2">
                    <Zap class="text-white h-5 w-5 fill-white" />
                  </div>
                  <h1 class="text-2xl font-bold tracking-tight">
                    {{ isOtpStep ? 'Security Check' : 'Create Account' }}
                  </h1>
                  <p class="text-muted-foreground text-sm">
                    {{ isOtpStep ? `Confirm the code sent to ${form.email}` : 'Join ZenPortal to manage your freelance agency' }}
                  </p>
                </div>

                <form v-if="!isOtpStep" @submit.prevent="handleSignup" class="grid gap-4">
                  <div class="grid gap-2">
                    <Label for="name">Full Name</Label>
                    <Input id="name" v-model="form.name" placeholder="John Doe" required />
                  </div>

                  <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input id="email" v-model="form.email" type="email" placeholder="john@agency.com" required />
                  </div>

                  <div class="grid gap-2">
                    <Label for="password">Password</Label>
                    <Input id="password" v-model="form.password" type="password" required />
                    
                    <div class="grid grid-cols-3 gap-2 mt-1 px-1">
                        <div class="h-1 rounded-full transition-colors" :class="passRules.length ? 'bg-blue-500' : 'bg-muted'"></div>
                        <div class="h-1 rounded-full transition-colors" :class="passRules.capitals ? 'bg-blue-500' : 'bg-muted'"></div>
                        <div class="h-1 rounded-full transition-colors" :class="passRules.number ? 'bg-blue-500' : 'bg-muted'"></div>
                    </div>
                    <p class="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                        <ShieldAlert class="h-3 w-3" /> 8+ chars, 2 capitals, 1 number required.
                    </p>
                  </div>

                  <Button type="submit" class="w-full mt-2" :disabled="isLoading">
                    <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                    <span v-else class="flex items-center">Get Started <UserPlus class="ml-2 h-4 w-4" /></span>
                  </Button>
                </form>

                <form v-else @submit.prevent="handleVerifySignup" class="grid gap-6">
                  <div class="grid gap-2">
                    <Label for="otp" class="text-center font-bold tracking-widest text-xs uppercase">Verification Code</Label>
                    <Input
                      id="otp"
                      v-model="otp"
                      maxlength="6"
                      placeholder="000000"
                      class="text-center text-3xl h-16 tracking-[0.3em] font-mono rounded-2xl"
                      required
                    />
                  </div>
                  <Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 h-11" :disabled="isLoading">
                    <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                    <span v-else class="flex items-center justify-center">
                      <ShieldCheck class="mr-2 h-4 w-4" /> Complete Signup
                    </span>
                  </Button>
                  <button type="button" @click="isOtpStep = false" class="text-xs text-muted-foreground underline underline-offset-4">
                    Wait, that's the wrong email
                  </button>
                </form>

                <template v-if="!isOtpStep">
                  <div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span class="relative z-10 bg-card px-2 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                      Or join with
                    </span>
                  </div>

                  <Button variant="outline" type="button" class="w-full" @click="loginWithGoogle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-2 h-4 w-4">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                    </svg>
                    Google
                  </Button>
                </template>

                <div v-if="!isOtpStep" class="text-center text-sm">
                  Already have a portal?
                  <router-link to="/login" class="underline underline-offset-4 font-medium">
                    Log in
                  </router-link>
                </div>
              </div>
            </div>


          </CardContent>
        </Card>
        
        <p class="px-6 text-center text-xs text-muted-foreground text-balance">
          By creating an account, you agree to our <a href="#" class="underline">Terms</a>
          and <a href="#" class="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  </div>
</template>
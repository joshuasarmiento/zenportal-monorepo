<script setup lang="ts">
import { SignUp } from '@clerk/vue'
import { useUser } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Zap, ChevronLeft } from 'lucide-vue-next'

const { isSignedIn, isLoaded } = useUser()
const router = useRouter()

const checkRedirect = () => {
    if (!isLoaded.value) return
    if (isSignedIn.value) router.push('/dashboard')
}

onMounted(checkRedirect)
watch([isLoaded, isSignedIn], checkRedirect)
</script>

<template>
    <div v-if="!isLoaded || isSignedIn" class="min-h-screen flex items-center justify-center bg-background">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>

    <div v-else class="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-vh">
        
        <div class="hidden bg-zinc-900 lg:flex flex-col p-10 text-white dark:border-r">
            <div class="flex items-center gap-2 font-bold text-xl">
                <Zap class="h-6 w-6" /> ZenPortal
            </div>
            
            <div class="flex-1 flex items-center justify-center">
                <blockquote class="space-y-2 max-w-lg">
                    <p class="text-lg font-medium leading-relaxed">
                        &ldquo;I used to chase clients for payments and feedback. Now they chase me to see their next update on the portal. It's a game changer.&rdquo;
                    </p>
                    <footer class="text-sm text-zinc-400">Marcus Chen, Freelance Developer</footer>
                </blockquote>
            </div>
        </div>

        <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-background">
            
            <Button variant="ghost" class="absolute top-4 left-4 md:top-8 md:left-8" @click="router.push('/')">
                <ChevronLeft class="mr-2 h-4 w-4" /> Home
            </Button>

            <div class="mx-auto grid w-[350px] gap-6">
                <div class="grid gap-2 text-center">
                    <h1 class="text-3xl font-bold text-foreground">Create an Account</h1>
                    <p class="text-balance text-muted-foreground">
                        No credit card required • Free plan available
                    </p>
                </div>
                
                <div class="flex justify-center">
                    <SignUp 
                        redirectUrl="/dashboard" 
                        signInUrl="/sign-in"
                        :appearance="{
                            elements: {
                                rootBox: 'w-full',
                                card: 'shadow-none border-none bg-transparent w-full',
                                headerTitle: 'hidden',
                                headerSubtitle: 'hidden',
                                formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
                                footerActionLink: 'text-primary hover:text-primary/90'
                            }
                        }"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
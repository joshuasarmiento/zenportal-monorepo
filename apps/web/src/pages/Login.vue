<script setup lang="ts">
import { SignIn } from '@clerk/vue'
import { useUser } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'

const { isSignedIn, isLoaded } = useUser()
const router = useRouter()

const checkRedirect = () => {
    // 1. Wait for Clerk to load
    if (!isLoaded.value) return

    // 2. If Logged In -> Go to Dashboard
    if (isSignedIn.value) {
        router.push('/dashboard')
    }
}

// Check immediately and whenever auth state changes
onMounted(checkRedirect)
watch([isLoaded, isSignedIn], checkRedirect)
</script>

<template>
    <div v-if="!isLoaded || isSignedIn" class="min-h-screen flex items-center justify-center bg-white">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>

    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="max-w-md w-full">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p class="text-gray-500">Sign in to manage your portal</p>
            </div>
            <div class="flex justify-center">
                <SignIn redirectUrl="/dashboard" signUpUrl="/signup" />
            </div>
        </div>
    </div>
</template>
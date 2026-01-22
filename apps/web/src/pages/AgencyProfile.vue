<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug as string

const agency = ref<any>(null)
const error = ref('')
const loading = ref(true)

// --- Dynamic Branding Maps ---
const bgColors: Record<string, string> = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-600',
    gray: 'bg-gray-900'
}

const textColors: Record<string, string> = {
    indigo: 'text-indigo-600',
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
    gray: 'text-gray-900'
}

const ringColors: Record<string, string> = {
    indigo: 'ring-indigo-100',
    blue: 'ring-blue-100',
    emerald: 'ring-emerald-100',
    rose: 'ring-rose-100',
    gray: 'ring-gray-100'
}

// --- Computed Styles ---
const accentBg = computed(() => {
    const color = agency.value?.accentColor || 'indigo'
    return bgColors[color] || 'bg-indigo-600'
})

const accentText = computed(() => {
    const color = agency.value?.accentColor || 'indigo'
    return textColors[color] || 'text-indigo-600'
})

const accentRing = computed(() => {
    const color = agency.value?.accentColor || 'indigo'
    return ringColors[color] || 'ring-indigo-100'
})

const handleLogin = () => {
    alert(`Please check the email link sent by ${agency.value?.fullName}`)
}

onMounted(async () => {
    try {
        // Note: We need to create this backend route next!
        const res = await fetch(`${import.meta.env.VITE_API_URL}/public/agency/${slug}`)

        if (!res.ok) throw new Error('Agency not found')
        agency.value = await res.json()
    } catch (err) {
        error.value = 'This agency profile does not exist.'
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div v-if="loading" class="h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div class="animate-spin w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full"></div>
    </div>

    <div v-else-if="error" class="h-screen flex items-center justify-center text-center p-4 bg-[#FAFAFA]">
        <div class="max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div class="text-4xl mb-4">🏢</div>
            <h1 class="text-xl font-bold mb-2">Agency Not Found</h1>
            <p class="text-gray-500">{{ error }}</p>
        </div>
    </div>

    <div v-else-if="agency" class="min-h-screen bg-[#FAFAFA] font-inter text-gray-800 flex flex-col">

        <div class="h-48 w-full relative" :class="accentBg">
            <div class="absolute inset-0 bg-black/10"></div>
        </div>

        <main class="flex-1 max-w-2xl mx-auto w-full px-6 -mt-20 relative z-10">

            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">

                <div class="relative inline-block mb-6">
                    <div class="p-1 bg-white rounded-2xl inline-block shadow-sm">
                        <img v-if="agency.avatarUrl" :src="agency.avatarUrl" class="w-24 h-24 rounded-xl object-cover">
                        <div v-else
                            class="w-24 h-24 rounded-xl flex items-center justify-center text-white font-bold text-3xl"
                            :class="accentBg">
                            {{ agency.fullName?.[0] || 'A' }}
                        </div>
                    </div>
                </div>

                <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ agency.fullName }}</h1>
                <p class="text-gray-500 mb-8 max-w-md mx-auto">
                    Welcome to my client portal. Existing clients can check their email for their magic login link.
                </p>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a :href="`mailto:${agency.email}`"
                        class="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white shadow-sm transition hover:opacity-90 flex items-center justify-center gap-2"
                        :class="accentBg">
                        <i class="ph ph-envelope-simple text-lg"></i>
                        Contact Me
                    </a>

                    <button
                        class="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                        @click="handleLogin">
                        Client Login
                    </button>
                </div>

            </div>

            <div class="mt-8 text-center">
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm text-gray-500">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Accepting new clients
                </div>

                <p class="mt-8 text-gray-400 text-sm">
                    &copy; {{ new Date().getFullYear() }} {{ agency.fullName }}
                </p>
            </div>

        </main>
    </div>
</template>
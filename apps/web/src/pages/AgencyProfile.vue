<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, Building2, Mail, LogIn } from 'lucide-vue-next'

const route = useRoute()
const slug = route.params.slug as string

const agency = ref<any>(null)
const error = ref('')
const loading = ref(true)

const bgColors: Record<string, string> = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    rose: 'bg-rose-600 hover:bg-rose-700',
    gray: 'bg-gray-900 hover:bg-gray-800'
}

const accentBg = computed(() => {
    const color = agency.value?.accentColor || 'indigo'
    return bgColors[color] || bgColors.indigo
})

const handleLogin = () => {
    alert(`Please check the email link sent by ${agency.value?.fullName}`)
}

onMounted(async () => {
    try {
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
    <div v-if="loading" class="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 class="h-10 w-10 animate-spin text-muted-foreground" />
    </div>

    <div v-else-if="error" class="h-screen flex items-center justify-center text-center p-4 bg-slate-50">
        <Card class="max-w-md w-full">
            <CardContent class="p-8 flex flex-col items-center">
                <div class="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Building2 class="h-6 w-6 text-muted-foreground" />
                </div>
                <h1 class="text-xl font-bold mb-2">Agency Not Found</h1>
                <p class="text-muted-foreground">{{ error }}</p>
            </CardContent>
        </Card>
    </div>

    <div v-else-if="agency" class="min-h-screen bg-slate-50 font-inter text-slate-900 flex flex-col">

        <div class="h-48 w-full relative" :class="accentBg">
            <div class="absolute inset-0 bg-black/10"></div>
        </div>

        <main class="flex-1 max-w-2xl mx-auto w-full px-6 -mt-20 relative z-10 pb-10">

            <Card class="text-center shadow-lg">
                <CardContent class="p-8 pt-0">
                    <div class="relative -mt-12 mb-6 inline-block">
                        <div class="p-1.5 bg-white rounded-2xl shadow-sm inline-block">
                            <Avatar class="h-24 w-24 rounded-xl">
                                <AvatarImage :src="agency.avatarUrl" class="object-cover" />
                                <AvatarFallback class="rounded-xl text-white text-3xl font-bold" :class="accentBg">
                                    {{ agency.fullName?.[0] || 'A' }}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <h1 class="text-2xl font-bold text-slate-900 mb-2">{{ agency.fullName }}</h1>
                    <p class="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                        Welcome to my client portal. Existing clients can check their email for their magic login link.
                    </p>

                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button as-child class="w-full sm:w-auto gap-2 shadow-sm text-white border-0" size="lg" :class="accentBg">
                            <a :href="`mailto:${agency.email}`">
                                <Mail class="h-4 w-4" />
                                Contact Me
                            </a>
                        </Button>

                        <Button variant="outline" class="w-full sm:w-auto gap-2" size="lg" @click="handleLogin">
                            <LogIn class="h-4 w-4" />
                            Client Login
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div class="mt-8 text-center">
                <Badge variant="outline" class="bg-white py-1.5 px-4 gap-2 text-slate-500 font-normal shadow-sm">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Accepting new clients
                </Badge>

                <p class="mt-8 text-slate-400 text-sm">
                    &copy; {{ new Date().getFullYear() }} {{ agency.fullName }}
                </p>
            </div>

        </main>
    </div>
</template>
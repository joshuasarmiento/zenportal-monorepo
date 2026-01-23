<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Building2, Mail, LogIn, Globe, Linkedin, Twitter, CheckCircle2, ArrowRight } from 'lucide-vue-next'
import { toast } from 'vue-sonner' 

const route = useRoute()
const slug = route.params.slug as string
const agency = ref<any>(null)
const error = ref('')
const loading = ref(true)

// Map colors to Tailwind classes for text/bg/gradients
const colorMap: Record<string, { bg: string, text: string, gradient: string, ring: string, shadow: string }> = {
    indigo: { 
        bg: 'bg-indigo-600', 
        text: 'text-indigo-600 dark:text-indigo-400', 
        gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
        ring: 'ring-indigo-500/20',
        shadow: 'shadow-indigo-500/25'
    },
    blue: { 
        bg: 'bg-blue-600', 
        text: 'text-blue-600 dark:text-blue-400', 
        gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
        ring: 'ring-blue-500/20',
        shadow: 'shadow-blue-500/25'
    },
    emerald: { 
        bg: 'bg-emerald-600', 
        text: 'text-emerald-600 dark:text-emerald-400', 
        gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
        ring: 'ring-emerald-500/20',
        shadow: 'shadow-emerald-500/25'
    },
    rose: { 
        bg: 'bg-rose-600', 
        text: 'text-rose-600 dark:text-rose-400', 
        gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
        ring: 'ring-rose-500/20',
        shadow: 'shadow-rose-500/25'
    },
    gray: { 
        bg: 'bg-primary', 
        text: 'text-primary', 
        gradient: 'from-primary/20 via-primary/5 to-transparent',
        ring: 'ring-primary/20',
        shadow: 'shadow-primary/25'
    }
}

const theme = computed(() => {
    const color = agency.value?.accentColor || 'indigo'
    return colorMap[color] || colorMap.indigo
})

const memberSince = computed(() => {
    if (!agency.value?.createdAt) return new Date().getFullYear()
    return new Date(agency.value.createdAt).getFullYear()
})

const handleLogin = () => { 
    toast.info(`Existing clients should check their inbox for a magic link from ${agency.value?.fullName}.`)
}

onMounted(async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/public/agency/${slug}`)
        if (!res.ok) throw new Error('Agency not found')
        agency.value = await res.json()
    } catch (err) { error.value = 'This agency profile does not exist.' } finally { loading.value = false }
})
</script>

<template>
    <div v-if="loading" class="h-screen flex items-center justify-center bg-background">
        <Loader2 class="h-10 w-10 animate-spin text-muted-foreground" />
    </div>

    <div v-else-if="error" class="h-screen flex items-center justify-center text-center p-4 bg-background">
        <div class="max-w-md w-full border border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center shadow-lg">
            <div class="h-14 w-14 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
                <Building2 class="h-7 w-7 text-muted-foreground" />
            </div>
            <h1 class="text-xl font-bold mb-2">Agency Not Found</h1>
            <p class="text-muted-foreground">{{ error }}</p>
        </div>
    </div>

    <div v-else-if="agency" class="min-h-screen bg-background font-sans text-foreground flex flex-col relative overflow-hidden selection:bg-primary/20">
        
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-40 pointer-events-none z-0">
             <div class="absolute inset-0 bg-gradient-radial from-white/10 to-transparent dark:from-white/5"></div>
             <div :class="`absolute top-[-20%] left-[-10%] w-[70%] h-[80%] rounded-full blur-[120px] mix-blend-screen opacity-60 ${theme?.bg}`"></div>
             <div :class="`absolute top-[-10%] right-[-10%] w-[60%] h-[70%] rounded-full blur-[100px] mix-blend-screen opacity-40 ${theme?.bg}`"></div>
        </div>

        <div class="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" 
             style="background-image: radial-gradient(#888 1px, transparent 1px); background-size: 24px 24px;">
        </div>

         <div class="fixed inset-0 z-0 opacity-[0.4]" 
             style="background-image: linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <main class="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 relative z-10">
            <Card class="overflow-hidden py-0 p-1 border-border/40 shadow-2xl bg-card/60 backdrop-blur-xl rounded-3xl ring-1 ring-white/10">
                <div class="relative">
                    <div :class="`h-32 w-full bg-linear-to-b rounded-3xl ${theme?.gradient}`"></div>

                    <div class="px-8 pb-8 -mt-16 flex flex-col md:flex-row gap-6 items-start md:items-end">
                        <div class="relative group">
                            <div :class="`absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 ${theme?.bg}`"></div>
                            <Avatar class="h-32 w-32 rounded-2xl border-4 border-background shadow-xl relative bg-background">
                                <AvatarImage :src="agency.avatarUrl" class="object-cover" />
                                <AvatarFallback class="rounded-2xl text-white text-4xl font-bold" :class="theme?.bg">
                                    {{ agency.fullName?.[0] || 'A' }}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        
                        <div class="flex-1 space-y-1.5 mb-1 pt-2">
                            <div class="flex items-center gap-2 flex-wrap">
                                <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                                    {{ agency.fullName }}
                                </h1>
                                <Badge v-if="agency.tier === 'pro'" variant="secondary" class="rounded-full px-2 py-0.5 h-6 gap-1.5 font-medium border-border/50 bg-background/50 backdrop-blur-md">
                                    <CheckCircle2 :class="`h-3.5 w-3.5 ${theme?.text}`" />
                                    <span class="text-xs text-muted-foreground">Verified</span>
                                </Badge>
                            </div>
                            
                            <p v-if="agency.headline" class="text-lg text-muted-foreground font-medium text-balance leading-relaxed">
                                {{ agency.headline }}
                            </p>
                            <p v-else class="text-muted-foreground">Professional Service Provider</p>
                            
                            <div class="flex gap-2 pt-3">
                                <a v-if="agency.websiteUrl" :href="agency.websiteUrl" target="_blank" 
                                   class="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300">
                                    <Globe class="h-4 w-4" />
                                </a>
                                <a v-if="agency.linkedinUrl" :href="agency.linkedinUrl" target="_blank" 
                                   class="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                                    <Linkedin class="h-4 w-4" />
                                </a>
                                <a v-if="agency.twitterUrl" :href="agency.twitterUrl" target="_blank" 
                                   class="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300">
                                    <Twitter class="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        <div class="w-full md:w-auto mt-4 md:mt-0">
                            <Button size="lg" 
                                :class="`w-full md:w-auto font-semibold text-white shadow-lg hover:brightness-110 transition-all active:scale-95 ${theme?.bg} ${theme?.shadow}`" 
                                @click="handleLogin">
                                <LogIn class="h-4 w-4 mr-2" /> 
                                Client Portal
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator class="bg-border/40" />

                <CardContent class="p-8 grid gap-10">
                    
                    <div class="grid md:grid-cols-3 gap-10">
                        <div class="md:col-span-2 space-y-4">
                            <h3 class="text-lg font-semibold tracking-tight flex items-center gap-2">
                                <span :class="`w-1 h-6 rounded-full ${theme?.bg}`"></span>
                                About
                            </h3>
                            <div class="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                <p v-if="agency.bio" class="whitespace-pre-wrap">{{ agency.bio }}</p>
                                <p v-else class="italic opacity-80">
                                    Welcome to my client portal. This is where I track work logs and share progress updates with my clients.
                                </p>
                            </div>
                        </div>

                        <div class="md:col-span-1">
                            <div class="bg-muted/30 border border-border/50 rounded-2xl p-6 flex flex-col gap-4 sticky top-6">
                                <div>
                                    <h4 class="font-semibold text-foreground mb-1">Let's Connect</h4>
                                    <p class="text-sm text-muted-foreground">Interested in starting a new project together?</p>
                                </div>
                                <Button as-child variant="outline" class="w-full justify-between group hover:border-foreground/20 bg-background/50">
                                    <a :href="`mailto:${agency.email}`">
                                        <span class="flex items-center gap-2"><Mail class="h-4 w-4" /> Email Me</span>
                                        <ArrowRight class="h-3 w-3 opacity-50 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </Button>
                                <div class="text-xs text-muted-foreground text-center pt-2 border-t border-border/30">
                                    Member since {{ memberSince }}
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

            <div class="mt-8 text-center">
                <p class="text-muted-foreground/60 text-xs font-medium">
                    &copy; {{ new Date().getFullYear() }} {{ agency.fullName }}. Powered by Portal.
                </p>
            </div>
        </main>
    </div>
</template>
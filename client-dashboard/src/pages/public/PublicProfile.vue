<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Building2, Mail, LogIn, Globe, Linkedin, Twitter, CheckCircle2, ArrowRight, Zap } from 'lucide-vue-next'
import { toast } from 'vue-sonner' 

const route = useRoute()
const slug = route.params.slug as string
const profile = ref<any>(null)
const error = ref('')
const loading = ref(true)

// --- THEME CONFIGURATION ---
const themeStyles = {
  modern: {
    font: 'font-sans',
    bg: 'bg-white dark:bg-zinc-950', 
    container: 'max-w-4xl mx-auto w-full px-4 sm:px-6 py-20 relative z-10',
    card: 'overflow-hidden py-0 border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl',
    banner: 'rounded-t-3xl',
    avatarContainer: 'rounded-2xl border-4 border-white dark:border-zinc-900 shadow-xl',
    avatar: 'rounded-xl',
    button: 'shadow-lg hover:brightness-110 active:scale-95 transition-all rounded-full font-semibold tracking-tight',
    badge: 'rounded-full border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md',
    social: 'rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
  },
  corporate: {
    font: 'font-serif', 
    bg: 'bg-zinc-50 dark:bg-zinc-950',
    container: 'max-w-5xl mx-auto w-full px-0 sm:px-6 py-0 sm:py-12 relative z-10',
    card: 'overflow-hidden py-0 border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 rounded-none sm:rounded-sm',
    banner: '',
    avatarContainer: 'rounded-none border-4 border-white dark:border-zinc-900 shadow-sm',
    avatar: 'rounded-none',
    button: 'rounded-none hover:opacity-90 transition-opacity uppercase tracking-wider font-bold text-xs',
    badge: 'rounded-none uppercase tracking-widest text-[10px] font-bold border border-zinc-200 bg-zinc-50',
    social: 'rounded-none border border-zinc-200 hover:bg-zinc-100'
  },
  creative: {
    font: 'font-mono',
    bg: 'bg-yellow-50 dark:bg-zinc-950', 
    container: 'max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 relative z-10',
    card: 'overflow-hidden py-0 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] bg-white dark:bg-zinc-900 rounded-xl',
    banner: 'rounded-t-lg border-black dark:border-white',
    avatarContainer: 'rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-white',
    avatar: 'rounded-none',
    button: 'rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
    badge: 'rounded-none border-2 border-black dark:border-white font-bold bg-white text-black',
    social: 'rounded-md border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all'
  }
}

// Map colors to Tailwind classes
const colorMap: Record<string, { bg: string, text: string, gradient: string, ring: string, shadow: string }> = {
    indigo: { 
        bg: 'bg-indigo-600', 
        text: 'text-indigo-600 dark:text-indigo-400', 
        gradient: 'from-indigo-600 to-violet-600',
        ring: 'ring-indigo-500/20',
        shadow: 'shadow-indigo-500/25'
    },
    blue: { 
        bg: 'bg-blue-600', 
        text: 'text-blue-600 dark:text-blue-400', 
        gradient: 'from-blue-600 to-cyan-500',
        ring: 'ring-blue-500/20',
        shadow: 'shadow-blue-500/25'
    },
    emerald: { 
        bg: 'bg-emerald-600', 
        text: 'text-emerald-600 dark:text-emerald-400', 
        gradient: 'from-emerald-600 to-teal-500',
        ring: 'ring-emerald-500/20',
        shadow: 'shadow-emerald-500/25'
    },
    rose: { 
        bg: 'bg-rose-600', 
        text: 'text-rose-600 dark:text-rose-400', 
        gradient: 'from-rose-600 to-pink-500',
        ring: 'ring-rose-500/20',
        shadow: 'shadow-rose-500/25'
    },
    gray: { 
        bg: 'bg-zinc-900', 
        text: 'text-zinc-900 dark:text-zinc-100', 
        gradient: 'from-zinc-800 to-black',
        ring: 'ring-zinc-500/20',
        shadow: 'shadow-zinc-500/25'
    }
}

// Ensure strict typing for styles
const activeTheme = computed(() => {
    if (!profile.value) return themeStyles.modern
    const t = profile.value.publicTemplate || 'modern'
    if (Object.keys(themeStyles).includes(t)) {
        return themeStyles[t as keyof typeof themeStyles]
    }
    return themeStyles.modern
})

const themeColor = computed(() => {
    if (!profile.value) return colorMap.indigo
    const color = profile.value.accentColor || 'indigo'
    return colorMap[color] || colorMap.indigo
})

const memberSince = computed(() => {
    if (!profile.value?.createdAt) return new Date().getFullYear()
    return new Date(profile.value.createdAt).getFullYear()
})

const handleLogin = () => { 
    toast.info(`Existing clients should check their inbox for a magic link from ${profile.value?.name}.`)
}

onMounted(async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/public/agency/${slug}`)
        if (!res.ok) throw new Error('Profile not found')
        profile.value = await res.json()
    } catch (err) { error.value = 'This profile does not exist.' } finally { loading.value = false }
})
</script>
<template>
    <div v-if="loading" class="h-screen flex items-center justify-center bg-white dark:bg-zinc-950 relative overflow-hidden">
         <div class="fixed inset-0 z-0 pointer-events-none">
           <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>
        <div class="relative z-10 flex flex-col items-center gap-4">
             <div class="h-12 w-12 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center animate-pulse">
                <Zap class="h-6 w-6 text-white dark:text-zinc-900 fill-current" />
             </div>
             <p class="text-zinc-500 font-medium tracking-tight">Loading Profile...</p>
        </div>
    </div>

    <div v-else-if="error" class="h-screen flex items-center justify-center text-center p-4 bg-white dark:bg-zinc-950 relative overflow-hidden">
        <div class="fixed inset-0 z-0 pointer-events-none">
           <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <div class="max-w-md w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-10 flex flex-col items-center shadow-2xl relative z-10">
            <div class="h-14 w-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                <Building2 class="h-7 w-7 text-zinc-500" />
            </div>
            <h1 class="text-xl font-bold mb-2 tracking-tight text-zinc-900 dark:text-white">Profile Not Found</h1>
            <p class="text-zinc-500">{{ error }}</p>
        </div>
    </div>

    <div v-else-if="profile" :class="[activeTheme.bg, activeTheme.font]" class="min-h-screen text-zinc-900 dark:text-zinc-50 flex flex-col relative overflow-hidden transition-colors duration-300">
        
        <div class="fixed inset-0 z-0 pointer-events-none">
             <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <div v-if="profile.publicTemplate === 'modern' || !profile.publicTemplate" class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-30 pointer-events-none z-0">
             <div :class="`absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full blur-[120px] mix-blend-screen opacity-50 ${themeColor?.bg}`"></div>
             <div :class="`absolute top-[10%] right-[-10%] w-[50%] h-[70%] rounded-full blur-[100px] mix-blend-screen opacity-30 ${themeColor?.bg}`"></div>
        </div>

        <div v-if="profile.publicTemplate !== 'corporate'" class="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.05]" 
             style="background-image: radial-gradient(#888 1px, transparent 1px); background-size: 32px 32px;">
        </div>

        <main :class="activeTheme.container">
            <Card :class="activeTheme.card">
                <div class="relative">
                    <div :class="`h-40 w-full bg-linear-to-r ${themeColor?.gradient} ${activeTheme.banner}`"></div>

                    <div class="px-8 pb-8 -mt-20 flex flex-col md:flex-row gap-8 items-start md:items-end relative z-10">
                        
                        <div class="relative group">
                            <div v-if="profile.publicTemplate === 'modern'" :class="`absolute -inset-1 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500 ${themeColor?.bg}`"></div>
                            
                            <Avatar class="h-36 w-36 relative bg-white dark:bg-zinc-900" :class="activeTheme.avatarContainer">
                                <AvatarImage :src="profile.image" class="object-cover" :class="activeTheme.avatar" />
                                <AvatarFallback class="text-white text-5xl font-bold" :class="[themeColor?.bg, activeTheme.avatar]">
                                    {{ profile.name?.[0] || 'A' }}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        
                        <div class="flex-1 space-y-2 mb-2 pt-2">
                            <div class="flex items-center gap-3 flex-wrap">
                                <h1 class="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white text-balance">
                                    {{ profile.name }}
                                </h1>
                                <Badge v-if="profile.tier === 'pro'" variant="secondary" :class="[activeTheme.badge, 'px-3 py-1 h-7 gap-1.5 font-medium']">
                                    <CheckCircle2 :class="`h-4 w-4 ${themeColor?.text}`" />
                                    <span class="text-zinc-600 dark:text-zinc-400">Verified</span>
                                </Badge>
                            </div>
                            
                            <p v-if="profile.headline" class="text-xl text-zinc-500 dark:text-zinc-400 font-medium text-balance leading-relaxed tracking-tight">
                                {{ profile.headline }}
                            </p>
                            <p v-else class="text-zinc-500">Professional Service Provider</p>
                            
                            <div class="flex gap-3 pt-4">
                                <a v-if="profile.websiteUrl" :href="profile.websiteUrl" target="_blank" 
                                   :class="activeTheme.social"
                                   class="h-10 w-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all duration-300">
                                    <Globe class="h-5 w-5" />
                                </a>
                                <a v-if="profile.linkedinUrl" :href="profile.linkedinUrl" target="_blank" 
                                   :class="activeTheme.social"
                                   class="h-10 w-10 flex items-center justify-center text-zinc-500 hover:text-blue-600 transition-all duration-300">
                                    <Linkedin class="h-5 w-5" />
                                </a>
                                <a v-if="profile.twitterUrl" :href="profile.twitterUrl" target="_blank" 
                                   :class="activeTheme.social"
                                   class="h-10 w-10 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white transition-all duration-300">
                                    <Twitter class="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        <div class="w-full md:w-auto mt-6 md:mt-0">
                            <Button size="lg" 
                                :class="[`w-full md:w-auto h-12 px-8 text-base`, activeTheme.button, themeColor?.bg, themeColor?.shadow]" 
                                class="text-white hover:opacity-90"
                                @click="handleLogin">
                                <LogIn class="h-4 w-4 mr-2" /> 
                                Client Portal
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator v-if="profile.publicTemplate !== 'creative'" class="bg-zinc-100 dark:bg-zinc-800" />
                <div v-else class="h-0.5 bg-black dark:bg-white w-full"></div>

                <CardContent class="p-8 md:p-10 grid gap-12">
                    
                    <div class="grid md:grid-cols-3 gap-12">
                        <div class="md:col-span-2 space-y-6">
                            <h3 class="text-xl font-bold tracking-tight flex items-center gap-3 text-zinc-900 dark:text-white">
                                <span :class="`w-1.5 h-6 ${themeColor?.bg} ${activeTheme.avatar === 'rounded-xl' ? 'rounded-full' : 'rounded-none'}`"></span>
                                About Me
                            </h3>
                            <div class="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                                <p v-if="profile.bio" class="whitespace-pre-wrap">{{ profile.bio }}</p>
                                <p v-else class="italic opacity-60">
                                    Welcome to my client portal. This is where I track work logs and share progress updates with my clients.
                                </p>
                            </div>
                        </div>

                        <div class="md:col-span-1">
                            <div :class="[
                                'p-8 flex flex-col gap-6 sticky top-8',
                                profile.publicTemplate === 'creative' 
                                    ? 'bg-white dark:bg-zinc-900 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-lg' 
                                    : 'bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl'
                            ]">
                                <div>
                                    <h4 class="font-bold text-zinc-900 dark:text-white mb-2 text-lg tracking-tight">Let's Connect</h4>
                                    <p class="text-zinc-500 text-sm leading-relaxed">Interested in starting a new project together? Get in touch.</p>
                                </div>
                                <Button as-child variant="outline" :class="['w-full h-12 justify-between group', profile.publicTemplate === 'creative' ? 'border-2 border-black bg-white hover:bg-zinc-100 rounded-md shadow-none' : 'rounded-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800']">
                                    <a :href="`mailto:${profile.email}`">
                                        <span class="flex items-center gap-2 font-medium"><Mail class="h-4 w-4" /> Email Me</span>
                                        <ArrowRight class="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </a>
                                </Button>
                                <div class="text-xs text-zinc-400 text-center pt-4 border-t border-zinc-200 dark:border-zinc-800 font-medium uppercase tracking-widest">
                                    Member since {{ memberSince }}
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

            <div class="mt-12 text-center pb-8">
                <p class="text-zinc-400 dark:text-zinc-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Zap class="w-3 h-3" /> Powered by ZenPortal
                </p>
            </div>
        </main>
    </div>
</template>
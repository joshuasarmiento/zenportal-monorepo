<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '../../stores/userStore'
import { useRoute } from 'vue-router'
import { UserAvatar, UserButton } from '@clerk/vue'

const route = useRoute()
const userStore = useUserStore()

// Load user data when sidebar mounts
onMounted(() => {
    userStore.fetchUser()
})

const links = [
    { name: 'Dashboard', path: '/dashboard', icon: 'ph-squares-four' },
    { name: 'Clients', path: '/clients', icon: 'ph-users' },
    { name: 'Earnings', path: '/earnings', icon: 'ph-chart-bar' },
    { name: 'Settings', path: '/settings', icon: 'ph-gear' },
]
</script>

<template>
    <aside class="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
        <div class="p-6 border-b border-slate-800">
            <h1 class="text-xl font-bold text-blue-400">ZenPortal<span class="text-white">.io</span></h1>
        </div>

        <nav class="flex-1 p-4 space-y-2">
            <router-link v-for="link in links" :key="link.path" :to="link.path"
                class="flex items-center space-x-3 px-4 py-3 rounded-lg transition"
                :class="route.path === link.path ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'">
                <i :class="`ph ${link.icon} text-xl`"></i>
                <span class="font-medium">{{ link.name }}</span>
            </router-link>
        </nav>

        <div class="p-4 border-t border-slate-800">
            <div class="flex items-center gap-3">
                <UserAvatar />
                <div class="overflow-hidden">
                    <p class="text-sm font-bold truncate">{{ userStore.user?.fullName || 'Loading...' }}</p>
                    <p class="text-xs text-slate-400 truncate">{{ userStore.planName }}</p>
                </div>
            </div>
        </div>
    </aside>
</template>
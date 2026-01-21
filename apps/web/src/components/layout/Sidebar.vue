<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: 'ph-squares-four' },
  { name: 'Clients', path: '/clients', icon: 'ph-users' },
  { name: 'Earnings', path: '/earnings', icon: 'ph-chart-bar' },
]
</script>

<template>
  <aside class="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 hidden md:flex">
    <div class="p-6 border-b border-slate-800">
      <h1 class="text-xl font-bold tracking-tight text-blue-400">ZenPortal<span class="text-white">.io</span></h1>
      <p class="text-xs text-slate-400 mt-1">Pro Workspace</p>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <router-link 
        v-for="link in links" 
        :key="link.path" 
        :to="link.path"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg transition"
        :class="route.path === link.path ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
      >
        <i :class="`ph ${link.icon} text-xl`"></i>
        <span class="font-medium">{{ link.name }}</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <router-link to="/settings" class="flex items-center space-x-3 group">
        <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold shadow-md group-hover:ring-2 group-hover:ring-blue-400 transition">
            JD
        </div>
        <div>
          <p class="text-sm font-medium group-hover:text-blue-400 transition">Juan Dela Cruz</p>
          <p class="text-xs text-slate-400">Pro Member</p>
        </div>
      </router-link>
    </div>
  </aside>
</template>
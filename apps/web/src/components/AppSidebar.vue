<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Zap,
  ChevronsUpDown,
  Sparkles,
  LogOut
} from 'lucide-vue-next'
import { useApi } from '@/lib/api'
import { SignOutButton } from '@clerk/vue'

const { fetchApi } = useApi()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)

const isPro = computed(() => userStore.user?.tier === 'pro')

const handleUpgrade = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/billing/checkout', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (err) {
    alert('Failed to start checkout')
  } finally {
    loading.value = false
  }
}

const handlePortal = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/billing/portal', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (err) {
    alert('Failed to open portal')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  userStore.fetchUser()
})

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', path: '/clients', icon: Users },
  { name: 'Earnings', path: '/earnings', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
]
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Zap class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="truncate font-bold text-blue-600 dark:text-blue-400">ZenPortal<span
                  class="text-muted-foreground">.io</span></span>
              <span class="truncate text-xs text-muted-foreground">Agency Admin</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="link in links" :key="link.path">
            <SidebarMenuButton as-child :isActive="route.path === link.path" :tooltip="link.name">
              <router-link :to="link.path">
                <component :is="link.icon" />
                <span>{{ link.name }}</span>
              </router-link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage :src="userStore.user?.avatarUrl || ''" :alt="userStore.user?.fullName || ''" />
                  <AvatarFallback
                    class="rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200 font-bold">
                    {{ userStore.user?.fullName?.[0] || 'U' }}
                  </AvatarFallback>
                </Avatar>

                <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span class="truncate font-semibold">{{ userStore.user?.fullName || 'Loading...' }}</span>
                  <span class="truncate text-xs text-muted-foreground">{{ userStore.user?.email || '' }}</span>
                </div>

                <ChevronsUpDown class="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom"
              align="end" :side-offset="4">
              <DropdownMenuItem @click="isPro ? handlePortal() : handleUpgrade()" :disabled="loading"
                class="cursor-pointer">
                <Sparkles class="mr-2 h-4 w-4" />
                <span v-if="loading">Processing...</span>
                <span v-else-if="isPro">Manage Billing</span>
                <span v-else>Upgrade Now ($12/mo)</span>
              </DropdownMenuItem>

              <DropdownMenuItem @click="$router.push('/settings')" class="cursor-pointer">
                <Settings class="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem as-child>
                <SignOutButton
                  class="w-full items-center px-2 py-1.5 cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400">
                  <div class="flex">
                    <LogOut class="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </div>
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
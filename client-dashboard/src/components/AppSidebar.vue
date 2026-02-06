<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from '@/components/ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useColorMode } from '@vueuse/core'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  Zap, 
  ChevronsUpDown, 
  Sparkles, 
  LogOut,
  BookOpen,
  Moon,    
  Sun,  
  Laptop,
  ChevronRight
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useApi } from '@/lib/api'

const { fetchApi } = useApi()
const mode = useColorMode()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)

const isPro = computed(() => userStore.isPro)

onMounted(() => {
  userStore.fetchUser()
})

const handleLogout = async () => {
  await userStore.logout()
}

const handleUpgrade = async () => {
  loading.value = true
  try {
    const response = await fetchApi('/api/billing/subscribe', { method: 'POST' })
    const session = response.data
    if (session?.attributes?.checkout_url) {
      localStorage.setItem('pending_checkout_id', session.id)
      window.location.href = session.attributes.checkout_url
    } else {
      toast.error('Failed to get checkout URL')
    }
  } catch (err: any) {
    toast.error('An unexpected error occurred during upgrade.', {
      description: err.message
    })
  } finally {
    loading.value = false
  }
}

const handlePortal = () => {
  toast.info("Manage Subscription", { description: "Contact support to modify your plan." })
}

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', path: '/clients', icon: Users },
  { name: 'Earnings', path: '/earnings', icon: BarChart3 },
]

const supportItems = [
  {
    name: 'User Guide',
    icon: BookOpen,
    children: [
      { name: 'Getting Started', path: '/help/getting-started' },
      { name: 'Clients & Access', path: '/help/clients-access' },
      { name: 'Logging Work', path: '/help/logging-work' },
      { name: 'Earnings & Goals', path: '/help/earnings-goals' },
      { name: 'API & Automation', path: '/help/api-automation' },
    ],
  },
  {
    name: 'Settings',
    icon: Settings,
    children: [
      { name: 'My Profile', path: '/settings/profile' },
      { name: 'Branding & Look', path: '/settings/branding' },
      { name: 'Billing (Stripe)', path: '/settings/billing' },
      { name: 'Notifications', path: '/settings/notifications' },
      { name: 'API Access', path: '/settings/api' },
    ],
  },
]

const isGroupActive = (children: { path: string }[]) => {
  return children.some(child => child.path === route.path)
}
</script>

<template>
  <Sidebar collapsible="icon" class="border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
    <SidebarHeader class="pt-4 pb-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-md">
              <Zap class="size-4 fill-current" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="truncate font-bold text-zinc-900 dark:text-white tracking-tight">ZenPortal</span>
              <span class="truncate text-xs text-zinc-500 font-medium">Admin</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent class="gap-0">
      <SidebarGroup class="py-2">
        <SidebarGroupLabel class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-2">Platform</SidebarGroupLabel>
        <SidebarMenu>
          <template v-for="item in menuItems" :key="item.name">
            <SidebarMenuItem>
              <SidebarMenuButton as-child :isActive="route.path === item.path" :tooltip="item.name" class="font-medium text-zinc-600 dark:text-zinc-400 data-[active=true]:text-zinc-900 dark:data-[active=true]:text-white data-[active=true]:bg-zinc-100 dark:data-[active=true]:bg-zinc-900">
                <router-link :to="item.path">
                  <component :is="item.icon" />
                  <span>{{ item.name }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </template>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup class="py-2">
        <SidebarGroupLabel class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-2">Configuration</SidebarGroupLabel>
        <SidebarMenu>
          <template v-for="item in supportItems" :key="item.name">
             <Collapsible 
              as-child 
              :default-open="isGroupActive(item.children)" 
              class="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton :isActive="isGroupActive(item.children)" :tooltip="item.name" class="font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                    <component :is="item.icon" />
                    <span>{{ item.name }}</span>
                    <ChevronRight
                      class="ml-auto size-4 text-zinc-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" 
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu class="ml-2 w-3/4 mt-2.5 border-l border-zinc-200 dark:border-zinc-800 pl-2">
                    <SidebarMenuItem v-for="child in item.children" :key="child.name">
                      <router-link :to="child.path" custom v-slot="{ href, navigate, isActive }">
                        <SidebarMenuButton :href="href" @click="navigate" :isActive="isActive" size="sm" class="text-zinc-500 dark:text-zinc-500 data-[active=true]:text-zinc-900 dark:data-[active=true]:text-white h-8 text-xs font-medium">
                          {{ child.name }}
                        </SidebarMenuButton>
                      </router-link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </template>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="border-t border-zinc-100 dark:border-zinc-900 p-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton size="lg"
                class="data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <Avatar class="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <AvatarImage :src="userStore.user?.image || ''" :alt="userStore.user?.name || ''" />
                  <AvatarFallback
                    class="rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white font-bold text-xs">
                    {{ userStore.initials }}
                  </AvatarFallback>
                </Avatar>

                <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span class="truncate font-semibold text-zinc-900 dark:text-white">{{ userStore.user?.name || 'Loading...' }}</span>
                  <span class="truncate text-xs text-zinc-500">{{ userStore.user?.email || '' }}</span>
                </div>

                <ChevronsUpDown class="ml-auto size-4 text-zinc-400" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl" side="bottom"
              align="end" :side-offset="8">
              <div class="px-2 py-1.5">
                 <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Account</span>
              </div>
              <DropdownMenuItem @click="isPro ? handlePortal() : handleUpgrade()" :disabled="loading"
                class="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900">
                <Sparkles class="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span v-if="loading">Processing...</span>
                <span v-else-if="isPro" class="font-medium text-blue-600 dark:text-blue-400">Manage Billing</span>
                <span v-else class="font-medium text-blue-600 dark:text-blue-400">Upgrade to Pro</span>
              </DropdownMenuItem>

              <DropdownMenuItem @click="$router.push('/settings/profile')" class="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900">
                <Settings class="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator class="bg-zinc-100 dark:bg-zinc-800" />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger class="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900">
                  <Sun class="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon class="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent class="rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl">
                    <DropdownMenuItem @click="mode = 'light'" class="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900">
                      <Sun class="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="mode = 'dark'" class="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900">
                      <Moon class="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="mode = 'auto'" class="cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900">
                      <Laptop class="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator class="bg-zinc-100 dark:bg-zinc-800" />

              <DropdownMenuItem @click="handleLogout"
                class="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/10">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
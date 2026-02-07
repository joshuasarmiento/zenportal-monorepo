<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarGroup, SidebarGroupLabel, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar'
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
import { authClient } from '@/lib/auth-client'

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
    const { data, error } = await authClient.dodopayments.checkoutSession({
      slug: 'pro-plan',
    })

    if (error) {
      toast.error(error.message || "Failed to start checkout")
      return
    }

    if (data?.url) {
      window.location.href = data.url
    }
  } catch (err: any) {
    toast.error('Failed to start checkout', {
      description: err.message
    })
  } finally {
    loading.value = false
  }
}

const handlePortal = async () => {
  loading.value = true
  try {
    const { data, error } = await authClient.dodopayments.customer.portal()
    
    if (error) {
      toast.error(error.message || "Failed to open portal")
      return
    }

    if (data?.url) {
      window.location.href = data.url
    }
  } catch(err) {
    toast.error("Failed to redirect to portal")
  } finally {
    loading.value = false
  }
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
  <Sidebar collapsible="icon" class="border-r border-border bg-sidebar">
    <SidebarHeader class="pt-4 pb-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
              <Zap class="size-4 fill-current" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="truncate font-bold text-foreground tracking-tight">ZenPortal</span>
              <span class="truncate text-xs text-muted-foreground font-medium">Admin</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent class="gap-0">
      <SidebarGroup class="py-2">
        <SidebarGroupLabel class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Platform</SidebarGroupLabel>
        <SidebarMenu>
          <template v-for="item in menuItems" :key="item.name">
            <SidebarMenuItem>
              <SidebarMenuButton as-child :isActive="route.path === item.path" :tooltip="item.name" class="font-medium text-muted-foreground data-[active=true]:text-foreground data-[active=true]:bg-sidebar-accent">
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
        <SidebarGroupLabel class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Configuration</SidebarGroupLabel>
        <SidebarMenu>
          <template v-for="item in supportItems" :key="item.name">
             <Collapsible 
              as-child 
              :default-open="isGroupActive(item.children)" 
              class="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton :isActive="isGroupActive(item.children)" :tooltip="item.name" class="font-medium text-muted-foreground hover:text-foreground">
                    <component :is="item.icon" />
                    <span>{{ item.name }}</span>
                    <ChevronRight
                      class="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" 
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem v-for="child in item.children" :key="child.name">
                      <router-link :to="child.path" custom v-slot="{ href, navigate, isActive }">
                        <SidebarMenuSubButton :href="href" @click="navigate" :isActive="isActive" class="text-muted-foreground data-[active=true]:text-foreground cursor-pointer">
                          <span>{{ child.name }}</span>
                        </SidebarMenuSubButton>
                      </router-link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </template>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="border-t border-border p-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton size="lg"
                class="data-[state=open]:bg-sidebar-accent hover:bg-sidebar-accent/50 transition-colors">
                <Avatar class="h-8 w-8 rounded-lg border border-border">
                  <AvatarImage :src="userStore.user?.image || ''" :alt="userStore.user?.name || ''" />
                  <AvatarFallback
                    class="rounded-lg bg-muted text-foreground font-bold text-xs">
                    {{ userStore.initials }}
                  </AvatarFallback>
                </Avatar>

                <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span class="truncate font-semibold text-foreground">{{ userStore.user?.name || 'Loading...' }}</span>
                  <span class="truncate text-xs text-muted-foreground">{{ userStore.user?.email || '' }}</span>
                </div>

                <ChevronsUpDown class="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-xl border-border shadow-xl" side="bottom"
              align="end" :side-offset="8">
              <div class="px-2 py-1.5">
                 <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</span>
              </div>
              <DropdownMenuItem @click="isPro ? handlePortal() : handleUpgrade()" :disabled="loading"
                class="cursor-pointer focus:bg-sidebar-accent">
                <Sparkles class="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span v-if="loading">Processing...</span>
                <span v-else-if="isPro" class="font-medium text-blue-600 dark:text-blue-400">Manage Billing</span>
                <span v-else class="font-medium text-blue-600 dark:text-blue-400">Upgrade to Pro</span>
              </DropdownMenuItem>

              <DropdownMenuItem @click="$router.push('/settings/profile')" class="cursor-pointer focus:bg-sidebar-accent">
                <Settings class="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator class="bg-border" />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger class="cursor-pointer focus:bg-sidebar-accent">
                  <Sun class="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon class="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent class="rounded-xl border-border shadow-xl">
                    <DropdownMenuItem @click="mode = 'light'" class="cursor-pointer focus:bg-sidebar-accent">
                      <Sun class="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="mode = 'dark'" class="cursor-pointer focus:bg-sidebar-accent">
                      <Moon class="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="mode = 'auto'" class="cursor-pointer focus:bg-sidebar-accent">
                      <Laptop class="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator class="bg-border" />

              <DropdownMenuItem @click="handleLogout"
                class="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
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
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from '@/components/ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useColorMode } from '@vueuse/core'
import { UserProfile, SignOutButton } from '@clerk/vue'
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
  UserCircle,
  ChevronRight
} from 'lucide-vue-next'
import { useApi } from '@/lib/api'
import { useAuthSync } from '@/composables/useAuthSync'

const mode = useColorMode()
const { fetchApi } = useApi()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const isProfileSheetOpen = ref(false)

const isPro = computed(() => userStore.user?.tier === 'pro')

// Centralized user fetching and syncing logic
useAuthSync();

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

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', path: '/clients', icon: Users },
  { name: 'Earnings', path: '/earnings', icon: BarChart3 },
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
        <SidebarMenu>
          <template v-for="item in menuItems" :key="item.name">
            <SidebarMenuItem v-if="!item.children">
              <SidebarMenuButton as-child :isActive="route.path === item.path" :tooltip="item.name">
                <router-link :to="item.path">
                  <component :is="item.icon" />
                  <span>{{ item.name }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Collapsible v-else as-child>
              <SidebarMenuItem class="relative">
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton>
                    <component :is="item.icon" />
                    <span>{{ item.name }}</span>
                    <ChevronRight
                      class="absolute right-2 size-4 shrink-0 translate-y-0.5 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu class="ml-7 mt-2 border-l border-border pl-4 w-2/3">
                    <SidebarMenuItem v-for="child in item.children" :key="child.name">
                      <router-link :to="child.path" custom v-slot="{ href, navigate, isActive }">
                        <SidebarMenuButton :href="href" @click="navigate" :isActive="isActive" size="sm" variant="default">
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

               <!-- <DropdownMenuItem @click="isProfileSheetOpen = true" class="cursor-pointer">
                <UserCircle class="mr-2 h-4 w-4" />
                <span>Manage Account</span>
              </DropdownMenuItem> -->

              <DropdownMenuItem @click="$router.push('/settings')" class="cursor-pointer">
                <Settings class="mr-2 h-4 w-4" />
                <span>All Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger class="cursor-pointer">
                  <Sun class="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon class="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem @click="mode = 'light'" class="cursor-pointer">
                      <Sun class="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="mode = 'dark'" class="cursor-pointer">
                      <Moon class="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="mode = 'auto'" class="cursor-pointer">
                      <Laptop class="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

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

  <!-- Profile Settings Modal/Sheet -->
  <!-- <Sheet :open="isProfileSheetOpen" @update:open="isProfileSheetOpen = $event">
    <SheetContent class="w-full">
        <SheetHeader class="mb-4">
            <SheetTitle>Manage Account</SheetTitle>
            <SheetDescription>Update your photo, password, and personal details via Clerk.</SheetDescription>
        </SheetHeader>
        <div class="py-4">
             <UserProfile :appearance="{
                elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none border-none w-full',
                    navbar: 'hidden',
                    pageScrollBox: 'p-0',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    profilePage__security: 'p-0',
                    profilePage__account: 'p-0'
                }
            }" />
        </div>
    </SheetContent>
  </Sheet> -->
</template>
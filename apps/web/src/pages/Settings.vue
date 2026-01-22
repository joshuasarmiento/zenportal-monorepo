<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import ProfileSettings from '../components/settings/ProfileSettings.vue'
import BrandingSettings from '../components/settings/BrandingSettings.vue'
import BillingSettings from '../components/settings/BillingSettings.vue'
import NotificationSettings from '../components/settings/NotificationSettings.vue'

const activeTab = ref('profile')
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
       <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="#">Platform</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
         <div class="max-w-5xl mx-auto w-full">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="md:col-span-1 space-y-1">
                    <button @click="activeTab = 'profile'"
                        class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition text-sm"
                        :class="activeTab === 'profile' ? 'bg-background text-primary border-border shadow-sm' : 'text-muted-foreground border-transparent hover:bg-muted'">
                        My Profile
                    </button>
                    <button @click="activeTab = 'branding'"
                        class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition text-sm"
                        :class="activeTab === 'branding' ? 'bg-background text-primary border-border shadow-sm' : 'text-muted-foreground border-transparent hover:bg-muted'">
                        Branding & Look
                    </button>
                    <button @click="activeTab = 'billing'"
                        class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition text-sm"
                        :class="activeTab === 'billing' ? 'bg-background text-primary border-border shadow-sm' : 'text-muted-foreground border-transparent hover:bg-muted'">
                        Billing (Stripe)
                    </button>
                    <button @click="activeTab = 'notifications'"
                        class="w-full text-left px-4 py-2.5 rounded-lg font-medium border transition text-sm"
                        :class="activeTab === 'notifications' ? 'bg-background text-primary border-border shadow-sm' : 'text-muted-foreground border-transparent hover:bg-muted'">
                        Notifications
                    </button>
                </div>

                <div class="md:col-span-3 space-y-6">
                    <ProfileSettings v-if="activeTab === 'profile'" />
                    <BrandingSettings v-if="activeTab === 'branding'" />
                    <BillingSettings v-if="activeTab === 'billing'" />
                    <NotificationSettings v-if="activeTab === 'notifications'" />
                </div>
            </div>
         </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
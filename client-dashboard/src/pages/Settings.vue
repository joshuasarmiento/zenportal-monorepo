<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="bg-zinc-50 dark:bg-black">
       <header class="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                 <BreadcrumbPage class="font-semibold text-zinc-900 dark:text-white tracking-tight">Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-6 md:p-10 overflow-y-auto">
         <div class="max-w-4xl mx-auto w-full">
            <router-view />
         </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
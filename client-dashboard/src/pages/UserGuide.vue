<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { MessageCircle, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="bg-zinc-50 dark:bg-black">
      <header class="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" />
          <Separator orientation="vertical" class="mr-2 h-4 bg-zinc-200 dark:bg-zinc-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage class="font-semibold text-zinc-900 dark:text-white tracking-tight">User Guide</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-6 md:p-10 overflow-y-auto">
        <div class="max-w-3xl mx-auto w-full space-y-16 pb-20">
      
          <section class="text-center space-y-6 pt-8">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">How to use ZenPortal</h1>
            <p class="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              The complete guide to managing clients, logging "Proof of Work," and getting paid faster.
            </p>
          </section>

          <div class="prose prose-zinc dark:prose-invert max-w-none">
             <router-view />
          </div>

          <Separator class="bg-zinc-200 dark:bg-zinc-800" />

          <section class="flex flex-col items-center justify-center py-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
            <div class="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
               <MessageCircle class="h-6 w-6 text-zinc-900 dark:text-white" />
            </div>
            <h3 class="text-lg font-bold mb-2 text-zinc-900 dark:text-white tracking-tight">Still have questions?</h3>
            <p class="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">Priority support is available for Agency Pro users.</p>
            <Button size="lg" class="rounded-full px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:scale-105 transition-transform" as-child>
               <a href="mailto:support@zenportal.com.ph">Contact Support <ArrowRight class="ml-2 h-4 w-4" /></a>
            </Button>
          </section>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
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
              <BreadcrumbItem>
                <BreadcrumbPage>User Guide</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        <div class="max-w-4xl mx-auto w-full space-y-12 pb-20">
      
          <section class="text-center space-y-4 pt-4">
            <h1 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">How to use ZenPortal</h1>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              The complete guide to managing clients, logging "Proof of Work," and getting paid faster.
            </p>
          </section>

          <router-view />

          <Separator />

          <section class="text-center py-8">
            <h3 class="text-xl font-bold mb-2 text-foreground">Still have questions?</h3>
            <p class="text-muted-foreground mb-6">Priority support is available for Pro users.</p>
            <Button size="lg" as-child>
               <a href="mailto:support@zenportal.io">Contact Support</a>
            </Button>
          </section>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
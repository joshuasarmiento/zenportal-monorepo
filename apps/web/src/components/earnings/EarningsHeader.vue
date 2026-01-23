<script setup lang="ts">
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-vue-next'

defineProps<{
  loading: boolean
  exporting: boolean
}>()

const emit = defineEmits(['export'])
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block"><BreadcrumbLink href="#">Platform</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem><BreadcrumbPage>Earnings</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <div class="ml-auto flex items-center gap-2">
      <Button variant="outline" size="sm" class="gap-2" @click="emit('export')" :disabled="exporting || loading">
        <Loader2 v-if="exporting" class="h-4 w-4 animate-spin" />
        <Download v-else class="h-4 w-4" /> 
        Export
      </Button>
    </div>
  </header>
</template>
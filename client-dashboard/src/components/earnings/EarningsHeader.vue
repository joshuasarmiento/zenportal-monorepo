<script setup lang="ts">
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Download, FileText, File, Lock, Loader2 } from 'lucide-vue-next'

defineProps<{
  loading: boolean
  exporting: boolean
  isPro: boolean 
}>()

const emit = defineEmits(['export-csv', 'export-pdf', 'upgrade'])
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-10 print:hidden">
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
      
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="sm" class="gap-2" :disabled="loading || exporting">
            <Loader2 v-if="exporting" class="h-4 w-4 animate-spin" />
            <Download v-else class="h-4 w-4" />
            Export Report
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuItem @click="isPro ? emit('export-csv') : emit('upgrade')" class="cursor-pointer gap-2">
            <FileText class="h-4 w-4 text-muted-foreground" />
            <span>Export CSV</span>
            <Lock v-if="!isPro" class="ml-auto h-3 w-3 text-amber-500" />
          </DropdownMenuItem>

          <DropdownMenuItem @click="isPro ? emit('export-pdf') : emit('upgrade')" class="cursor-pointer gap-2">
            <File class="h-4 w-4 text-muted-foreground" />
            <span>Export PDF</span>
            <Lock v-if="!isPro" class="ml-auto h-3 w-3 text-amber-500" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  </header>
</template>
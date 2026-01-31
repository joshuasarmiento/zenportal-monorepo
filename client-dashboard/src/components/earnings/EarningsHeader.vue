<script setup lang="ts">
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
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
  <header class="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 sticky top-0 z-10 print:hidden transition-colors duration-300">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" />
      <Separator orientation="vertical" class="mr-2 h-4 bg-zinc-200 dark:bg-zinc-800" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage class="font-semibold text-zinc-900 dark:text-white tracking-tight">Earnings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="sm" class="gap-2 h-9 rounded-full border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" :disabled="loading || exporting">
            <Loader2 v-if="exporting" class="h-3.5 w-3.5 animate-spin" />
            <Download v-else class="h-3.5 w-3.5" />
            Export
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" class="w-48 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <DropdownMenuItem @click="isPro ? emit('export-csv') : emit('upgrade')" class="cursor-pointer gap-2 focus:bg-zinc-50 dark:focus:bg-zinc-900">
            <FileText class="h-4 w-4 text-zinc-500" />
            <span>Export CSV</span>
            <Lock v-if="!isPro" class="ml-auto h-3 w-3 text-orange-500" />
          </DropdownMenuItem>

          <DropdownMenuItem @click="isPro ? emit('export-pdf') : emit('upgrade')" class="cursor-pointer gap-2 focus:bg-zinc-50 dark:focus:bg-zinc-900">
            <File class="h-4 w-4 text-zinc-500" />
            <span>Export PDF</span>
            <Lock v-if="!isPro" class="ml-auto h-3 w-3 text-orange-500" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
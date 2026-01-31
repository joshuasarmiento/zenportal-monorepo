<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Moon, Sun } from 'lucide-vue-next'

const mode = useColorMode()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="h-9 w-9 rounded-full border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
        <Moon class="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-zinc-600" />
        <Sun class="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-zinc-300" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <DropdownMenuItem @click="mode = 'light'" class="cursor-pointer">
        Light
      </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'dark'" class="cursor-pointer">
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'auto'" class="cursor-pointer">
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
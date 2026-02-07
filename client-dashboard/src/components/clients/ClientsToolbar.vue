<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-vue-next'

defineProps<{
  search: string
  status: string
  sort: string
}>()

const emit = defineEmits(['update:search', 'update:status', 'update:sort'])
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 mb-8">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        :model-value="search"
        @update:model-value="emit('update:search', $event)"
        type="text" 
        placeholder="Search companies..." 
        class="pl-9 h-10 bg-background border-border focus:ring-2 focus:ring-ring rounded-lg transition-all" 
      />
    </div>
    
    <Select :model-value="status" @update:model-value="emit('update:status', $event)">
      <SelectTrigger class="w-full md:w-48 h-10 bg-background border-border rounded-lg">
        <SelectValue placeholder="Filter Status" />
      </SelectTrigger>
      <SelectContent class="border-border bg-popover">
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
    
    <Select :model-value="sort" @update:model-value="emit('update:sort', $event)">
      <SelectTrigger class="w-full md:w-48 h-10 bg-background border-border rounded-lg">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent class="border-border bg-popover">
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="name">Name (A-Z)</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
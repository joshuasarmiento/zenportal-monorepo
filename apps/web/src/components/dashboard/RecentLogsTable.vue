<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FileQuestion, Video, Paperclip, AlertCircle, Check, ChevronRight } from 'lucide-vue-next'

defineProps<{
  loading: boolean
  logs: any[]
}>()

const emit = defineEmits(['view'])
</script>

<template>
  <Card class="flex-1 flex flex-col min-h-[500px]">
    <CardHeader class="border-b border-border">
      <CardTitle>Recent Proof of Work</CardTitle>
    </CardHeader>
    <CardContent class="px-4 flex-1 flex flex-col">
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p class="text-muted-foreground">Loading your data...</p>
      </div>

      <div v-else-if="logs.length === 0" class="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <FileQuestion class="h-12 w-12 text-muted-foreground mb-3" />
        <h3 class="text-lg font-bold">No work logged yet</h3>
        <p class="text-muted-foreground mb-6">Create your first entry to impress your client.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead class="w-1/3">Summary</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="log in logs" 
              :key="log.id" 
              @click="emit('view', log.id)"
              class="cursor-pointer hover:bg-muted/50 transition-colors group"
              :class="{ 'bg-red-50/50 dark:bg-red-900/20': log.isBlocked }"
            >
              <TableCell class="font-medium text-muted-foreground">{{ log.date }}</TableCell>
              
              <TableCell>
                <Badge variant="secondary" class="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {{ log.client?.companyName || 'Unknown' }}
                </Badge>
              </TableCell>
              
              <TableCell class="truncate max-w-[200px] font-medium">{{ log.summary }}</TableCell>
              
              <TableCell>
                <div class="flex flex-col gap-1 items-start">
                  <div v-if="log.videoUrl" class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    <Video class="h-3.5 w-3.5" /> Video
                  </div>
                  <div v-if="log.attachmentUrl" class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                    <Paperclip class="h-3.5 w-3.5" /> File
                  </div>
                  <span v-if="!log.videoUrl && !log.attachmentUrl" class="text-muted-foreground text-xs">No evidence</span>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge v-if="log.isBlocked" variant="destructive" class="gap-1">
                  <AlertCircle class="h-3 w-3" /> Blocked
                </Badge>
                <Badge v-else variant="outline" class="gap-1 border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                  <Check class="h-3 w-3" /> Done
                </Badge>
              </TableCell>
              
              <TableCell class="text-right">
                <ChevronRight class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors inline-block" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</template>
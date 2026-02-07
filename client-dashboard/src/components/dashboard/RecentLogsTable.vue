<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Video, Paperclip, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-vue-next'

defineProps<{
  loading: boolean
  logs: any[]
}>()

const emit = defineEmits(['view', 'create']) // Added 'create' for empty state
</script>

<template>
  <Card class="flex-1 flex flex-col min-h-[500px] border border-border bg-card shadow-none">
    <CardHeader class="border-b border-border px-6 py-5">
      <div class="flex items-center justify-between">
         <CardTitle class="text-base font-semibold text-foreground">Recent Work Logs</CardTitle>
         </div>
    </CardHeader>
    <CardContent class="p-0 flex-1 flex flex-col">
      
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20">
        <div class="animate-spin w-6 h-6 border-2 border-foreground border-t-transparent rounded-full mb-4"></div>
        <p class="text-sm text-muted-foreground font-medium">Syncing data...</p>
      </div>

      <div v-else-if="logs.length === 0" class="flex-1 flex flex-col items-center justify-center py-24 text-center">
        <div class="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-6 border border-border">
            <FileText class="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-bold text-foreground mb-2">No work logged yet</h3>
        <p class="text-muted-foreground max-w-sm mb-8 text-sm">
           Your logs will appear here. Create your first entry to start building trust with your client.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <Table>
          <TableHeader class="bg-muted/50">
            <TableRow class="hover:bg-transparent border-b border-border">
              <TableHead class="w-[150px] pl-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</TableHead>
              <TableHead class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Client</TableHead>
              <TableHead class="w-1/3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Summary</TableHead>
              <TableHead class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Evidence</TableHead>
              <TableHead class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</TableHead>
              <TableHead class="text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="log in logs" 
              :key="log.id" 
              @click="emit('view', log.id)"
              class="cursor-pointer group border-b border-border hover:bg-muted/60 transition-colors last:border-0"
            >
              <TableCell class="pl-6 font-medium text-muted-foreground text-sm py-4">{{ log.date }}</TableCell>
              
              <TableCell class="py-4">
                <div class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                  {{ log.client?.companyName || 'Unknown' }}
                </div>
              </TableCell>
              
              <TableCell class="py-4">
                 <div class="truncate max-w-[280px] font-medium text-foreground text-sm">
                    {{ log.summary }}
                 </div>
              </TableCell>
              
              <TableCell class="py-4">
                <div class="flex flex-col gap-1 items-start">
                  <div v-if="log.videoUrl" class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold bg-blue-50 dark:bg-blue-900/10 px-2 py-1 rounded-md">
                    <Video class="h-3 w-3" /> Video
                  </div>
                  <div v-else-if="log.attachmentUrl" class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold bg-indigo-50 dark:bg-indigo-900/10 px-2 py-1 rounded-md">
                    <Paperclip class="h-3 w-3" /> File
                  </div>
                  <span v-else class="text-muted-foreground text-xs italic">No evidence</span>
                </div>
              </TableCell>
              
              <TableCell class="py-4">
                <div v-if="log.isBlocked" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/30 text-[10px] font-bold uppercase tracking-wider">
                  <AlertTriangle class="h-3 w-3" /> Blocked
                </div>
                <div v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-900/30 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 class="h-3 w-3" /> Done
                </div>
              </TableCell>
              
              <TableCell class="text-right pr-6 py-4">
                <ChevronRight class="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors inline-block" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import LoomPlayer from '../components/video/LoomPlayer.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const route = useRoute()
const router = useRouter()
const { fetchApi } = useApi()

const log = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    log.value = await fetchApi(`/logs/${route.params.id}`)
  } catch (err) {
    alert('Log not found')
    router.push('/')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
       <header class="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Log Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-[#F3F4F6] overflow-y-auto">
        <div v-if="loading" class="text-center py-20">
          <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>

        <div v-else-if="log" class="max-w-3xl mx-auto space-y-6 w-full">
          
          <div v-if="log.isBlocked" class="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
            <div class="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
              <i class="ph ph-warning-octagon text-2xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-red-900">Work Blocked</h3>
              <p class="text-red-800 mt-1">{{ log.blockerDetails }}</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm font-bold">
                {{ log.client?.companyName }}
              </span>
              <span class="flex items-center gap-2 text-gray-600 font-medium text-sm">
                <i class="ph ph-clock text-lg"></i> {{ log.hoursWorked }} Hours Logged
              </span>
            </div>

            <div v-if="log.videoUrl" class="bg-gray-900 border-b border-gray-100">
              <LoomPlayer :url="log.videoUrl" />
            </div>

            <div class="p-8 space-y-6">
              <div>
                <h3 class="text-gray-900 font-bold text-lg mb-2">Accomplishments</h3>
                <p class="text-gray-600 whitespace-pre-line leading-relaxed">{{ log.summary }}</p>
              </div>

              <div v-if="log.attachmentUrl">
                <h3 class="text-gray-900 font-bold text-sm mb-2 uppercase tracking-wide">Attachments</h3>
                <a :href="log.attachmentUrl" target="_blank" class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition group">
                    <div class="bg-blue-50 text-blue-600 p-2 rounded">
                      <i class="ph ph-file-text text-xl"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 group-hover:text-blue-600 transition">View Attached File</p>
                      <p class="text-xs text-gray-400 truncate max-w-sm">{{ log.attachmentUrl }}</p>
                    </div>
                    <i class="ph ph-arrow-square-out text-gray-400 ml-auto group-hover:text-blue-600"></i>
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
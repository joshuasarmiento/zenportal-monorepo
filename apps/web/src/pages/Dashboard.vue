<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import { useUserStore } from '@/stores/userStore'

// Components
import AppSidebar from '@/components/AppSidebar.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import RecentLogsTable from '@/components/dashboard/RecentLogsTable.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

// Logic / State
const router = useRouter()
const { fetchApi } = useApi()
const userStore = useUserStore()

const logs = ref<any[]>([])
const stats = ref({ hoursThisMonth: 0, activeClients: 0, pendingBlockersCount: 0, logCount: 0 }) 
const loading = ref(true)

const isPro = computed(() => userStore.user?.tier === 'pro')
const LOG_LIMIT = 100 

onMounted(async () => {
  if (!userStore.user) await userStore.fetchUser()
  try {
    const [logsRes, statsRes] = await Promise.all([
      fetchApi('/logs'), 
      fetchApi('/stats')
    ])
    logs.value = logsRes
    stats.value = { ...stats.value, ...statsRes } 
  } catch (err) { 
    console.error(err) 
  } finally { 
    loading.value = false 
  }
})

// Actions
const navigateToLog = () => router.push('/log/new')
const viewLog = (id: string) => router.push(`/log/${id}`)

const goToUpgrade = async () => {
  loading.value = true
  try {
    const res = await fetchApi('/billing/checkout', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (err) {
    alert('Failed to start checkout')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      
      <DashboardHeader 
        :loading="loading"
        :is-pro="isPro"
        :log-count="stats.logCount"
        :log-limit="LOG_LIMIT"
        @create="navigateToLog"
        @upgrade="goToUpgrade"
      />

      <div class="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-4 bg-muted/40">
        
        <DashboardStats :stats="stats" />

        <RecentLogsTable 
          :loading="loading" 
          :logs="logs" 
          @view="viewLog" 
        />
        
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
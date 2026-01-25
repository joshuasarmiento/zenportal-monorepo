<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'vue-sonner'

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
const clients = ref<any[]>([]) // Add clients ref
const loading = ref(true)

const isPro = computed(() => userStore.user?.tier === 'pro')
const LOG_LIMIT = 100 
const hasClients = computed(() => clients.value.length > 0) // Add hasClients computed property

onMounted(async () => {
  if (!userStore.user) await userStore.fetchUser()
  try {
    const [logsRes, statsRes, clientsRes] = await Promise.all([ // Fetch clients as well
      fetchApi('/logs'), 
      fetchApi('/stats'),
      fetchApi('/clients')
    ])
    logs.value = logsRes
    stats.value = { ...stats.value, ...statsRes } 
    clients.value = clientsRes // Assign fetched clients
  } catch (err) { 
    console.error(err) 
  } finally { 
    loading.value = false 
  }
})

// Actions
const navigateToLog = () => {
  if (!hasClients.value) { // Check if clients exist
    toast.error('Please add a client first!', {
      description: 'You need at least one client to log work against.',
      action: {
        label: 'Add Client',
        onClick: () => router.push('/clients/new'),
      },
    })
    return
  }
  router.push('/log/new')
}
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
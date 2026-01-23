<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../lib/api'
import { useUserStore } from '@/stores/userStore'

// Components
import AppSidebar from '@/components/AppSidebar.vue'
import ClientsHeader from '@/components/clients/ClientsHeader.vue'
import ClientsToolbar from '@/components/clients/ClientsToolbar.vue'
import ClientGrid from '@/components/clients/ClientGrid.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

// State & Logic
const router = useRouter()
const userStore = useUserStore()
const { fetchApi } = useApi()

const clients = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('newest')

const FREE_LIMIT = 1

onMounted(async () => {
  if (!userStore.user) await userStore.fetchUser()
  try { 
    clients.value = await fetchApi('/clients') 
  } catch (err) { 
    console.error(err) 
  } finally { 
    loading.value = false 
  }
})

// Computeds
const isPro = computed(() => userStore.user?.tier === 'pro')
const activeCount = computed(() => clients.value.filter(c => c.status === 'active').length)
const isLimitReached = computed(() => !isPro.value && activeCount.value >= FREE_LIMIT)

const processedClients = computed(() => {
  let result = [...clients.value]
  if (statusFilter.value !== 'all') result = result.filter(c => c.status === statusFilter.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => c.companyName.toLowerCase().includes(q))
  }
  result.sort((a, b) => {
    if (sortBy.value === 'name') return a.companyName.localeCompare(b.companyName)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
  return result
})

// Actions
const goToAdd = () => {
  if (isLimitReached.value) return
  router.push('/clients/new')
}

const goToEdit = (id: string) => router.push(`/clients/${id}/edit`)

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
      
      <ClientsHeader 
        :loading="loading"
        :is-pro="isPro"
        :active-count="activeCount"
        :limit="FREE_LIMIT"
        @add="goToAdd"
        @upgrade="goToUpgrade"
      />

      <div class="flex flex-1 flex-col p-4 md:p-8 bg-muted/40 overflow-y-auto">
        
        <ClientsToolbar 
          v-model:search="searchQuery"
          v-model:status="statusFilter"
          v-model:sort="sortBy"
        />

        <ClientGrid 
          :loading="loading"
          :clients="processedClients"
          :is-limit-reached="isLimitReached"
          @edit="goToEdit"
          @add="goToAdd"
          @upgrade="goToUpgrade"
        />

      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
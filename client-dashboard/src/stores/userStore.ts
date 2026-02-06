// src/stores/userStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authClient } from '@/lib/auth-client'
import { useApi } from '@/lib/api'

// 1. Define the User type locally 
type UserWithTier = typeof authClient.$Infer.Session.user & {
  tier?: 'free' | 'pro' | null
  paymongoCustomerId?: string | null
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<UserWithTier | null>(null)
  const workspaces = ref<any[]>([])
  const currentWorkspace = ref<any | null>(null)
  const loading = ref(false)

  // Getters
  const initials = computed(() => {
    const name = user.value?.name || ''
    if (!name) return 'ME'

    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  })

  // 2. Dedicated check for Pro status (Check Workspace Tier)
  const isPro = computed(() => {
    return currentWorkspace.value?.tier === 'pro'
  })

  const planName = computed(() => {
    return isPro.value ? 'Agency Pro' : 'Free Starter'
  })

  // Actions
  const { fetchApi } = useApi() // Initialize API helper

  const fetchWorkspaces = async () => {
    try {
      const { workspaces: list } = await fetchApi<{ workspaces: any[] }>('/api/workspaces')
      workspaces.value = list

      // Set initial active workspace if none selected or invalid
      const storedId = localStorage.getItem('activeWorkspaceId')
      const found = list.find(w => w.id === storedId)

      if (found) {
        currentWorkspace.value = found
      } else if (list.length > 0) {
        // Default to first available
        currentWorkspace.value = list[0]
        localStorage.setItem('activeWorkspaceId', list[0].id)
      } else {
        currentWorkspace.value = null
        localStorage.removeItem('activeWorkspaceId')
      }
    } catch (e) {
      console.error("Failed to fetch workspaces", e)
    }
  }

  const fetchUser = async (force = false) => {
    // If we have data and aren't forcing a refresh, return early
    if (user.value && !force) return

    loading.value = true
    try {
      // 3. getSession() checks if we are logged in
      const { data: session } = await authClient.getSession()

      if (session) {
        // If logged in, fetch full profile from our API
        // This ensures we get all custom fields like notification settings
        const fullProfile = await fetchApi<UserWithTier>('/user/me')
        user.value = fullProfile

        // Also fetch workspaces
        await fetchWorkspaces()
      } else {
        user.value = null
        workspaces.value = []
        currentWorkspace.value = null
      }
    } catch (err) {
      console.error('Failed to load user profile', err)
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const switchWorkspace = (workspaceId: string) => {
    const found = workspaces.value.find(w => w.id === workspaceId)
    if (found) {
      currentWorkspace.value = found
      localStorage.setItem('activeWorkspaceId', workspaceId)
      // Redirect to dashboard to ensure all API calls use new ID and we leave setup page
      window.location.href = '/dashboard'
    }
  }

  const logout = async () => {
    await authClient.signOut()
    user.value = null
    workspaces.value = []
    currentWorkspace.value = null
    localStorage.removeItem('activeWorkspaceId')
    window.location.href = '/login'
  }

  return {
    user,
    workspaces,
    currentWorkspace,
    loading,
    initials,
    isPro,
    planName,
    fetchUser,
    fetchWorkspaces,
    switchWorkspace,
    logout
  }
})
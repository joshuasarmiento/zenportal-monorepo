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

  // 2. Dedicated check for Pro status
  const isPro = computed(() => {
    return user.value?.tier === 'pro'
  })

  const planName = computed(() => {
    return isPro.value ? 'Agency Pro' : 'Free Starter'
  })

  // Actions
  const { fetchApi } = useApi() // Initialize API helper

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
      } else {
        user.value = null
      }
    } catch (err) {
      console.error('Failed to load user profile', err)
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await authClient.signOut()
    user.value = null
    window.location.href = '/login'
  }

  return {
    user,
    loading,
    initials,
    isPro,
    planName,
    fetchUser,
    logout
  }
})
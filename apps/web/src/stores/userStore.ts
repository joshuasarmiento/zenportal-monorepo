import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '../lib/api'

export const useUserStore = defineStore('user', () => {
  const { fetchApi } = useApi()
  
  // State
  const user = ref<any>(null)
  const loading = ref(false)

  // Getters (Computed)
  const initials = computed(() => {
    if (!user.value?.fullName) return 'ME'
    return user.value.fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  })

  const planName = computed(() => {
    return user.value?.tier === 'pro' ? 'Agency Pro' : 'Free Starter'
  })

  // Actions
  const fetchUser = async (force = false) => {
    if (user.value && !force) return // Don't refetch if we already have data, unless forced
    
    loading.value = true
    try {
      // You'll need to create this endpoint in your backend (GET /auth/me)
      // Or just infer from Clerk, but fetching from DB gives you the 'tier' info
      const res = await fetchApi('/auth/me') 
      user.value = res
    } catch (err) {
      console.error('Failed to load user profile', err)
      user.value = null // Clear user on error
    } finally {
      loading.value = false
    }
  }

  return { 
    user, 
    loading, 
    initials, 
    planName,
    fetchUser 
  }
})
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // --- Public Routes ---
    {
      path: '/dashboard',
      component: () => import('@/pages/Dashboard.vue'),
    },
    {
      path: '/login',
      component: () => import('@/pages/Login.vue'),
      meta: { public: true }
    },
    {
      path: '/sign-up',
      component: () => import('@/pages/Singup.vue'),
      meta: { public: true }
    },
    {
      path: '/forgot-password',
      component: () => import('@/pages/ForgotPassword.vue'),
      meta: { public: true }
    },
    {
      path: '/reset-password',
      component: () => import('@/pages/ResetPassword.vue'),
      meta: { public: true }
    },
    {
      path: '/c/:token',
      component: () => import('@/pages/public/ClientReport.vue'),
      meta: { public: true }
    },
    {
      path: '/p/:slug',
      component: () => import('@/pages/public/PublicProfile.vue'),
      meta: { public: true }
    },

    // --- Protected App Routes ---
    {
      path: '/log/:id',
      component: () => import('@/pages/LogDetail.vue')
    },
    {
      path: '/log/:id/edit',
      component: () => import('@/pages/EditLog.vue')
    },
    {
      path: '/clients',
      component: () => import('@/pages/Client.vue')
    },
    {
      path: '/clients/:id/edit',
      component: () => import('@/pages/EditClient.vue')
    },
    {
      path: '/clients/new',
      component: () => import('@/pages/AddClient.vue')
    },
    {
      path: '/earnings',
      component: () => import('@/pages/Earnings.vue')
    },
    {
      path: '/settings',
      component: () => import('@/pages/Settings.vue'),
      redirect: '/settings/profile',
      children: [
        { path: 'profile', component: () => import('@/components/settings/ProfileSettings.vue') },
        { path: 'branding', component: () => import('@/components/settings/BrandingSettings.vue') },
        { path: 'billing', component: () => import('@/components/settings/BillingSettings.vue') },
        { path: 'notifications', component: () => import('@/components/settings/NotificationSettings.vue') },
        { path: 'api', component: () => import('@/components/settings/ApiKeysSettings.vue') },
      ]
    },
    {
      path: '/log/new',
      component: () => import('@/pages/NewLog.vue')
    },
    {
      path: '/help',
      component: () => import('@/pages/UserGuide.vue'),
      redirect: '/help/getting-started',
      children: [
        { path: 'getting-started', component: () => import('@/components/user-guide/GettingStarted.vue') },
        { path: 'clients-access', component: () => import('@/components/user-guide/ClientsAccess.vue') },
        { path: 'logging-work', component: () => import('@/components/user-guide/LoggingWork.vue') },
        { path: 'earnings-goals', component: () => import('@/components/user-guide/EarningsGoals.vue') },
        { path: 'api-automation', component: () => import('@/components/user-guide/ApiAutomation.vue') },
      ]
    },

    // --- 404 Catch-all ---
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/404.vue'),
      meta: { public: true }
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()

  // 1. Attempt session restoration if the user isn't loaded yet
  if (!userStore.user && !userStore.loading) {
    await userStore.fetchUser()
  }

  const isAuthenticated = !!userStore.user
  const isPublic = to.meta.public

  // 2. Handle non-existent pages (404 logic)
  // If the route doesn't match any defined path (matches the catch-all)
  if (to.name === 'NotFound' || to.matched.some(record => record.path === '/:pathMatch(.*)*')) {
    if (isAuthenticated) {
      return next('/dashboard') // Authenticated users go to Dashboard
    } else {
      return next('/login') // Unauthenticated users go to Login
    }
  }

  // 3. Authenticated user logic
  if (isAuthenticated) {
    // Prevent logged-in users from visiting Login or Sign-up
    if (to.path === '/login' || to.path === '/sign-up') {
      return next('/dashboard')
    }
    return next()
  }

  // 4. Unauthenticated user logic
  // Only allow access to routes explicitly marked as public
  if (isPublic) {
    return next()
  } else {
    // Redirect all other attempts to Login
    return next('/login')
  }
})

export default router
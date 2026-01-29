import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// 1. App Pages (Protected)
import Dashboard from '@/pages/Dashboard.vue'
import Clients from '@/pages/Client.vue'
import Earnings from '@/pages/Earnings.vue'
import Settings from '@/pages/Settings.vue'
import NewLog from '@/pages/NewLog.vue'
import AddClient from '@/pages/AddClient.vue'
import EditClient from '@/pages/EditClient.vue'
import EditLog from '@/pages/EditLog.vue'
import UserGuide from '@/pages/UserGuide.vue'

// Settings Pages
import ProfileSettings from '@/components/settings/ProfileSettings.vue'
import BrandingSettings from '@/components/settings/BrandingSettings.vue'
import BillingSettings from '@/components/settings/BillingSettings.vue'
import NotificationSettings from '@/components/settings/NotificationSettings.vue'
import ApiKeysSettings from '@/components/settings/ApiKeysSettings.vue'

// User Guide Pages
import GettingStarted from '@/components/user-guide/GettingStarted.vue'
import ClientsAccess from '@/components/user-guide/ClientsAccess.vue'
import LoggingWork from '@/components/user-guide/LoggingWork.vue'
import EarningsGoals from '@/components/user-guide/EarningsGoals.vue'
import ApiAutomation from '@/components/user-guide/ApiAutomation.vue'

import Login from '@/pages/Login.vue'
import Signup from '@/pages/Singup.vue'
import ForgotPassword from '@/pages/ForgotPassword.vue'
import ResetPassword from '@/pages/ResetPassword.vue'
import ClientReport from '@/pages/public/ClientReport.vue'
import NotFound from '@/pages/404.vue'
import LogDetail from '@/pages/LogDetail.vue'
import AgencyProfile from '@/pages/public/AgencyProfile.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    // --- Public Routes ---
    {
      path: '/dashboard',
      component: Dashboard,
    },
    {
      path: '/login',
      component: Login,
      meta: { public: true }
    },
    {
      path: '/sign-up',
      component: Signup,
      meta: { public: true } 
    },
    {
      path: '/forgot-password',
      component: ForgotPassword,
      meta: { public: true }
    },
    {
      path: '/reset-password',
      component: ResetPassword,
      meta: { public: true }
    },
    {
      path: '/c/:token',
      component: ClientReport,
      meta: { public: true }
    },
    { path: '/p/:slug',
      component: AgencyProfile,
      meta: { public: true }
    },

    // --- Protected App Routes ---
    {
      path: '/log/:id',
      component: LogDetail
    },
    {
      path: '/log/:id/edit',
      component: EditLog
    },
    {
      path: '/clients',
      component: Clients
    },
    {
        path: '/clients/:id/edit',
        component: EditClient
    },
    {
      path: '/clients/new',
      component: AddClient
    },
    {
      path: '/earnings',
      component: Earnings
    },
    {
      path: '/settings',
      component: Settings,
      redirect: '/settings/profile',
      children: [
        { path: 'profile', component: ProfileSettings },
        { path: 'branding', component: BrandingSettings },
        { path: 'billing', component: BillingSettings },
        { path: 'notifications', component: NotificationSettings },
        { path: 'api', component: ApiKeysSettings },
      ]
    },
    {
      path: '/log/new',
      component: NewLog
    },
    {
      path: '/help',
      component: UserGuide,
      redirect: '/help/getting-started',
      children: [
        { path: 'getting-started', component: GettingStarted },
        { path: 'clients-access', component: ClientsAccess },
        { path: 'logging-work', component: LoggingWork },
        { path: 'earnings-goals', component: EarningsGoals },
        { path: 'api-automation', component: ApiAutomation },
      ]
    },

    // --- 404 Catch-all ---
    {
      path: '/:pathMatch(.*)*',
      component: NotFound,
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
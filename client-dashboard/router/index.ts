import { createRouter, createWebHistory } from 'vue-router'

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
import ClientReport from '@/pages/public/ClientReport.vue'
import NotFound from '@/pages/404.vue'
import LogDetail from '@/pages/LogDetail.vue'
import AgencyProfile from '@/pages/public/AgencyProfile.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    // --- Public Routes ---
    {
      path: '/',
      component: Dashboard,
    },
    {
      path: '/sign-in',
      component: Login,
      meta: { public: true }
    },
    {
      path: '/sign-up',
      component: Signup,
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

export default router
import { createRouter, createWebHistory } from 'vue-router'
// import { useAuth } from '@clerk/vue'

// 1. App Pages (Protected)
import Dashboard from '@/pages/Dashbard.vue'
import Clients from '@/pages/Client.vue'
import Earnings from '@/pages/Earnings.vue'
import Settings from '@/pages/Settings.vue'
import NewLog from '@/pages/NewLog.vue'
import AddClient from '@/pages/AddClient.vue'
import EditClient from '@/pages/EditClient.vue'
import EditLog from '@/pages/EditLog.vue'

// 2. Auth & Public Pages
import Login from '@/pages/Login.vue'
import LandingPage from '@/pages/LandingPage.vue'
import ClientReport from '@/pages/ClientReport.vue'
import NotFound from '@/pages/404.vue'
import Pricing from '@/pages/Pricing.vue'
import LogDetail from '@/pages/LogDetail.vue'
import AgencyProfile from '@/pages/AgencyProfile.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // --- Public Routes ---
    { 
      path: '/', 
      component: LandingPage, 
      meta: { public: true } 
    },
    { 
      path: '/login', 
      component: Login, 
      meta: { public: true } 
    },
    { 
      path: '/pricing', 
      component: Pricing ,
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
      path: '/dashboard', 
      component: Dashboard 
    },
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
      component: Settings 
    },
    { 
      path: '/log/new', 
      component: NewLog 
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
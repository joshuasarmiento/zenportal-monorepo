import { createRouter, createWebHistory } from 'vue-router'
// import { useAuth } from '@clerk/vue'

// 1. App Pages (Protected)
import Dashboard from '../src/pages/Dashbard.vue'
import Clients from '../src/pages/Client.vue'
import Earnings from '../src/pages/Earnings.vue'
import Settings from '../src/pages/Settings.vue'
import NewLog from '../src/pages/NewLog.vue'
import AddClient from '../src/pages/AddClient.vue'
import EditClient from '../src/pages/EditClient.vue'

// 2. Auth & Public Pages
import Login from '../src/pages/Login.vue'
import LandingPage from '../src/pages/LandingPage.vue'
import ClientReport from '../src/pages/ClientReport.vue'
import NotFound from '../src/pages/404.vue'
import Pricing from '../src/pages/Pricing.vue'
import LogDetail from '../src/pages/LogDetail.vue'
import AgencyProfile from '../src/pages/AgencyProfile.vue'

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
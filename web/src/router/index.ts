import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import About from '../pages/About.vue'
import Documentation from '../pages/Documentation.vue'
import Features from '../pages/Features.vue'
import Pricing from '../pages/Pricing.vue'
import PrivacyPolicy from '../pages/PrivacyPolicy.vue'
import Terms from '../pages/Terms.vue'
import NotFound from '../pages/404.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/about', component: About },
  { path: '/documentation', component: Documentation },
  { path: '/features', component: Features },
  { path: '/pricing', component: Pricing },
  { path: '/privacy-policy', component: PrivacyPolicy },
  { path: '/terms', component: Terms },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    meta: { public: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

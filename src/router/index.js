import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import Boutique from '@/views/Boutique.vue'
import Footer from '@/components/AppFooter/AppFooter.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Boutique,
    },
    {
      path: '/boutique',
      name: 'boutique',
      component: Boutique,
    },
    // {
    //   path: '/footer',
    //   name: 'boutique',
    //   component: Footer,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   route level code-splitting
    //   this generates a separate chunk (About.[hash].js) for this route
    //   which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import Boutique from '@/views/Boutique.vue'
import About from '@/views/About.vue'
import Catalog from '@/views/Catalog.vue'
import ProductPage from '@/views/ProductPage.vue'
import Favourites from '@/views/Favourites.vue'
import Cart from '@/components/Cart/Cart.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPage,
    },
    {
      path: '/boutique',
      name: 'boutique',
      component: Boutique,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: Catalog,
    },
    { path: '/product/:id',
      name: 'product',
      component: ProductPage,
      props: true // Позволяет передавать :id как пропс 
    },
    { path: '/favourites',
      name: 'favourites',
      component: Favourites,
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
    }
  ],
})

console.log('ROUTER getRoutes:', router.getRoutes().map(r => ({ name: r.name, path: r.path })));
window.__MY_APP_ROUTER__ = router; // чтобы иметь доступ из консоли

export default router

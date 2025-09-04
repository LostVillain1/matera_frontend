<template>
  <AppHeader />

  <div class="favorites-page">
    <h1 class="title">Избранное</h1>

    <p v-if="favorites.length === 0" class="empty-message">
      Вы пока ничего не добавили
    </p>

    <div v-else class="favs-layout">
      <!-- левая колонка: список товаров -->
      <div class="favorites-list">
        <FavouriteItem
          v-for="product in favorites"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- правая колонка: инфо + итоги -->
      <aside class="sidebar">
        <div class="info-accordion">
          <details>
            <summary>Информация о доставке</summary>
            <div class="panel">
              Сроки и стоимость доставки зависят от региона и способа получения.
            </div>
          </details>
          <details>
            <summary>Обмен и возврат</summary>
            <div class="panel">
              Возврат возможен в течение 14 дней при сохранении товарного вида.
            </div>
          </details>
          <details>
            <summary>Об оплате</summary>
            <div class="panel">
              Принимаем карты, СБП и другие популярные способы оплаты.
            </div>
          </details>
        </div>

        <div class="summary">
          <div class="total">
            <span>Итого</span>
            <span>{{ totalPrice }} ₽</span>
          </div>
          <!-- одна общая кнопка -->
          <button
            class="to-cart-button"
            :disabled="favorites.length === 0"
            @click="addAllToCart"
          >
            Перейти в корзину
          </button>
        </div>
      </aside>
    </div>
  </div>

  <AppFooter />
</template>

<script setup>
import { computed } from 'vue'
import { useFavouriteStore } from '@/stores/useFavouriteStore'
import { useCartStore } from '@/stores/useCartStore'
import { useRouter } from 'vue-router' // ✦ ПРАВКА: для перехода в корзину

import FavouriteItem from '@/components/Favourite/FavouriteItem.vue'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AppFooter from '@/components/AppFooter/AppFooter.vue'

const favouritesStore = useFavouriteStore()
const cartStore = useCartStore()
const router = useRouter() // ✦ ПРАВКА

const favorites = computed(() => favouritesStore.favorites)

function addAllToCart() {
  for (const fav of favorites.value) {
    const product = {
      id: fav.id,
      name: fav.name,
      price: fav.price,
      code: fav.code,
      image: fav.image || fav.images?.[0] || '',
      images: fav.images || (fav.image ? [fav.image] : []),
      category: fav.category,
      description: fav.description,
      sizes: fav.sizes,
      colors: fav.colors
    }

    const options = {
      selectedColor: fav.selectedColor ?? null,
      selectedSize: fav.selectedSize ?? fav.sizes?.[0] ?? null,
      quantity: Number(fav.quantity ?? 1) || 1
    }

    cartStore.addToCart(product, options)
  }

  // ✦ ПРАВКА: после добавления — редирект в корзину
  router.push('/cart')
}

const totalPrice = computed(() =>
  favouritesStore.favorites.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0)
)
</script>

<style scoped>
@import '@/views/Favourites.scss';
</style>

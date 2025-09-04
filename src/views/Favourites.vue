<template>
  <AppHeader />

  <div class="favorites-page">
    <h1 class="title">Избранное</h1>

    <p v-if="favorites.length === 0" class="empty-message">
      Вы пока ничего не добавили
    </p>

    <!-- ✦ ПРАВКА: общий layout-контейнер.
         На мобиле он «плоский», на десктопе превращается в 2 колонки -->
    <div v-else class="favs-layout">
      <!-- левая колонка: список товаров -->
      <div class="favorites-list">
        <FavouriteItem
          v-for="product in favorites"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>

      <!-- ✦ ПРАВКА: правая колонка – инфо-блоки (десктоп) + итоги -->
      <aside class="sidebar">
        <!-- инфо-аккордеон скрыт на мобильном/планшете, показывается на десктопе -->
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

        <!-- итоги (на мобиле — под списком; на десктопе — карточка справа) -->
        <div class="summary">
          <div class="total">
            <span>Итого</span>
            <span>{{ totalPrice }} ₽</span>
          </div>
          <button class="to-cart-button">Перейти в корзину</button>
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

import FavouriteItem from '@/components/Favourite/FavouriteItem.vue'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AppFooter from '@/components/AppFooter/AppFooter.vue'

const favouritesStore = useFavouriteStore()
const cartStore = useCartStore()

const favorites = computed(() => favouritesStore.favorites)

function addToCart(favouriteItem) {
  const product = {
    id: favouriteItem.id,
    name: favouriteItem.name,
    price: favouriteItem.price,
    code: favouriteItem.code,
    image: favouriteItem.image || favouriteItem.images?.[0] || '',
    images: favouriteItem.images || (favouriteItem.image ? [favouriteItem.image] : []),
    category: favouriteItem.category,
    description: favouriteItem.description,
    sizes: favouriteItem.sizes,
    colors: favouriteItem.colors
  }

  const options = {
    selectedColor: favouriteItem.selectedColor ?? null,
    selectedSize: favouriteItem.selectedSize ?? favouriteItem.sizes?.[0] ?? null,
    quantity: Number(favouriteItem.quantity ?? 1) || 1
  }

  cartStore.addToCart(product, options)
}

const totalPrice = computed(() =>
  favouritesStore.favorites.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0)
)
</script>

<style scoped>
@import '@/views/Favourites.scss';
</style>

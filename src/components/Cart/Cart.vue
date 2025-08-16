<template>
  <!-- Шапка сайта -->
  <AppHeader />

  <main class="cart-page">
    <!-- Заголовок страницы -->
    <h1 class="title">Корзина</h1>

    <!-- Если корзина пустая — показываем заглушку -->
    <EmptyCart v-if="!cartItems.length" />

    <!-- Если есть товары -->
    <div v-else class="cart-grid">
      <!-- Левая колонка (список товаров) -->
      <section class="cart-list">
        <!-- Перебираем товары из стора -->
        <CartItem
          v-for="(item, idx) in cartItems"
          :key="itemKey(item, idx)"
          :item="item"
          :index="idx"
          @remove="removeByIndex"
          @update-quantity="updateQuantityByIndex"
          @update-options="updateOptionsByIndex"
        />
      </section>

      <!-- Правая колонка (итоги заказа) -->
      <aside class="cart-summary-wrap">
        <CartSummary
          :totalItems="totalItems"
          :totalPrice="totalPrice"
          @clear="clearCart"
          @checkout="checkout"
        />
      </aside>
    </div>
  </main>

  <!-- Подвал сайта -->
  <AppFooter />
</template>

<script setup>
/**
 * Cart.vue — главный контейнер страницы корзины.
 * - Берёт данные из cartStore
 * - Передаёт события в store (remove/update/clear)
 *
 * Вёрстка — mobile-first:
 * - По умолчанию всё в колонку (список, затем summary).
 * - При >= 1024px — grid 2col: список слева, summary справа.
 */

// Импорт компонентов
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AppFooter from '@/components/AppFooter/AppFooter.vue'
import EmptyCart from './EmptyCart.vue'
import CartItem from './CartItem.vue'
import CartSummary from './CartSummary.vue'

// Подключаем стор корзины
import { useCartStore } from '@/stores/useCartStore'
import { storeToRefs } from 'pinia'

// Инициализация стора
const cartStore = useCartStore()

// Достаём реактивные данные (геттеры)
const { items: cartItems, totalItems, totalPrice } = storeToRefs(cartStore)

// Методы стора
const { removeByIndex, updateQuantityByIndex, updateOptionsByIndex, clearCart } = cartStore

// Генерация ключа для стабильного рендера элементов
const itemKey = (item, idx) => `${item.id}-${idx}`

// Действие оформления заказа
const checkout = () => {
  alert('Оформление заказа... (здесь будет логика перехода на checkout)')
}
</script> 

<style scoped>
@import "./Cart.scss";
</style>
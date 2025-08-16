<template>
  <section class="product-card">
    <!-- Рендерим только когда product найден -->
    <div v-if="product">
      <!-- Хлебные крошки (как было) -->
      <nav class="nav">
        <span>Главная // </span>
        <span>Каталог </span>
      </nav>

      <!-- Заголовок товара (как было) -->
      <div class="product-title">
        <span>{{ product.name }}</span>
      </div>

      <!-- Обёртка контента: на десктопе — в 2 колонки -->
      <div class="product-wrapper">
        <!-- ====== ГАЛЕРЕЯ: MOBILE слайдер / DESKTOP миниатюры + большое изображение ====== -->
        <div class="gallery">
          <!-- MOBILE: горизонтальный слайдер -->
          <div
            v-if="!isDesktop && product.images?.length"
            class="gallery-mobile"
          >
            <div class="slides" ref="sliderRef" @scroll.passive="onSliderScroll">
              <div
                class="slide"
                v-for="(img, idx) in product.images"
                :key="`m-${idx}`"
              >
                <img :src="img" :alt="`${product.name} ${idx + 1}`" />
              </div>
            </div>

            <!-- точки для быстрого перехода к кадрам -->
            <div v-if="product.images.length > 1" class="dots">
              <button
                v-for="(img, idx) in product.images"
                :key="`dot-${idx}`"
                :class="{ active: currentIndex === idx }"
                @click="goTo(idx)"
                type="button"
                :aria-label="`К слайду ${idx + 1}`"
              />
            </div>
          </div>

          <!-- DESKTOP: миниатюры слева, большое изображение справа -->
          <div v-else class="gallery-desktop">
            <!-- Миниатюры (их столько же, сколько элементов в images) -->
            <div
              class="gallery-thumbnails"
              v-if="product.images?.length"
            >
              <img
                v-for="(img, index) in product.images"
                :key="`t-${index}`"
                :src="img"
                :alt="`${product.name} превью ${index + 1}`"
                :class="{ active: currentImage === img }"
                @click="changeImage(img)"
              />
            </div>

            <!-- Большое изображение -->
            <div class="product-image">
              <img :src="currentImage" :alt="product.name" />
            </div>
          </div>
        </div>

        <!-- ====== Правая колонка: инфо и выборы (как было + BaseDropdown) ====== -->
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-code">Арт: {{ product.code }}</p>
          <p class="product-price">{{ formatPrice(product.price) }} ₽</p>
          <p class="product-installment">4 платежа по {{ formatInstallment(product.price) }} ₽</p>

          <!-- Выбор размера — через кастомный dropdown, без нативного <select> -->
          <div class="product-sizes" v-if="product.sizes?.length">
            <p class="label">Размер</p>
            <BaseDropdown
              v-model="selectedSize"
              :options="product.sizes"
              placeholder="Выберите размер"
            />
          </div>

          <!-- Количество (по макету — на десктопе, как было) -->
          <div class="product-quantity" v-if="isDesktop">
            <button @click="decrementQty" type="button" :disabled="quantity <= 1">-</button>
            <span>{{ quantity }}</span>
            <button @click="incrementQty" type="button">+</button>
          </div>

          <!-- Кнопки действий (как было) -->
          <div class="product-actions">
            <button
              class="add-to-cart"
              :disabled="!canAddToCart"
              @click="onAddToCart"
              type="button"
              title="Добавить в корзину"
            >
              В корзину
            </button>

            <button
              class="buy-now"
              :disabled="!canAddToCart"
              @click="onBuyNow"
              type="button"
              title="Купить сейчас"
            >
              Быстрая покупка
            </button>
          </div>

          <!-- Ссылки/аккордеоны (как было) -->
          <a href="#" class="size-table">Таблица размеров</a>

          <accordion-product title="Состав" />
          <accordion-product title="Характеристики" />
          <accordion-product title="Уход за одеждой" />
        </div>
      </div>
    </div>

    <!-- Фолбэк, если товар не найден -->
    <div v-else class="not-found">Товар не найден</div>
  </section>
</template>

<script setup>
/**
 * ProductCard.vue (обновлён)
 * - Данные товара берём из productStore по :id (как раньше).
 * - Галерея:
 *   - Mobile: горизонтальный слайдер с точками.
 *   - Desktop: миниатюры слева (их столько же, сколько в product.images), большое фото справа.
 * - Выбор размера — через кастомный BaseDropdown (div-ы, не <select>).
 * - Совместимость со стором корзины:
 *   addToCart(product, { selectedSize, quantity }) — image НЕ передаём,
 *   в CartItem показывается product.images[0].
 */

import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

// сторы проекта
import { useProductStore } from '@/stores/useProductStore'
import { useCartStore } from '@/stores/useCartStore'

// компоненты
import AccordionProduct from './AccordionProduct.vue' // используется как <accordion-product>
import BaseDropdown from '@/components/ProductCard/BaseDropdown.vue' // поправь путь под свой проект

// --- РОУТИНГ
const route = useRoute()
const router = useRouter()

// --- СТОРЫ
const productStore = useProductStore()
const cartStore = useCartStore()

// --- СОСТОЯНИЯ
const product = ref(null)         // текущий товар
const currentImage = ref('')      // активная картинка (desktop)
const currentIndex = ref(0)       // активный индекс (mobile slider)
const sliderRef = ref(null)       // контейнер слайдера (mobile)

const selectedSize = ref(null)    // выбранный размер
const quantity = ref(1)           // количество

// --- АДАПТИВ
const { width } = useWindowSize()
const isDesktop = computed(() => width.value >= 1024) // брейкпоинт для десктопа — подстрой под свой

// --- ДОСТУПНОСТЬ ДОБАВЛЕНИЯ В КОРЗИНУ
const canAddToCart = computed(() => {
  if (!product.value) return false
  // если у товара есть размеры — требуем выбор размера; если нет размеров — можно добавлять так
  return Array.isArray(product.value.sizes) && product.value.sizes.length > 0
    ? !!selectedSize.value
    : true
})

// ------------------------------- ИНИЦИАЛИЗАЦИЯ -------------------------------

async function loadProductByRouteId() {
  // подгрузим товары, если нужно
  if (!productStore.products?.length && typeof productStore.fetchProducts === 'function') {
    await productStore.fetchProducts()
  }

  const id = Number(route.params.id)
  product.value = productStore.products.find(p => p.id === id) || null

  if (product.value) {
    // init изображения
    currentIndex.value = 0
    currentImage.value = product.value.images?.[0] || ''

    // init размер
    selectedSize.value = product.value.sizes?.[0] ?? null

    // init qty
    quantity.value = 1

    await nextTick()
    // прокрутим мобильный слайдер к первому слайду
    if (sliderRef.value) {
      sliderRef.value.scrollTo({ left: 0, behavior: 'auto' })
    }
  }
}

// при монтировании и при смене :id подтягиваем товар
onMounted(loadProductByRouteId)
watch(() => route.params.id, loadProductByRouteId)

// ------------------------- ГАЛЕРЕЯ: handlers -------------------------

/** Desktop: клик по миниатюре */
function changeImage(img) {
  currentImage.value = img
}

/** Mobile: переход к слайду по индексу */
function goTo(idx) {
  if (!sliderRef.value) return
  const w = sliderRef.value.clientWidth
  currentIndex.value = idx
  sliderRef.value.scrollTo({ left: w * idx, behavior: 'smooth' })
  currentImage.value = product.value?.images?.[idx] || currentImage.value
}

/** Mobile: синхронизируем активный индекс при прокрутке */
function onSliderScroll() {
  if (!sliderRef.value) return
  const w = sliderRef.value.clientWidth || 1
  const idx = Math.round(sliderRef.value.scrollLeft / w)
  if (idx !== currentIndex.value) {
    currentIndex.value = idx
    currentImage.value = product.value?.images?.[idx] || currentImage.value
  }
}

// ------------------------------ РАЗМЕР/КОЛ-ВО ------------------------------

function incrementQty() { quantity.value++ }
function decrementQty() { if (quantity.value > 1) quantity.value-- }

// ------------------------------ ФОРМАТИРОВАНИЕ ------------------------------

function formatPrice(price) {
  return Number(price ?? 0).toLocaleString('ru-RU')
}
function formatInstallment(price) {
  const part = Math.floor(Number(price ?? 0) / 4)
  return part.toLocaleString('ru-RU')
}

// ------------------------------ ДОБАВЛЕНИЕ В КОРЗИНУ ------------------------------

/**
 * «В корзину»:

 *   а превью в корзине берётся как product.images[0] в CartItem.  **/


function onAddToCart() {
  if (!product.value) return
  if (!canAddToCart.value) {
    alert('Выберите размер')
    return
  }

  cartStore.addToCart(product.value, {
    selectedSize: selectedSize.value,  // строка или null
    quantity: quantity.value           // число
  })
}

/** «Быстрая покупка» = добавить + перейти в корзину */
function onBuyNow() {
  onAddToCart()
  router.push({ name: 'cart' })
}
</script>

<style>
@import './ProductCard.scss'
</style>
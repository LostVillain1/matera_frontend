<template>
  <section class="product-card">
    <div v-if="product">
      <!-- Хлебные крошки -->
      <router-link to="/catalog">
        <nav class="nav">
          <span class="text">Главная // </span>
          <span class="text">Каталог </span>
        </nav>
      </router-link>

      <!-- Заголовок товара -->
      <div class="product-title">
        <span>{{ product.name }}</span>
      </div>

      <div class="product-wrapper">
        <!-- ===== Галерея ===== -->
        <div class="gallery">
          <!-- MOBILE: слайдер -->
          <div v-if="!isDesktop && product.images?.length" class="gallery-mobile">
            <div class="slides" ref="sliderRef" @scroll.passive="onSliderScroll">
              <div class="slide" v-for="(img, idx) in product.images" :key="`m-${idx}`">
                <img :src="img" :alt="`${product.name} ${idx + 1}`" />
              </div>
            </div>
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

          <!-- DESKTOP: превью слева + большое фото -->
          <div v-else class="gallery-desktop">
            <div class="gallery-thumbnails" v-if="product.images?.length">
              <img
                v-for="(img, index) in product.images"
                :key="`t-${index}`"
                :src="img"
                :alt="`${product.name} превью ${index + 1}`"
                :class="{ active: currentImage === img }"
                @click="changeImage(img)"
              />
            </div>
            <div class="product-image">
              <img :src="currentImage" :alt="product.name" />
            </div>
          </div>
        </div>

        <!-- ===== Правая колонка ===== -->
        <div class="product-info">
          <div class="info">
            <h1 class="product-name">{{ product.name }}</h1>
            <p class="product-code">Арт: {{ product.code }}</p>

            <!-- ✦ ПРАВКА: форматирование из computed -->
            <p class="product-price">{{ productPrice }} ₽</p>
            <!-- <p class="product-installment">4 платежа по {{ productInstallment }} ₽</p> -->
          </div>

          <!-- ✦ ПРАВКА: выбор цвета временно отключён -->

          <!-- Размеры -->
          <div class="product-sizes" v-if="product.sizes?.length">
            <p class="label">Размер</p>
            <div class="sizes-list">
              <button
                v-for="(size, index) in product.sizes"
                :key="index"
                :class="['size-btn', { active: selectedSize === size }]"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- ✦ ПРАВКА: CTA-блоки под макет -->
          <div class="cta-row">
            <div class="product-qty-row">
              <QuantitySelector v-model="quantity" :min="1" />
            </div>

            <button
              class="add-to-cart"
              :disabled="!canAddToCart"
              @click="onAddToCart"
              type="button"
              title="Добавить в корзину"
            >
              В корзину
            </button>
          </div>

          <button
            class="buy-now"
            :disabled="!canAddToCart"
            @click="onBuyNow"
            type="button"
            title="Купить сейчас"
          >
            Быстрая покупка
          </button>

          <p>Таблица размеров</p>

          <accordion-product title="Состав" />
          <accordion-product title="Характеристики" />
          <accordion-product title="Уход за одеждой" />
        </div>
      </div>
    </div>

    <div v-else class="not-found">Товар не найден</div>

    <!-- Модальное подтверждение добавления -->
    <AddToCartModal
      v-if="showAddToCartModal"
      :product="product"
      @close="closeAddToCartModal"
      @confirm="() => { closeAddToCartModal(); router.push({ name: 'cart' }) }"
    />
  </section>
</template>

<script setup>
/**
 * ProductCard.vue (итог)
 * ✦ Mobile-first.
 * ✦ Без выбора цвета.
 * ✦ Количество — кастомный QuantitySelector.
 * ✦ CTA для десктопа: количество + "Добавить" в ряд, "Быстрая покупка" на всю ширину ниже.
 * ✦ Исправлена ошибка _ctx.formatPrice через computed.
 */
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

import { useProductStore } from '@/stores/useProductStore'
import { useCartStore } from '@/stores/useCartStore'

import AccordionProduct from './AccordionProduct.vue'
import AddToCartModal from '@/components/ProductCard/AddToCartModal.vue'
import QuantitySelector from '@/components/ProductCard/QuantitySelector.vue'

const route = useRoute()
const router = useRouter()

const productStore = useProductStore()
const cartStore = useCartStore()

const product = ref(null)
const currentImage = ref('')
const currentIndex = ref(0)
const sliderRef = ref(null)

const selectedSize = ref('')
const quantity = ref(1)

const showAddToCartModal = ref(false)

const { width } = useWindowSize()
const isDesktop = computed(() => width.value >= 1024)

const canAddToCart = computed(() => {
  if (!product.value) return false
  return Array.isArray(product.value.sizes) && product.value.sizes.length > 0
    ? !!selectedSize.value
    : true
})

/* ✦ ПРАВКА: форматирование цены — через computed */
function formatCurrency(n) {
  return new Intl.NumberFormat('ru-RU').format(Number(n ?? 0))
}
const productPrice = computed(() => formatCurrency(product.value?.price))
const productInstallment = computed(() =>
  formatCurrency(Math.floor(Number(product.value?.price ?? 0) / 4))
)

/* Инициализация */
async function loadProductByRouteId() {
  if (!productStore.products?.length && typeof productStore.fetchProducts === 'function') {
    await productStore.fetchProducts()
  }
  const id = Number(route.params.id)
  product.value = productStore.products.find(p => p.id === id) || null

  if (product.value) {
    currentIndex.value = 0
    currentImage.value = product.value.images?.[0] || ''
    selectedSize.value = product.value.sizes?.[0] ?? ''
    quantity.value = 1

    await nextTick()
    sliderRef.value?.scrollTo?.({ left: 0, behavior: 'auto' })
  }
}
onMounted(loadProductByRouteId)
watch(() => route.params.id, loadProductByRouteId)

/* Галерея */
function changeImage(img) { currentImage.value = img }
function goTo(idx) {
  if (!sliderRef.value) return
  const w = sliderRef.value.clientWidth
  currentIndex.value = idx
  sliderRef.value.scrollTo({ left: w * idx, behavior: 'smooth' })
  currentImage.value = product.value?.images?.[idx] || currentImage.value
}
function onSliderScroll() {
  if (!sliderRef.value) return
  const w = sliderRef.value.clientWidth || 1
  const idx = Math.round(sliderRef.value.scrollLeft / w)
  if (idx !== currentIndex.value) {
    currentIndex.value = idx
    currentImage.value = product.value?.images?.[idx] || currentImage.value
  }
}

/* Модалка */
function openAddToCartModal(){ showAddToCartModal.value = true }
function closeAddToCartModal(){ showAddToCartModal.value = false }

/* Действия */
function onAddToCart() {
  if (!product.value) return
  if (!canAddToCart.value) { alert('Выберите размер'); return }

  cartStore.addToCart(product.value, {
    selectedSize: selectedSize.value,
    quantity: quantity.value
  })
  openAddToCartModal()
}
function onBuyNow() {
  if (!product.value) return
  if (!canAddToCart.value) { alert('Выберите размер'); return }

  cartStore.addToCart(product.value, {
    selectedSize: selectedSize.value,
    quantity: quantity.value
  })
  router.push({ name: 'cart' })
}
</script>

<style>
@import './ProductCard.scss';
</style>

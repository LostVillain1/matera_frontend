<template>
  <article
    class="cart-item"
    :class="{ 'is-mobile': isMobile }"
    @touchstart.passive="onTouchStart"   
    @touchend.passive="onTouchEnd"       
  >
    <!-- ===== МОБИЛЬНЫЙ СЛАЙДЕР (2 слайда) ===== -->
    <div v-if="isMobile" class="mobile-wrapper"><!-- NEW -->
      <!-- СЛАЙД 1: фото + инфо + цена -->
      <div v-show="activeSlide === 0" class="slide slide-info"><!-- NEW -->
        <div class="left">
          <img :src="productImage" :alt="item.product.name" class="product-image" />
        </div>
        <div class="right">
          <p class="code">Арт: {{ codeText }}</p>
          <h3 class="name">{{ item.product.name }}</h3>
          <p class="price">{{ formatPrice(item.product.price * localQty) }} ₽</p>
        </div>
      </div>

      <!-- СЛАЙД 2: размер + количество + удалить -->
      <div v-show="activeSlide === 1" class="slide slide-controls"><!-- NEW -->
        <div class="controls-row">
          <div class="field compact">
            <label class="label">Размер</label>
            <!-- CHANGED: только размер, как в FavouritesItem -->
            <BaseDropdown class="dd" :options="sizeOptions" v-model="localSize" />
          </div>

          <div class="field compact">
            <label class="label">Количество</label>
            <QuantitySelect class="qty" v-model="localQty" :min="1" :max="10" />
          </div>

          <div class="field compact no-label">
            <label class="label label--spacer" aria-hidden="true"> </label>
            <button type="button" class="btn-remove" aria-label="Удалить из корзины" @click="emit('remove')">
              <svg viewBox="0 0 24 24" class="trash-ic" aria-hidden="true">
                <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M7 7l1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"
                      fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- точки -->
      <div class="dots">
        <span v-for="i in 2" :key="i" :class="['dot', { active: activeSlide === i - 1 }]" @click="activeSlide = i - 1"/>
      </div>
    </div>

    <!-- ===== ПЛАНШЕТ/ДЕСКТОП ===== -->
    <div v-else class="desktop-row"><!-- NEW -->
      <div class="col col-image">
        <img :src="productImage" :alt="item.product.name" class="product-image" />
      </div>

      <div class="col col-info">
        <p class="code">Артикул: {{ codeText }}</p>
        <h3 class="name">{{ item.product.name }}</h3>
      </div>

      <div class="col col-controls">
        <BaseDropdown class="dd" :options="sizeOptions" v-model="localSize" />
        <QuantitySelect class="qty" v-model="localQty" :min="1" :max="10" />
      </div>

      <div class="col col-price">
        <div class="price">{{ formatPrice(item.product.price * localQty) }} ₽</div>
      </div>

      <div class="col col-actions">
        <button class="icon-btn remove" @click="emit('remove')" aria-label="Удалить">🗑</button>
      </div>
    </div>
  </article>
</template>

<script setup>
/**
 * CHANGED: полностью убран выбор/эмит цвета.
 * NEW: мобильный слайдер по паттерну FavouritesItem (2 слайда, свайпы, точки).
 * CHANGED: эмит 'update-options' => { selectedSize } только.
 */

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import BaseDropdown from '@/components/Favourite/BaseDropDown.vue'       // NEW
import QuantitySelect from '@/components/Favourite/QuantitySelector.vue' // NEW

const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, required: true }
})
const emit = defineEmits(['remove', 'update-quantity', 'update-options'])

/* локальное состояние */
const localQty = ref(props.item.quantity || 1)                                // CHANGED
const localSize = ref(props.item.selectedSize || props.item.product?.sizes?.[0] || null)

watch(
  () => props.item,
  (it) => {
    localQty.value = it.quantity || 1
    localSize.value = it.selectedSize || it.product?.sizes?.[0] || null
  },
  { deep: true }
)

/* CHANGED: реакция на изменения и эмиты в стор */
watch(localQty, (val) => {
  const n = Math.max(1, Number(val) || 1)
  if (n !== val) localQty.value = n
  emit('update-quantity', n)
})
watch(localSize, (val) => {
  emit('update-options', { selectedSize: val ?? null }) // CHANGED: без selectedColor
})

/* вычислимое изображение и код */
const productImage = computed(() => {
  const p = props.item.product || {}
  if (Array.isArray(p.images) && p.images.length) return p.images[0]
  return p.image || props.item.image || ''
})
const codeText = computed(() => props.item.product?.code || props.item.product?.id || '')

/* список размеров для BaseDropdown */
const sizeOptions = computed(() =>
  (props.item.product?.sizes || []).map(s => ({ label: s, value: s }))
)

/* NEW: адаптив и свайпы под мобильный слайдер */
const isMobile = ref(window.innerWidth < 768)
const onResize = () => { isMobile.value = window.innerWidth < 768 }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

const activeSlide = ref(0)
let touchStartX = 0
const SWIPE_THRESHOLD = 40
function onTouchStart(e){ touchStartX = e.changedTouches?.[0]?.clientX ?? 0 }
function onTouchEnd(e){
  const x = e.changedTouches?.[0]?.clientX ?? 0
  const dx = touchStartX - x
  if (Math.abs(dx) < SWIPE_THRESHOLD) return
  if (dx > 0 && activeSlide.value < 1) activeSlide.value = 1
  if (dx < 0 && activeSlide.value > 0) activeSlide.value = 0
}

/* утилита */
function formatPrice(v) { return (Number(v) || 0).toLocaleString('ru-RU') }
</script>

<style lang="scss" scoped>
@import "./CartItem.scss";
</style>

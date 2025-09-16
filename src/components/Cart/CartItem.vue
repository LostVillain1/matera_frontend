<template>
  <article
    class="cart-item"
    :class="{ 'is-mobile': isMobile }"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- ===== МОБИЛЬНЫЙ РЕЖИМ ===== -->
    <div v-if="isMobile" class="mobile-wrapper">
      <!-- SLIDE #1: фото + инфо + цена -->
      <div v-show="activeSlide === 0" class="slide slide-info">
        <div class="left">
          <img :src="productImage" :alt="item.product.name" class="product-image" />
        </div>
        <div class="right">
          <p class="code">Арт: {{ codeText }}</p>
          <h3 class="name">{{ item.product.name }}</h3>
          <p class="price">{{ formatPrice(item.product.price * localQty) }} ₽</p>
        </div>

        <!-- стрелка ВПРАВО как на скрине (справа, «парит» над контентом) -->
        <button
          class="nav-float nav-float--right"
          type="button"
          aria-label="Следующий"
          @click="activeSlide = 1"
        >
          <svg viewBox="0 0 24 24" class="arrow-ic" aria-hidden="true">
            <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- SLIDE #2: ← стрелка + Размер + Кол-во + Удалить (в ОДНОЙ линии) -->
      <div v-show="activeSlide === 1" class="slide slide-controls">
        <!-- стрелка НАЗАД слева в линии, не перекрывает контролы -->
        <button
          class="inline-arrow-left"
          type="button"
          aria-label="Назад"
          @click="activeSlide = 0"
        >
          <svg viewBox="0 0 24 24" class="arrow-ic" aria-hidden="true">
            <path d="M15 4L7 12l8 8" fill="none" stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- центральные контролы -->
        <div class="controls-row">
          <div class="field compact">
            <!-- <label class="label">Размер</label> -->
            <BaseDropdown class="dd" :options="sizeOptions" v-model="localSize" />
          </div>

          <div class="field compact">
            <!-- <label class="label">Количество</label> -->
            <QuantitySelect class="qty" v-model="localQty" :min="1" :max="10" />
          </div>
        </div>

        <!-- удалить справа -->
        <button
          type="button"
          class="btn-remove"
          aria-label="Удалить из корзины"
          @click="emit('remove')"
        >
          <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 3.625H20.5M8.28571 7.5625V18.0625M13.7143 7.5625V18.0625M4.21429 3.625H17.7857V19.375C17.7857 20.0712 17.4997 20.7389 16.9907 21.2312C16.4817 21.7234 15.7913 22 15.0714 22H6.92857C6.2087 22 5.51831 21.7234 5.00928 21.2312C4.50025 20.7389 4.21429 20.0712 4.21429 19.375V3.625ZM11 1C11.6848 0.999791 12.3443 1.24991 12.8465 1.70021C13.3486 2.15052 13.6561 2.76773 13.7075 3.42813L13.7143 3.625H8.28571C8.28571 2.92881 8.57168 2.26113 9.08071 1.76884C9.58974 1.27656 10.2801 1 11 1Z" stroke="#434343" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- точки -->
      <div class="dots">
        <span
          v-for="i in 2"
          :key="i"
          :class="['dot', { active: activeSlide === i - 1 }]"
          @click="activeSlide = i - 1"
        />
      </div>
    </div>

    <!-- ===== ПЛАНШЕТ/ДЕСКТОП ===== -->
    <div v-else class="desktop-row">
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
        <button class="icon-btn remove" @click="emit('remove')" aria-label="Удалить">
          <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 3.625H20.5M8.28571 7.5625V18.0625M13.7143 7.5625V18.0625M4.21429 3.625H17.7857V19.375C17.7857 20.0712 17.4997 20.7389 16.9907 21.2312C16.4817 21.7234 15.7913 22 15.0714 22H6.92857C6.2087 22 5.51831 21.7234 5.00928 21.2312C4.50025 20.7389 4.21429 20.0712 4.21429 19.375V3.625ZM11 1C11.6848 0.999791 12.3443 1.24991 12.8465 1.70021C13.3486 2.15052 13.6561 2.76773 13.7075 3.42813L13.7143 3.625H8.28571C8.28571 2.92881 8.57168 2.26113 9.08071 1.76884C9.58974 1.27656 10.2801 1 11 1Z" stroke="#434343" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import BaseDropdown from '@/components/Favourite/BaseDropDown.vue'
import QuantitySelect from '@/components/Favourite/QuantitySelector.vue'

const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, required: true }
})
const emit = defineEmits(['remove', 'update-quantity', 'update-options'])

const localQty = ref(props.item.quantity || 1)
const localSize = ref(props.item.selectedSize || props.item.product?.sizes?.[0] || null)

watch(
  () => props.item,
  (it) => {
    localQty.value = it.quantity || 1
    localSize.value = it.selectedSize || it.product?.sizes?.[0] || null
  },
  { deep: true }
)

watch(localQty, (val) => {
  const n = Math.max(1, Number(val) || 1)
  if (n !== val) localQty.value = n
  emit('update-quantity', n)
})
watch(localSize, (val) => {
  emit('update-options', { selectedSize: val ?? null })
})

const productImage = computed(() => {
  const p = props.item.product || {}
  if (Array.isArray(p.images) && p.images.length) return p.images[0]
  return p.image || props.item.image || ''
})
const codeText = computed(() => props.item.product?.code || props.item.product?.id || '')

const sizeOptions = computed(() =>
  (props.item.product?.sizes || []).map(s => ({ label: s, value: s }))
)

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

function formatPrice(v) { return (Number(v) || 0).toLocaleString('ru-RU') }
</script>

<style lang="scss" scoped>
@import "./CartItem.scss";
</style>

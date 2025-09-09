<template>
  <div
    class="favourite-item"
    :class="{ 'is-mobile': isMobile }"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- ====== МОБИЛЬНАЯ ВЕРСИЯ (2 слайда) ====== -->
    <div v-if="isMobile" class="mobile-wrapper">
      <!-- Левая стрелка видна только на 2-м слайде -->
      <button
        v-show="activeSlide === 1"
        class="nav-arrow nav-arrow--left"
        type="button"
        aria-label="Предыдущий"
        @click="onPrev"
      >
        <svg viewBox="0 0 24 24" class="arrow-ic" aria-hidden="true">
          <path d="M15 4L7 12l8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Правая стрелка видна только на 1-м слайде -->
      <button
        v-show="activeSlide === 0"
        class="nav-arrow nav-arrow--right"
        type="button"
        aria-label="Следующий"
        @click="onNext"
      >
        <svg viewBox="0 0 24 24" class="arrow-ic" aria-hidden="true">
          <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- СЛАЙД 1: инфо -->
      <div v-show="activeSlide === 0" class="slide slide-info">
        <div class="left">
          <img :src="mainImage" :alt="product.name" class="product-image" />
        </div>

        <div class="right">
          <p class="code">Арт: {{ product.code }}</p>
          <h3 class="name">{{ product.name }}</h3>
          <p class="price">{{ product.price.toLocaleString() }} ₽</p>
        </div>
      </div>

      <!-- СЛАЙД 2: Размер + Количество + Удалить -->
      <div v-show="activeSlide === 1" class="slide slide-controls">
        <div class="controls-row">
          <div class="field compact">
            <!-- <label class="label">Размер</label> -->
            <BaseDropdown class="dd" :options="sizeOptions" v-model="sizeProxy" />
          </div>

          <div class="field compact">
            <!-- <label class="label">Количество</label> -->
            <QuantitySelect class="qty" v-model="quantityProxy" />
          </div>

          <div class="field compact no-label">
            <label class="label label--spacer" aria-hidden="true"> </label>
            <button
              type="button"
              class="btn-fav-remove"
              aria-label="Удалить из избранного"
              @click="store.removeFromFavourites(product.id)"
            >
              <!-- твой исходный SVG -->
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 3.625H20.5M8.28571 7.5625V18.0625M13.7143 7.5625V18.0625M4.21429 3.625H17.7857V19.375C17.7857 20.0712 17.4997 20.7389 16.9907 21.2312C16.4817 21.7234 15.7913 22 15.0714 22H6.92857C6.2087 22 5.51831 21.7234 5.00928 21.2312C4.50025 20.7389 4.21429 20.0712 4.21429 19.375V3.625ZM11 1C11.6848 0.999791 12.3443 1.24991 12.8465 1.70021C13.3486 2.15052 13.6561 2.76773 13.7075 3.42813L13.7143 3.625H8.28571C8.28571 2.92881 8.57168 2.26113 9.08071 1.76884C9.58974 1.27656 10.2801 1 11 1Z" stroke="#434343" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Точки -->
      <div class="dots">
        <span
          v-for="i in 2"
          :key="i"
          :class="['dot', { active: activeSlide === i - 1 }]"
          @click="activeSlide = i - 1"
        />
      </div>
    </div>

    <!-- ====== ПЛАНШЕТ/ДЕСКТОП ====== -->
    <div v-else class="desktop-row">
      <div class="col col-image">
        <img :src="mainImage" :alt="product.name" class="product-image" />
      </div>

      <div class="col col-info">
        <p class="code">Артикул: {{ product.code }}</p>
        <h3 class="name">{{ product.name }}</h3>
        <p class="price">{{ product.price.toLocaleString() }} ₽</p>
      </div>

      <!-- Правая колонка: селект, счетчик и ПОСЛЕ них — корзина (в одну линию) -->
      <div class="col col-controls">
        <BaseDropdown class="dd" :options="sizeOptions" v-model="sizeProxy" />
        <QuantitySelect class="qty" v-model="quantityProxy" />
        <button
          type="button"
          class="icon-btn icon-fav-remove"
          aria-label="Удалить из избранного"
          @click="store.removeFromFavourites(product.id)"
        >
          <!-- твой исходный SVG -->
          <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 3.625H20.5M8.28571 7.5625V18.0625M13.7143 7.5625V18.0625M4.21429 3.625H17.7857V19.375C17.7857 20.0712 17.4997 20.7389 16.9907 21.2312C16.4817 21.7234 15.7913 22 15.0714 22H6.92857C6.2087 22 5.51831 21.7234 5.00928 21.2312C4.50025 20.7389 4.21429 20.0712 4.21429 19.375V3.625ZM11 1C11.6848 0.999791 12.3443 1.24991 12.8465 1.70021C13.3486 2.15052 13.6561 2.76773 13.7075 3.42813L13.7143 3.625H8.28571C8.28571 2.92881 8.57168 2.26113 9.08071 1.76884C9.58974 1.27656 10.2801 1 11 1Z" stroke="#434343" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFavouriteStore } from '@/stores/useFavouriteStore'
import BaseDropdown from '@/components/Favourite/BaseDropDown.vue'
import QuantitySelect from '@/components/Favourite/QuantitySelector.vue'

const props = defineProps({ product: { type: Object, required: true } })
const store = useFavouriteStore()

const mainImage = computed(() => props.product.image || props.product.images?.[0] || '')
const sizeOptions = computed(() => (props.product.sizes || []).map(s => ({ label: s, value: s })))

const sizeProxy = computed({
  get: () => props.product.selectedSize || '',
  set: (val) => store.updateFavourite(props.product.id, 'selectedSize', val)
})
const quantityProxy = computed({
  get: () => props.product.quantity ?? 1,
  set: (val) => {
    const next = Number(val)
    if (Number.isFinite(next) && next >= 1) {
      store.updateFavourite(props.product.id, 'quantity', next)
    }
  }
})

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
function onPrev () { if (activeSlide.value > 0) activeSlide.value -= 1 }
function onNext () { if (activeSlide.value < 1) activeSlide.value += 1 }
</script>

<style scoped>
/* Общий контейнер */
.favourite-item{
  position: relative;
  background: #f8f5ea;
  border-bottom: 1px solid #ddd;
  padding: 16px;
}

/* ===== Мобильная версия ===== */
.mobile-wrapper{ position: relative; }
.slide{ display: grid; grid-template-columns: 90px 1fr; gap: 12px; }

/* резерв под стрелки */
.slide-info     { padding-right: 52px; } /* справа — под правую стрелку */
.slide-controls { grid-template-columns: 1fr; padding-left: 52px; } /* слева — под левую */

.left{ display: flex; align-items: flex-start; }
.right{ display: flex; flex-direction: column; gap: 8px; }

.product-image{ width: 84px; height: 112px; object-fit: cover; border-radius: 6px; }

.code{ font-size: 12px; color: #6b6b6b; }
.name{ font-weight: 600; line-height: 1.25; }
.price{ font-size: 16px; font-weight: 600; margin-top: 6px; }

/* Точки */
.dots{ display: flex; justify-content: center; gap: 8px; margin-top: 10px; }
.dot{ width: 8px; height: 8px; border-radius: 50%; background: #d2cfc2; cursor: pointer; }
.dot.active{ background: #39213d; }

/* Стрелки (мобайл) */
.nav-arrow{
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 36px; height: 56px;
  display: inline-flex; align-items: center; justify-content: center;
  background: #fff; box-shadow: 0 0 0 1px #e0ddd1 inset; border-radius: 4px; z-index: 2;
  border: none;
}
.nav-arrow--left{ left: 8px; }
.nav-arrow--right{ right: 8px; }
.arrow-ic{ width: 20px; height: 20px; }

/* Второй слайд */
.slide-controls .controls-row{
  --label-h: 16px; --ctrl-h: 42px;
  display: flex; align-items: flex-end; gap: 10px; width: max-content; max-width: 100%;
}
.slide-controls .controls-row .field.compact{ display: flex; flex-direction: column; align-items: flex-start; width: auto; }
.slide-controls .controls-row .field.compact .label{ display: block; min-height: var(--label-h); margin-bottom: 6px; }
.slide-controls .controls-row .field.compact.no-label .label--spacer{ visibility: hidden; }

.dd{ display: inline-flex; align-items: center; box-sizing: border-box; height: var(--ctrl-h); padding: 0 12px; border-radius: 6px; line-height: 1; }
.qty{ display: inline-flex; align-items: center; box-sizing: border-box; height: var(--ctrl-h); padding: 0 14px; border-radius: 6px; }

.btn-fav-remove{
  display: inline-flex; align-items: center; justify-content: center;
  box-sizing: border-box; height: var(--ctrl-h); width: var(--ctrl-h);
  border: none; background: #F3F1E2; color: #39213D; cursor: pointer;
}

/* ===== Десктоп ===== */
.desktop-row{
  display: grid;
  grid-template-columns: 100px 1fr auto; /* фото | инфо | правая колонка (по ширине контента) */
  align-items: center;
  gap: 20px;
  padding: 16px 0;
}

.col-image .product-image{ width: 84px; height: 112px; object-fit: cover; border-radius: 6px; }
.col-info .code{ font-size: 13px; color: #6b6b6b; margin-bottom: 4px; }
.col-info .name{ font-size: 16px; font-weight: 600; margin: 2px 0; }
.col-info .price{ font-size: 18px; font-weight: 600; margin-top: 6px; }

/* Правая колонка: одна линия — селект, счётчик, корзина */
.col-controls{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
.col-controls .dd, .col-controls .qty{ height: 40px; }

/* Кнопка удаления */
.icon-btn{
  width: 36px; height: 36px;
  border: none;
  background: #F3F1E2; color: #39213D;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.icon-btn svg{ display:block; } /* на всякий случай убираем влияние line-height */

@media (hover:hover){
  .btn-fav-remove:hover, .icon-btn:hover{ opacity: .92; }
  .btn-fav-remove:active, .icon-btn:active{ opacity: .75; }
}

@media (min-width: 1200px){
  .desktop-row{ gap: 24px; }
  .col-info .name{ font-size: 18px; }
  .col-info .price{ font-size: 20px; }
}
</style>

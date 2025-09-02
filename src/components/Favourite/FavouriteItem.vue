<template>
  <div
    class="favourite-item"
    :class="{ 'is-mobile': isMobile }"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- ====== Мобильная версия: 2 слайда ====== -->
    <div v-if="isMobile" class="mobile-wrapper">
      <!-- СЛАЙД 1: Информация + кнопки -->
      <div v-show="activeSlide === 0" class="slide slide-info">
        <div class="left">
          <img :src="mainImage" :alt="product.name" class="product-image" />
        </div>

        <div class="right">
          <p class="code">Арт: {{ product.code }}</p>
          <h3 class="name">{{ product.name }}</h3>
          <p class="price">{{ product.price.toLocaleString() }} ₽</p>

          <div class="actions">
            <!-- ✦ правка: оставляем события наверх, чтобы не ломать логику родителя -->
            <button class="btn btn-remove" @click="$emit('remove', product.id)">Удалить</button>
            <button class="btn btn-cart" @click="$emit('add-to-cart', product)">В корзину</button>
          </div>
        </div>
      </div>

      <!-- СЛАЙД 2: Параметры (только размер + количество) -->
      <div v-show="activeSlide === 1" class="slide slide-controls">
        <!-- ✦ правка: цвет убран по требованию, оставляем размер/кол-во -->
        <div class="field">
          <label class="label">Размер</label>
          <!-- ✦ правка: BaseDropdown использует {label,value}, поэтому мапим sizes -->
          <BaseDropdown
            :options="sizeOptions"
            v-model="sizeProxy"               
          />
        </div>

        <div class="field">
          <label class="label">Количество</label>
          <QuantitySelect
            v-model="quantityProxy"           
          />
        </div>
      </div>

      <!-- точки навигации -->
      <div class="dots">
        <span
          v-for="i in 2"
          :key="i"
          :class="['dot', { active: activeSlide === i - 1 }]"
          @click="activeSlide = i - 1"
        />
      </div>
    </div>

    <!-- ====== Планшет/Десктоп: без слайдера ====== -->
    <div v-else class="desktop-row">
      <div class="col col-image">
        <img :src="mainImage" :alt="product.name" class="product-image" />
      </div>

      <div class="col col-info">
        <p class="code">Арт: {{ product.code }}</p>
        <h3 class="name">{{ product.name }}</h3>
        <p class="price">{{ product.price.toLocaleString() }} ₽</p>
      </div>

      <div class="col col-size">
        <span class="label">Размер</span>
        <BaseDropdown
          :options="sizeOptions"
          v-model="sizeProxy"                
        />
      </div>

      <div class="col col-qty">
        <span class="label">Количество</span>
        <QuantitySelect v-model="quantityProxy" />
      </div>

      <div class="col col-actions">
        <!-- ✦ правка: события остаются, чтобы не ломать Favorites.vue -->
        <button class="icon-btn" @click="$emit('add-to-cart', product)">🛒</button>
        <button class="icon-btn" @click="$emit('remove', product.id)">🗑️</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// ✦ правка: полностью нативная реализация свайпа; никаких Swiper
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFavouriteStore } from '@/stores/useFavouriteStore'

// ✦ правка: подключаем кастомные элементы (по требованию)
import BaseDropdown from '@/components/Favourite/BaseDropDown.vue'
import QuantitySelect from '@/components/Favourite/QuantitySelector.vue'

const props = defineProps({
  product: { type: Object, required: true }
})

defineEmits(['remove', 'add-to-cart']) // ✦ правка: сохраняем старые события родителю

const store = useFavouriteStore()

// ✦ правка: единый источник картинки (часть товаров приходит с image, часть с images[0])
const mainImage = computed(() => props.product.image || props.product.images?.[0] || '')

// ✦ правка: BaseDropdown ждёт [{label, value}], sizes у нас — массив строк
const sizeOptions = computed(() =>
  (props.product.sizes || []).map(s => ({ label: s, value: s }))
)

// ✦ правка: двухсторонние прокси, которые читают из стора и пишут в стор через updateFavourite
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

// ======= Адаптив =======
const isMobile = ref(window.innerWidth < 768)
const onResize = () => { isMobile.value = window.innerWidth < 768 }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

// ======= Свайп (мобайл) =======
const activeSlide = ref(0)            // 0 — инфо, 1 — параметры
let touchStartX = 0
const SWIPE_THRESHOLD = 40            // ✦ правка: чуть чувствительнее, чем раньше

function onTouchStart(e) {
  // Берём первый палец; passive=true в шаблоне отключает лишние reflow
  touchStartX = e.changedTouches?.[0]?.clientX ?? 0
}

function onTouchEnd(e) {
  const x = e.changedTouches?.[0]?.clientX ?? 0
  const dx = touchStartX - x
  if (Math.abs(dx) < SWIPE_THRESHOLD) return

  if (dx > 0 && activeSlide.value < 1) activeSlide.value = 1   // свайп влево → на слайд параметров
  if (dx < 0 && activeSlide.value > 0) activeSlide.value = 0   // свайп вправо → назад к инфо
}
</script>

<style scoped>
/* ===== БАЗОВАЯ СЕТКА ===== */
.favourite-item {
  position: relative;
  background: #f8f5ea;
  border-bottom: 1px solid #ddd;
  padding: 16px;
}

/* ===== МОБИЛЬНЫЕ СЛАЙДЫ ===== */
.mobile-wrapper {
  min-height: 230px; /* ✦ правка: фиксированная высота контейнера для стабильности */
}

.slide { display: grid; grid-template-columns: 90px 1fr; gap: 12px; }
.slide-controls { grid-template-columns: 1fr; }

.left { display: flex; align-items: flex-start; }
.right { display: flex; flex-direction: column; gap: 8px; }

.product-image {
  width: 84px;
  height: 112px;
  object-fit: cover;
  border-radius: 6px;
}

.code { font-size: 12px; color: #6b6b6b; }
.name { font-weight: 600; line-height: 1.25; }
.price { font-size: 16px; font-weight: 600; margin-top: 2px; }

.actions { display: flex; gap: 8px; margin-top: auto; }
.btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 14px;
  cursor: pointer;
}
.btn-remove { background: #f0f0f0; color: #222; }
.btn-cart   { background: #39213d; color: #fff; }

/* Параметры (слайд 2) */
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.label { font-size: 12px; color: #6b6b6b; }

/* Точки навигации */
.dots { display: flex; justify-content: center; gap: 8px; margin-top: 10px; }
.dot {
  width: 8px; height: 8px; border-radius: 50%; background: #d2cfc2; cursor: pointer;
}
.dot.active { background: #39213d; }

/* ===== ПЛАНШЕТ/ДЕСКТОП ===== */
.desktop-row {
  display: grid;
  grid-template-columns: 90px 1fr 140px 120px 88px;
  align-items: center;
  gap: 16px;
}

.col-image .product-image {
  width: 84px;
  height: 112px;
}

.col-info .code { margin-bottom: 4px; }
.col-size, .col-qty { display: flex; flex-direction: column; gap: 6px; }

.col-actions { display: flex; gap: 8px; justify-content: flex-end; }
.icon-btn {
  width: 36px; height: 36px; border-radius: 8px; border: 1px solid #cfcfcf;
  background: #f3f1e2; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
}

/* ===== АДАПТИВ ===== */
@media (min-width: 768px) {
  .favourite-item { padding: 18px 16px; }
  .name { font-size: 16px; }
  .price { font-size: 18px; }
}

@media (min-width: 1200px) {
  .desktop-row { grid-template-columns: 100px 1fr 160px 140px 96px; gap: 20px; }
  .name { font-size: 18px; }
  .price { font-size: 20px; }
}
</style>

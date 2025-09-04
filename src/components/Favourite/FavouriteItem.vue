<template>
  <div
    class="favourite-item"
    :class="{ 'is-mobile': isMobile }"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- ====== МОБИЛЬНАЯ ВЕРСИЯ (2 слайда) ====== -->
    <div v-if="isMobile" class="mobile-wrapper">
      <!-- СЛАЙД 1: инфо + CTA -->
      <div v-show="activeSlide === 0" class="slide slide-info">
        <div class="left">
          <img :src="mainImage" :alt="product.name" class="product-image" />
        </div>

        <div class="right">
          <p class="code">Арт: {{ product.code }}</p>
          <h3 class="name">{{ product.name }}</h3>
          <p class="price">{{ product.price.toLocaleString() }} ₽</p>

          <div class="actions">
            <!-- эмитим нормализованный payload с актуальными size/quantity -->
            <button class="btn btn-cart" @click="$emit('add-to-cart', cartPayload())">
              В корзину
            </button>
          </div>
        </div>
      </div>

      <!-- СЛАЙД 2: Размер + Количество + Удалить из избранного (ровная линия) -->
      <div v-show="activeSlide === 1" class="slide slide-controls">
        <div class="controls-row">
          <!-- Размер -->
          <div class="field compact">
            <label class="label">Размер</label>
            <!-- класс провалится на корень BaseDropdown -->
            <BaseDropdown class="dd" :options="sizeOptions" v-model="sizeProxy" />
          </div>

          <!-- Количество -->
          <div class="field compact">
            <label class="label">Количество</label>
            <!-- класс провалится на корень QuantitySelect -->
            <QuantitySelect class="qty" v-model="quantityProxy" />
          </div>

          <!-- Удалить из избранного (такая же структура: лейбл + контрол) -->
          <div class="field compact no-label">
            <label class="label label--spacer" aria-hidden="true"> </label>
            <button
              type="button"
              class="btn-fav-remove"
              aria-label="Удалить из избранного"
              @click="store.removeFromFavourites(product.id)"
            >
              <svg viewBox="0 0 24 24" class="trash-ic" aria-hidden="true">
                <path
                  d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M7 7l1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"
                  fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
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

    <!-- ====== ПЛАНШЕТ/ДЕСКТОП ====== -->
    <div v-else class="desktop-row">
      <!-- Фото -->
      <div class="col col-image">
        <img :src="mainImage" :alt="product.name" class="product-image" />
      </div>

      <!-- Инфо -->
      <div class="col col-info">
        <p class="code">Артикул: {{ product.code }}</p>
        <h3 class="name">{{ product.name }}</h3>
        <p class="price">{{ product.price.toLocaleString() }} ₽</p>
      </div>

      <!-- Действия (иконки) -->
      <div class="col col-actions">
        <!-- тоже эмитим нормализованный payload -->
        <button
          class="icon-btn"
          aria-label="Добавить в корзину"
          @click="$emit('add-to-cart', cartPayload())"
        >
          <svg viewBox="0 0 24 24" class="cart-ic" aria-hidden="true">
            <path
              d="M6 6h15l-1.5 9h-12zM6 6l-2-2M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
              fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          class="icon-btn icon-fav-remove"
          aria-label="Удалить из избранного"
          @click="store.removeFromFavourites(product.id)"
        >
          <svg viewBox="0 0 24 24" class="trash-ic" aria-hidden="true">
            <path
              d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M7 7l1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"
              fill="none" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Контролы -->
      <div class="col col-controls">
        <BaseDropdown class="dd" :options="sizeOptions" v-model="sizeProxy" />
        <QuantitySelect class="qty" v-model="quantityProxy" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFavouriteStore } from '@/stores/useFavouriteStore'
import BaseDropdown from '@/components/Favourite/BaseDropDown.vue'
import QuantitySelect from '@/components/Favourite/QuantitySelector.vue'

const props = defineProps({
  product: { type: Object, required: true }
})

/** Единственный эмит наружу — add-to-cart */
defineEmits(['add-to-cart'])

const store = useFavouriteStore()

// изображение
const mainImage = computed(() => props.product.image || props.product.images?.[0] || '')

// опции размеров [{label, value}]
const sizeOptions = computed(() =>
  (props.product.sizes || []).map(s => ({ label: s, value: s }))
)

// прокси к Pinia (избранное)
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

/** Формируем нормализованный payload для корзины
 *  (гарантируем актуальные selectedSize и quantity).
 */
function cartPayload () {
  const size =
    sizeProxy.value ||
    props.product.selectedSize ||
    props.product.sizes?.[0] ||
    null

  const qty =
    Number(quantityProxy.value ?? props.product.quantity ?? 1) || 1

  return {
    ...props.product,
    selectedSize: size,
    quantity: qty
  }
}

// адаптив
const isMobile = ref(window.innerWidth < 768)
const onResize = () => { isMobile.value = window.innerWidth < 768 }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

// свайпы (мобайл)
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
</script>

<style scoped>
/* ===== БАЗА ===== */
.favourite-item{
  position: relative;
  background: #f8f5ea;
  border-bottom: 1px solid #ddd;
  padding: 16px;
}

/* ===== МОБИЛЬНЫЕ СЛАЙДЫ ===== */

/* рост по контенту */
.mobile-wrapper{ min-height: 0; }

.slide{ display: grid; grid-template-columns: 90px 1fr; gap: 12px; }
.slide-controls{ grid-template-columns: 1fr; }

.left{ display: flex; align-items: flex-start; }
.right{ display: flex; flex-direction: column; gap: 8px; }

.product-image{ width: 84px; height: 112px; object-fit: cover; border-radius: 6px; }

.code{ font-size: 12px; color: #6b6b6b; }
.name{ font-weight: 600; line-height: 1.25; }
.price{ font-size: 16px; font-weight: 600; margin-top: 6px; }

.actions{ display: flex; gap: 8px; margin-top: auto; }
.btn{
  flex: 1; padding: 10px 12px; border-radius: 10px;
  border: 1px solid transparent; font-size: 14px; cursor: pointer;
}
.btn-cart{ background: #39213d; color: #fff; }

/* Поля */
.field{ display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.label{ font-size: 12px; color: #6b6b6b; line-height: 1; }

/* Точки навигации */
.dots{ display: flex; justify-content: center; gap: 8px; margin-top: 10px; }
.dot{ width: 8px; height: 8px; border-radius: 50%; background: #d2cfc2; cursor: pointer; }
.dot.active{ background: #39213d; }

/* === MOBILE slide #2: одна линия, одинаковая высота, ровный низ === */
.slide-controls .controls-row{
  --label-h: 16px;   /* высота подписи */
  --ctrl-h: 42px;    /* высота коробки контрола */
  display: flex;
  align-items: flex-end;    /* низ всех трёх коробок совпадает */
  gap: 10px;
  width: max-content;
  max-width: 100%;
}

.slide-controls .controls-row .field.compact{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: auto;
}

/* одинаковая подпись у всех трёх */
.slide-controls .controls-row .field.compact .label{
  display: block;
  min-height: var(--label-h);
  margin-bottom: 6px;
}
.slide-controls .controls-row .field.compact.no-label .label--spacer{
  visibility: hidden; /* занимает место, но не видна */
}

/* Dropdown/Quantity — классы навешаны на инстансы компонентов */
.dd{
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  height: var(--ctrl-h);
  padding: 0 12px;
  border-radius: 6px;
  line-height: 1;
}
.qty{
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  height: var(--ctrl-h);
  padding: 0 14px;
  border-radius: 6px;
}

/* Кнопка удаления — как контрол */
.btn-fav-remove{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--ctrl-h);
  width: var(--ctrl-h);
  border-radius: 6px;
  border: 1px solid #39213D;
  background: #F3F1E2;
  color: #39213D;
  cursor: pointer;
}
.trash-ic{ width: 20px; height: 20px; }

/* Маленькие экраны */
@media (max-width: 360px){
  .slide-controls .controls-row{ --ctrl-h: 38px; gap: 8px; }
}

/* ===== ДЕСКТОП ===== */
.desktop-row{
  display: grid;
  grid-template-columns: 100px 1fr 100px 240px; /* фото | инфо | иконки | селект+qty */
  align-items: center;
  gap: 20px;
  padding: 16px 0;
}

.col-image .product-image{ width: 84px; height: 112px; object-fit: cover; border-radius: 6px; }
.col-info .code{ font-size: 13px; color: #6b6b6b; margin-bottom: 4px; }
.col-info .name{ font-size: 16px; font-weight: 600; margin: 2px 0; }
.col-info .price{ font-size: 18px; font-weight: 600; margin-top: 6px; }

/* Иконки действий */
.col-actions{ display: flex; gap: 10px; justify-content: flex-start; }
.icon-btn{
  width: 36px; height: 36px;
  border-radius: 6px; border: 1px solid #39213D;
  background: #F3F1E2; color: #39213D;
  cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
}
.cart-ic, .trash-ic{ width: 20px; height: 20px; }

/* Контролы справа (десктоп) */
.col-controls{ display: flex; flex-direction: row; gap: 12px; align-items: center; }
.col-controls .dd, .col-controls .qty{ height: 40px; }

@media (hover:hover){
  .btn-fav-remove:hover, .icon-btn:hover{ opacity: .92; }
  .btn-fav-remove:active, .icon-btn:active{ opacity: .75; }
}

/* Широкие экраны */
@media (min-width: 1200px){
  .desktop-row{ grid-template-columns: 110px 1fr 110px 260px; gap: 24px; }
  .col-info .name{ font-size: 18px; }
  .col-info .price{ font-size: 20px; }
}
</style>

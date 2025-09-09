<template>
  <div class="product-item">
    <!-- Вся карточка — ссылка. Обычный клик теперь всегда навигирует. -->
    <router-link class="item" :to="`/product/${product.id}`">
      <!-- Слайдер: НЕТ @click.
           Мы различаем «свайп» и «клик». Если это был свайп — отменим клик в capture. -->
      <div
        class="slider"
        tabindex="0"
        aria-roledescription="carousel"
        :aria-label="`Фотогалерея товара ${product.name}`"
        @click.capture="maybeSuppressClick"   
        @keydown.left.prevent.stop="prev"
        @keydown.right.prevent.stop="next"

        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"

        @mousedown.left.prevent="onMouseDown"
        @mousemove.passive="onMouseMove"
        @mouseup.passive="onMouseUp"
        @mouseleave.passive="onMouseUp"
      >
        <ul
          class="track"
          :style="{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isDragging ? 'none' : 'transform .35s ease'
          }"
        >
          <li v-for="(src, i) in images" :key="i" class="slide">
            <div class="ratio">
              <img
                class="photo"
                :src="src"
                :alt="`${product.name} — изображение ${i + 1}`"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </div>
          </li>
        </ul>

        <!-- Точки: клики листают, но не ведут по ссылке -->
        <div class="dots" @click.stop>
          <button
            v-for="(dot, i) in images.length"
            :key="`dot-${i}`"
            class="dot"
            type="button"
            :aria-current="i === currentIndex"
            :class="{ active: i === currentIndex }"
            @click="goTo(i)"
          />
        </div>
      </div>

      <!-- Подписи -->
      <p class="text name">{{ product.name }}</p>
      <p class="text code">{{ product.code }}</p>
      <p class="text price">{{ product.price }} ₽</p>
    </router-link>

    <!-- Избранное: клик не ведёт по ссылке -->
    <component
      :is="isDesktop ? (isFavourite ? FavDescFilled : FavDesc) : (isFavourite ? FavMobFilled : FavMonogram)"
      class="fav"
      @click.stop.prevent="toggleFavourite"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useFavouriteStore } from '@/stores/useFavouriteStore'
import FavMonogram from './icons/FavMonogram.vue'
import FavMobFilled from './icons/FavMobFilled.vue'
import FavDesc from './icons/FavDesc.vue'
import FavDescFilled from './icons/FavDescFilled.vue'

const props = defineProps({ product: { type: Object, required: true } })

/* избранное */
const favouriteStore = useFavouriteStore()
const isFavourite = computed(() => favouriteStore.isFavourite(props.product.id))
function toggleFavourite () {
  if (isFavourite.value) favouriteStore.removeFromFavourites(props.product.id)
  else favouriteStore.addToFavourites(props.product)
}

/* брейкпоинт */
const { width } = useWindowSize()
const isDesktop = computed(() => width.value >= 1024)

/* слайдер */
const images = computed(() => {
  const arr = Array.isArray(props.product.images) ? props.product.images : []
  return arr.length ? arr : ['/images/placeholder.jpg']
})
const currentIndex = ref(0)
function clampIndex (i) {
  const len = images.value.length || 1
  if (i < 0) return len - 1
  if (i > len - 1) return 0
  return i
}
function next () { currentIndex.value = clampIndex(currentIndex.value + 1) }
function prev () { currentIndex.value = clampIndex(currentIndex.value - 1) }
function goTo (i) { currentIndex.value = clampIndex(i) }

/* свайпы / drag */
const isDragging = ref(false)
const startX = ref(0)
const deltaX = ref(0)

/* флаг подавления клика после свайпа */
const suppressClick = ref(false)
function armSuppressClick () {
  suppressClick.value = true
  // быстро снимаем, чтобы не ловить клики дальше
  window.setTimeout(() => { suppressClick.value = false }, 0) // следующий тик достаточно
}
function maybeSuppressClick (e) {
  if (suppressClick.value) {
    e.preventDefault()
    e.stopPropagation()
  }
}

/* touch */
function onTouchStart (e) { isDragging.value = true; startX.value = e.touches[0].clientX; deltaX.value = 0 }
function onTouchMove (e) { if (isDragging.value) deltaX.value = e.touches[0].clientX - startX.value }
function onTouchEnd () { finishDrag() }

/* mouse */
function onMouseDown (e) { isDragging.value = true; startX.value = e.clientX; deltaX.value = 0 }
function onMouseMove (e) { if (isDragging.value) deltaX.value = e.clientX - startX.value }
function onMouseUp () { if (isDragging.value) finishDrag() }

function finishDrag () {
  const threshold = 50
  const moved = Math.abs(deltaX.value) > threshold
  if (moved) {
    if (deltaX.value > 0) prev()
    else next()
    armSuppressClick()      // ← отменим ближайший «клик» после свайпа
  }
  isDragging.value = false
  startX.value = 0
  deltaX.value = 0
}
</script>

<style scoped>
/* прежние стили, ключевые моменты оставлены для ясности */

.product-item { position: relative; }

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  font-family: 'PT Serif', serif;
  font-size: 16px;
  background: #F3F1E2;
  transition: box-shadow .3s ease;
}
.item:hover { box-shadow: 0 2px 8px rgba(0,0,0,.08); }

.slider { position: relative; width: 100%; overflow: hidden; outline: none; }
.track { display: flex; width: 100%; will-change: transform; list-style: none; padding: 0; margin: 0; }
.slide { flex: 0 0 100%; list-style: none; }
.ratio { position: relative; width: 100%; padding-top: 125%; overflow: hidden; }
.photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; user-select: none; -webkit-user-drag: none; }

.dots { display: flex; justify-content: center; gap: 6px; padding: 8px 0 4px; }
.dot { width: 6px; height: 6px; border-radius: 50%; border: 0; padding: 0; margin: 0; background: rgba(0,0,0,.28); line-height: 0; aspect-ratio: 1/1; }
.dot.active, .dot[aria-current="true"] { background: rgba(0,0,0,.75); }

.text { letter-spacing: 2px; margin: 4px 0; }
.name { margin-top: 6px; }

@media (min-width:1024px){ .text{font-size:20px; letter-spacing:6px;} }

.fav { position: absolute; top: 0; right: 0; transform: translate(-10px, 10px); z-index: 2; }
.fav svg { pointer-events: all; }
</style>

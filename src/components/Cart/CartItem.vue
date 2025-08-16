<template>
  <div class="cart-item">
    <!-- Изображение товара -->
    <!-- Сохранён класс cart-item__image как в твоей версии,
         но src теперь берётся из computed productImage (см. скрипт) -->
    <img :src="productImage" :alt="item.product.name" class="cart-item__image" />

    <!-- Информация о товаре -->
    <div class="cart-item__info">
      <h3 class="cart-item__name">{{ item.product.name }}</h3>
      <p class="cart-item__code">Код: {{ item.product.code }}</p>

      <!-- Выбор размера -->
      <!-- ВАЖНО: v-for теперь ссылается на item.product.sizes (как в шаблоне) -->
      <div class="cart-item__option">
        <label for="size-select">Размер:</label>
        <select
          id="size-select"
          v-model="localOptions.size"
          @change="onOptionsChange"
        >
          <option
            v-for="size in item.product.sizes"
            :key="size"
            :value="size"
          >
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Количество -->
      <div class="cart-item__quantity">
        <label for="quantity-select">Кол-во:</label>
        <select
          id="quantity-select"
          v-model.number="localQuantity"
          @change="onQuantityChange"
        >
          <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <!-- Цена -->
      <p class="cart-item__price">{{ (item.product.price * localQuantity) | price }} ₽</p>
    </div>

    <!-- Кнопка удаления -->
    <!-- Событие remove оставлено как в исходной версии (emit inline) -->
    <button class="cart-item__remove" @click="emit('remove')">
      ✕
    </button>
  </div>
</template>

<script setup>
/*
  Обновлённый CartItem.vue — сохранены классы/шаблон и сигнатуры событий,
  добавлены корректные источники картинок и синхронизация локального состояния.
*/

import { ref, reactive, computed, watch, onMounted } from 'vue'

// ---------- props / emits (как в оригинале) ----------
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// События — оставлены точные имена, которые были в твоей версии
const emit = defineEmits(["remove", "updateQuantity", "updateOptions"])

// ---------- Локальные реактивные переменные (как в твоём файле) ----------
// localQuantity: управляет текущим выбранным количеством в UI
const localQuantity = ref(props.item.quantity || 1)

// localOptions: объект с color/size — в исходнике color закомментирован,
// но оставляем структуру совместимой с тем, что было.
// Важно: исправлена и унифицирована точка доступа на sizes -> item.product.sizes
const localOptions = reactive({
  // color опционален — если в структуре есть item.product.colors, возьмём первый
  color: props.item.options?.color ?? props.item.product?.colors?.[0]?.name ?? "",
  // РАНЕЕ в присланном файле использовалось props.item.sizes — это было неточно.
  // Правильно: sizes находятся в product (item.product.sizes).
  size: props.item.options?.size ?? props.item.product?.sizes?.[0] ?? ""
})

// ---------- Вычисление изображения (фоллбэк) ----------
// Требование: не менять сигнатуру стора. Поэтому не передаём image при addToCart.
// В корзине отображать первую картинку из массива images (если есть).
// Здесь аккуратно вычисляем источник картинки:
// 1) если в item.product.images есть массив — берём [0]
// 2) иначе если есть item.product.image — берём его
// 3) иначе если есть item.image — берём его (на случай старых данных)
// 4) иначе — пустая строка (можно заменить на путь к плейсхолдеру)
const productImage = computed(() => {
  const prod = props.item.product || {}
  if (Array.isArray(prod.images) && prod.images.length > 0) return prod.images[0]
  if (prod.image) return prod.image
  if (props.item.image) return props.item.image
  return "" // или '/images/placeholder.png'
})

// ---------- Поддержка реактивности: если внешний prop item изменится, синхронизируем локалку ----------
watch(
  () => props.item,
  (newItem) => {
    // quantity
    localQuantity.value = newItem.quantity || 1

    // options: если пришли опции извне — оставляем их, иначе инициализируем по продукту
    localOptions.color = newItem.options?.color ?? newItem.product?.colors?.[0]?.name ?? ""
    localOptions.size = newItem.options?.size ?? newItem.product?.sizes?.[0] ?? ""
  },
  { deep: true, immediate: true }
)

// ---------- Хелпер форматирования цены (не ломаем шаблон) ----------
function formatPrice(v) {
  return (Number(v) || 0).toLocaleString('ru-RU')
}

// ---------- Handlers: те же имена, те же сигнатуры событий как в твоём файле ----------
function onQuantityChange() {
  // эмитируем текущее количество (как было)
  emit("updateQuantity", localQuantity.value)
}

function onOptionsChange() {
  // эмитируем объект опций (как было)
  // NOTE: в родителе ожидается структура { color?, size? } — оставляем её
  emit("updateOptions", { ...localOptions })
}

// Для совместимости с исходной версией у тебя была inline-emit для удаления:
// <button ... @click="emit('remove')"> — это осталось в шаблоне.
// Если хочешь, можно заменить на явную функцию:
function removeItem() {
  emit("remove")
}

</script>

<style lang="scss" scoped>
@import "./CartItem.scss";


</style>
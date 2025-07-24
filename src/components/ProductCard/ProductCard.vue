<template>
  <section class="product-card">
    <!-- Проверяем, что product определён -->
    <div v-if="product">
      <nav class="nav">
        <span>Главная // </span>
        <span>Каталог </span>
        <!-- <span>{{ product.name }}</span> -->
      </nav>

      <div class="product-title">
        <span>{{ product.name }}</span>
      </div>

      <div class="product-wrapper">
        <!-- Галерея изображений (слева на десктопе) -->
        <div class="gallery-thumbnails" v-if="isDesktop">
          <img
            v-for="(color, index) in product.colors"
            :key="index"
            :src="color.image"
            :alt="color.name"
            :class="{ active: currentImage === color.image }"
            @click="changeImage(color.image)"
          />
        </div>

        <!-- Основное изображение товара -->
        <div class="product-image">
          <img :src="currentImage" :alt="product.name" />
        </div>

        <!-- Информация о товаре -->
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-code">Арт: {{ product.code }}</p>
          <p class="product-price">{{ formatPrice(product.price) }} ₽</p>
          <p class="product-installment">4 платежа по {{ formatInstallment(product.price) }} ₽</p>

          <!-- Выбор цвета -->
          <div class="product-colors">
            <p class="label">Цвет: {{ selectedColor.name }}</p>
            <div class="color-options">
              <div
                v-for="(color, index) in product.colors"
                :key="index"
                class="color-circle"
                :style="{ backgroundColor: color.hex }"
                :class="{ selected: selectedColor.name === color.name }"
                @click="selectColor(color)"
              ></div>
            </div>
          </div>

          <!-- Выбор размера -->
          <div class="product-sizes">
            <p class="label">Размер</p>
            <div class="size-options">
              <button
                v-for="(size, index) in product.sizes"
                :key="index"
                :class="{ selected: selectedSize === size }"
                @click="selectSize(size)"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Количество (только на десктопе) -->
          <div class="product-quantity" v-if="isDesktop">
            <button @click="decrementQty">-</button>
            <span>{{ quantity }}</span>
            <button @click="incrementQty">+</button>
          </div>

          <!-- Кнопки действия -->
          <div class="product-actions">
            <button class="add-to-cart">В корзину</button>
            <button class="buy-now">Быстрая покупка</button>
          </div>

          <!-- Таблица размеров -->
          <a href="#" class="size-table">Таблица размеров</a>

          <accordion-product title="Состав"></accordion-product>
          <accordion-product title="Характеристики"></accordion-product>
          <accordion-product title="Уход за одеждой"></accordion-product>
          <!-- Описание и характеристики -->
          <!-- <div class="accordion">
            <details open>
              <summary>Состав</summary>
              <p>{{ product.description }}</p>
            </details>
            <details>
              <summary>Характеристики</summary>
              <p>Хлопок 100%</p>
            </details>
            <details>
              <summary>Уход за одеждой</summary>
              <p>Машинная стирка до 30°C</p>
            </details>
            <details>
              <summary>О доставке</summary>
              <p>Доставка по России и миру</p>
            </details>
            <details>
              <summary>Оплата</summary>
              <p>Картой, СБП или при получении</p>
            </details>
          </div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { useProductStore } from '../../stores/useProductStore';
import AccordionProduct from './AccordionProduct.vue';
import { useFavouriteStore } from '../../stores/useFavouriteStore'



//Добавить или убрать из стора с Избранным
const favouriteStore = useFavouriteStore()

function toggleFavorite(product) {
  if (favouriteStore.isFavorite(product.id)) {
    favouriteStore.removeFromFavorites(product.id)
  } else {
    favouriteStore.addToFavorites(product)
  }
}

/////////////////////////


// Получаем данные из хранилища и маршрута
const store = useProductStore();
const route = useRoute();

// Переменные состояния
const product = ref(null);
const currentImage = ref('');
const selectedColor = ref(null);
const selectedSize = ref(null);
const quantity = ref(1);

// Проверка, десктоп или мобильный режим
const { width } = useWindowSize();
const isDesktop = computed(() => width.value >= 768);

// Загружаем нужный товар по ID из URL
onMounted(async () => {
  await store.fetchProducts();
  product.value = store.products.find(p => p.id === parseInt(route.params.id));

  if (product.value) {
    selectedColor.value = product.value.colors[0];
    currentImage.value = selectedColor.value.image;
    console.log(product)
  }
});

// Методы взаимодействия
function selectColor(color) {
  selectedColor.value = color;
  currentImage.value = color.image;
}

function selectSize(size) {
  selectedSize.value = size;
}

function incrementQty() {
  quantity.value++;
}

function decrementQty() {
  if (quantity.value > 1) quantity.value--;
}

function changeImage(image) {
  currentImage.value = image;
}

function formatPrice(price) {
  return price.toLocaleString('ru-RU');
}

function formatInstallment(price) {
  return Math.floor(price / 4).toLocaleString('ru-RU');
}
</script>


<style scoped>
@import './ProductCard.scss'
</style>
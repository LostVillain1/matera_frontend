<template>
  <AppHeader></AppHeader>
  <div class="catalog">
    <!-- Заголовок и меню категорий -->
    <div class="catalog__header">
      <h1 class="catalog__title">Каталог</h1>
      <div class="catalog__tabs">
        <button
          v-for="category in ['Женщинам', 'Мужчинам', 'Детям']"
          :key="category"
          :class="['catalog__tab', { active: selectedCategory === category }]"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Сетка товаров -->
    <div class="catalog__grid">
      <ProductItem
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
  <AppFooter></AppFooter>
</template>

<script setup>
// Импорты Composition API и стора
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '../stores/useProductStore';
import ProductItem from '../components/ProductItem.vue';
import AppHeader from '../components/AppHeader/AppHeader.vue';
import AppFooter from '../components/AppFooter/AppFooter.vue';

// Состояние выбранной категории
const selectedCategory = ref('Женщинам');

// Получение стора
const store = useProductStore();

// Загружаем товары при монтировании компонента
onMounted(() => {
  store.fetchProducts();
});

// Фильтруем товары по выбранной категории
const filteredProducts = computed(() =>
  store.products.filter(p => p.category === selectedCategory.value)
);
</script>

<style lang="scss" scoped>
@import '@/views/Catalog.scss'
</style>
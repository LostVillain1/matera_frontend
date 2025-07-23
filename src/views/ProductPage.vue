<template>
  <AppHeader></AppHeader>
  <!-- Проверка, если товар найден, рендер карточки товара -->
  <ProductCard v-if="product" :product="product" />
  <div v-else>Товар не найден</div>
  <AppFooter></AppFooter>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/useProductStore';
import ProductCard from '@/components/ProductCard/ProductCard.vue';
import AppHeader from '@/components/AppHeader/AppHeader.vue';
import AppFooter from '@/components/AppFooter/AppFooter.vue';


const product = ref(null);

// Получаем текущий маршрут и стор
const route = useRoute();
const store = useProductStore();

onMounted(async () => {
  // Загружаем товары, если их нет
  if (!store.products.length) {
    await store.fetchProducts();
  }

  // Находим товар по ID из route.params
  const productId = parseInt(route.params.id); // Убедимся, что это число
  product.value = store.products.find(p => p.id === productId);
  console.log('Загруженный товар:', product.value);
});
</script>
<template>
  <!-- Ссылка на страницу товара с его ID -->
  <router-link :to="`/product/${product.id}`" class="item">
    <img :src="product.image" :alt="product.name" />
    <p>{{ product.name }}</p>
    <p>{{ product.code }}</p>
    <p>{{ product.price }} ₽</p>
  </router-link>
</template>
    
<script setup>
// Пропс: товар из каталога
defineProps({
  product: Object
});
</script>

<style scoped>  
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  font-family: 'PT Serif', serif;
  font-size: 16px;
  /* border: 1px solid #ddd; */
  /* padding: 12px; */
  background-color: #F3F1E2; 
  transition: box-shadow 0.3s ease;
}
.item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.item img {
  max-width: 100%;
  height: auto;
  margin-bottom: 8px;
}

/* Медиа-запросы для адаптивности */
@media (min-width: 768px) {
  
}

@media (min-width: 1024px) {
  
}


</style>
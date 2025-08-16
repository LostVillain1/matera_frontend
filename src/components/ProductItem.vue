<template>
  <!-- Ссылка на страницу товара с его ID -->
   <div class="product-item__wrapper">
    <router-link :to="`/product/${product.id}`" class="item">
        <img :src="product.images[0]" :alt="product.name" />
        <p>{{ product.name }}</p>
        <p>{{ product.code }}</p>
        <p>{{ product.price }} ₽</p>        
    </router-link>
    <fav-monogram class="monogramm" @click="toggleFavourite(product)"></fav-monogram>
     <!-- <button @click="toggleFavourite(product)">Test</button> -->
  </div>   
</template>
    
<script setup>
import { useFavouriteStore } from '@/stores/useFavouriteStore'
import FavMonogram from './icons/FavMonogram.vue'
import { onMounted, defineProps } from 'vue';

// Пропс - товар из каталога
const { product } = defineProps({
  product: Object,
});

const favouriteStore = useFavouriteStore()

function toggleFavourite(product) {
  if (favouriteStore.isFavourite(product.id)) {
    favouriteStore.removeFromFavourites(product.id)
  } else {
    console.log('TEST')
    favouriteStore.addToFavourites(product)
  }
  // console.log(product)
}

onMounted( () => console.log(product))


</script>

<style scoped> 

.product-item__wrapper {
position: relative;
}


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

.monogramm{
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
} 

/* Медиа-запросы для адаптивности */
@media (min-width: 768px) {
  
}

@media (min-width: 1024px) {
  
}


</style>
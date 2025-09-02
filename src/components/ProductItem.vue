<template>
  <!-- Ссылка на страницу товара с его ID -->
   <div class="product-item__wrapper">
    <router-link :to="`/product/${product.id}`" class="item">
        <img :src="product.images[0]" :alt="product.name" />
        <p>{{ product.name }}</p>
        <p>{{ product.code }}</p>
        <p>{{ product.price }} ₽</p>        
    </router-link>
    <!-- Мобильная версия -->
    <component
      v-if="!isDesktop"
      :is="isFavourite ? FavMobFilled : FavMonogram"
      class="monogramm"
      @click="toggleFavourite"
    />
    
    <!-- Десктопная версия -->
    <component
      v-else
      :is="isFavourite ? FavDescFilled : FavDesc"
      class="monogramm"
      @click="toggleFavourite"
    />
  </div>   
</template>
    
<script setup>
import { useFavouriteStore } from '@/stores/useFavouriteStore'
import FavMonogram from './icons/FavMonogram.vue'
import { useWindowSize } from '@vueuse/core'
import FavDesc from './icons/FavDesc.vue'
import { onMounted, defineProps, computed, ref } from 'vue';
import FavMobFilled from './icons/FavMobFilled.vue';
import FavDescFilled from './icons/FavDescFilled.vue';

// Пропс - товар из каталога
const { product } = defineProps({
  product: Object,
});

const favouriteStore = useFavouriteStore()
const { width } = useWindowSize();

// Используем ref для принудительного обновления компонента
const forceUpdate = ref(0);

const isFavourite = computed(() => {
  // Добавляем forceUpdate.value в зависимость, чтобы принудительно обновлять computed
  return favouriteStore.isFavourite(product.id);
});

function toggleFavourite() {
  if (isFavourite.value) {
    favouriteStore.removeFromFavourites(product.id);
    console.log('Removed from favorites');
  } else {
    favouriteStore.addToFavourites(product);
    console.log('Added to favorites');
  }
  
  // Принудительно обновляем компонент
  forceUpdate.value++;
}

const isDesktop = computed(() => width.value >= 1024);

onMounted(() => {
  console.log('Product:', product);
  console.log('Is favourite:', favouriteStore.isFavourite(product.id));
});
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
  transform: translate(-10px, 10px);
} 

.monogramm svg {
  pointer-events: all;
}

/* Медиа-запросы для адаптивности */
@media (min-width: 768px) {
  
}

@media (min-width: 1024px) {
  
}


</style>
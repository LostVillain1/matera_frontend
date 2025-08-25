<template>
  <AppHeader></AppHeader>
  <div class="favorites-page">
    
    <!-- Заголовок страницы -->
    <h1 class="title">Избранное</h1>

    <!-- Если избранное пусто — показываем сообщение-пустышку -->
    <p v-if="favorites.length === 0" class="empty-message">
      Вы пока ничего не добавили
    </p>

    <!-- Если есть товары — рендерим список карточек -->
    <div v-else class="favorites-list">
      <FavoriteItem
        v-for="product in favorites"
        :key="product.id"
        :product="product"
        @remove="removeFromFavourites"
        @add-to-cart="addToCart"
      />
    </div>

    <!-- Блок итоговой суммы и кнопки перехода в корзину -->
    <div v-if="favorites.length > 0" class="summary">
      <div class="total">
        <span>Итого</span>
        <span>{{ totalPrice }} ₽</span>
      </div>
      <button class="to-cart-button">Перейти в корзину</button>
    </div>
  </div>
  <AppFooter></AppFooter>
</template>

<script setup>
// Импорт API Vue и Pinia store
import { computed } from 'vue';
import { useFavouriteStore } from '@/stores/useFavouriteStore';
import FavoriteItem from '@/components/Favourite/FavouriteItem.vue';
import AppHeader from '@/components/AppHeader/AppHeader.vue';
import AppFooter from '@/components/AppFooter/AppFooter.vue';

// Инициализируем хранилище избранного
const store = useFavouriteStore();

// Создаём реактивную ссылку на массив избранных товаров
const favorites = computed(() => store.favorites);

// Метод удаления товара из избранного
function removeFromFavourites(id) {
  store.removeFromFavourites(id);
  console.log('test')
}

// Метод добавления товара в корзину (заглушка на будущее)
function addToCart(product) {
  console.log('Добавить в корзину:', product);
}

// Вычисление общей стоимости товаров в избранном
const totalPrice = computed(() => {
  return store.favorites.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
});
</script>

<style scoped>
@import '@/views/Favourites.scss'
</style>
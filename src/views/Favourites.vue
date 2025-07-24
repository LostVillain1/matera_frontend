<template>
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
        @remove="removeFromFavorites"
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
</template>

<script setup>
// Импорт API Vue и Pinia store
import { computed } from 'vue';
import { useFavouriteStore } from '@/stores/useFavouriteStore';
import FavoriteItem from '@/components/Favourite/FavouriteItem.vue';

// Инициализируем хранилище избранного
const store = useFavouriteStore();

// Создаём реактивную ссылку на массив избранных товаров
const favorites = computed(() => store.favorites);

// Метод удаления товара из избранного
function removeFromFavorites(id) {
  store.removeFromFavorites(id);
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
/* Основной контейнер страницы */
.favorites-page {
  padding: 16px;
  background-color: #f4f0e6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Заголовок страницы */
.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  color: #3d1f28;
}

/* Сообщение о пустом списке */
.empty-message {
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 48px;
}

/* Контейнер со списком товаров */
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

/* Блок итоговой стоимости и кнопки */
.summary {
  border-top: 1px solid #ccc;
  padding-top: 16px;
  margin-top: auto;
}

/* Строка "Итого" с суммой */
.total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #3d1f28;
}

/* Кнопка перехода в корзину */
.to-cart-button {
  width: 100%;
  padding: 12px;
  background-color: #3d1f28;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.to-cart-button:hover {
  background-color: #522934;
}
</style>
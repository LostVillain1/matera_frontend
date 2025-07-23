// Импортируем функции из Pinia и Vue
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useProductStore = defineStore('products', () => {
  // реактивная переменная для списка товаров
  const products = ref([]);

  // Асинхронная функция загрузки товаров
  async function fetchProducts() {
    // Если товары уже загружены — не делаем повторный запрос
    if (products.value.length > 0) return;

    try {
      // Загружаем локальный JSON-файл с мок-данными
      const response = await fetch('/mock-products.json');

      if (!response.ok) {
        console.log('Error')
        throw new Error('Ошибка загрузки товаров');
      }

      const data = await response.json();

      // Сохраняем полученные данные в хранилище
      products.value = data;
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    }
  }

  // Возвращаем переменные и методы из стора
  return {
    products,
    fetchProducts
  };
});
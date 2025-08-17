// stores/cartStore.js
// ============================================
// Pinia store для управления корзиной товаров.
// Поддерживает добавление, удаление, изменение
// количества и опций (цвет, размер) товаров.
// ============================================

import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // --------------------------------------------
  // Состояние (state)
  // --------------------------------------------

  // cartItems — массив объектов с товаром и выбранными опциями
  // Структура элемента:
  // {
  //   product: { id, name, price, ... },
  //   selectedColor: { name, hex, image },
  //   selectedSize: "M",
  //   quantity: 1
  // }

  // Загружаем сохранённую корзину из localStorage
  const savedCart = localStorage.getItem('cart')
  const cartItems = ref(savedCart ? JSON.parse(savedCart) : [])

  // --------------------------------------------
  // Вспомогательные внутренние функции (private)
  // --------------------------------------------

  /**
   * Генерирует уникальный ключ для товара с опциями.
   * Это нужно, чтобы понимать — один это товар или разные,
   * даже если у них одинаковый product.id, но разный цвет или размер.
   */
  function generateKey(productId, colorName, size) {
    return `${productId}_${colorName || 'no-color'}_${size || 'no-size'}`
  }

  /**
   * Находит индекс товара в массиве по id + цвету + размеру.
   * Если не найден — возвращает -1.
   */
  function findItemIndex(productId, colorName, size) {
    return cartItems.value.findIndex(
      (item) =>
        item.product.id === productId &&
        item.selectedColor?.name === colorName &&
        item.selectedSize === size
    )
  }

  // --------------------------------------------
  // Методы (actions)
  // --------------------------------------------

  /**
   * Добавляет товар в корзину.*/
   
  function addToCart(product, options = {}) {
    const { selectedColor = null, selectedSize = null, quantity = 1 } = options

    // Проверка на валидность входных данных
    if (!product || !product.id) {
      console.warn('addToCart: некорректный товар', product)
      return
    }

    if (quantity <= 0) {
      console.warn('addToCart: количество должно быть > 0')
      return
    }

    // Пытаемся найти уже существующий товар с теми же опциями
    const existingIndex = findItemIndex(product.id, selectedColor?.name, selectedSize)

    if (existingIndex !== -1) {
      // Если нашли — просто увеличиваем количество
      cartItems.value[existingIndex].quantity += quantity
    } else {
      // Если нет — добавляем новый объект в корзину
      cartItems.value.push({
        product,
        selectedColor,
        selectedSize,
        quantity
      })
    }
  }

  /**
   * Удаляет товар из корзины по индексу.
   */
  function removeByIndex(index) {
    if (index < 0 || index >= cartItems.value.length) {
      console.warn('removeByIndex: индекс вне диапазона', index)
      return
    }
    cartItems.value.splice(index, 1)
  }

  /**
   * Обновляет количество товара по индексу.
   */
  function updateQuantityByIndex(index, newQuantity) {
    if (index < 0 || index >= cartItems.value.length) {
      console.warn('updateQuantityByIndex: индекс вне диапазона', index)
      return
    }
    if (newQuantity <= 0) {
      // Если количество <= 0 — удаляем товар
      removeByIndex(index)
    } else {
      cartItems.value[index].quantity = newQuantity
    }
  }

  /**
   * Обновляет опции (цвет, размер) товара по индексу.
   */
  function updateOptionsByIndex(index, newOptions) {
    if (index < 0 || index >= cartItems.value.length) {
      console.warn('updateOptionsByIndex: индекс вне диапазона', index)
      return
    }

    const { selectedColor, selectedSize } = newOptions
    const item = cartItems.value[index]

    // Проверяем, нет ли уже в корзине такого же товара с теми же опциями
    const duplicateIndex = findItemIndex(item.product.id, selectedColor?.name, selectedSize)

    if (duplicateIndex !== -1 && duplicateIndex !== index) {
      // Если нашли — объединяем количество и удаляем текущий
      cartItems.value[duplicateIndex].quantity += item.quantity
      removeByIndex(index)
    } else {
      // Если нет — просто обновляем опции
      item.selectedColor = selectedColor
      item.selectedSize = selectedSize
    }
  }

  /**
   * Очищает корзину.
   */
  function clearCart() {
    cartItems.value = []
     localStorage.removeItem('cart')
  }

  /**
   * Имитирует оформление заказа.
   */
  function checkout() {
    if (!cartItems.value.length) {
      alert('Корзина пуста!')
      return
    }
    alert('Оформляем заказ на сумму: ' + totalPrice.value + ' ₽')
    clearCart()
  }

  // --------------------------------------------
  // Геттеры (computed)
  // --------------------------------------------

  const items = computed(() => cartItems.value)

  const totalItems = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
  )


  // --------------------------------------------
  // Синхронизация с localStorage
  // --------------------------------------------

  watch(
    cartItems,
    (newCart) => {
      // если корзина пустая — удаляем ключ
      if (newCart.length === 0) {
        localStorage.removeItem('cart')
      } else {
        localStorage.setItem('cart', JSON.stringify(newCart))
      }
    },
    { deep: true }
  )

  // --------------------------------------------
  // Публичный API (все методы и геттеры)
  // --------------------------------------------
  return {
    cartItems, // state
    items, totalItems, totalPrice, // getters
    addToCart, removeByIndex, updateQuantityByIndex, updateOptionsByIndex, clearCart, checkout // actions
  }
})
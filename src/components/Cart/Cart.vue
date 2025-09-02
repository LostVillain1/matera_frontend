<template>
  <!-- Шапка сайта -->
  <AppHeader />

  <main class="cart-page">
    <!-- Заголовок страницы -->
    <h1 class="title">Корзина</h1>

    <!-- Если корзина пустая — показываем заглушку -->
    <EmptyCart v-if="!cartItems.length" />

    <!-- Если есть товары -->
    <div v-else class="cart-grid">
      <!-- Левая колонка (список товаров) -->
      <section class="cart-list">
        <!-- Перебираем товары из стора -->
        <CartItem
          v-for="(item, idx) in cartItems"
          :key="itemKey(item, idx)"
          :item="item"
          :index="idx"
          @remove="removeByIndex"
          @update-quantity="updateQuantityByIndex"
          @update-options="updateOptionsByIndex"
        />
      </section>

      <!-- Правая колонка (итоги заказа) -->
      <aside class="cart-summary-wrap">
        <CartSummary
          :totalItems="totalItems"
          :totalPrice="totalPrice"
          @clear="clearCart"
          @checkout="checkout"
        />
      </aside>      
    </div>
     <!-- Форма оформления заказа -->
    <div class="checkout-form">
      <h2>Оформление заказа</h2>
      <input v-model="customerName" type="text" placeholder="Ваше имя" />
      <input v-model="customerPhone" type="tel" placeholder="Телефон" />
      <input v-model="customerEmail" type="email" placeholder="Email" />
      <textarea v-model="customerComment" placeholder="Комментарий"></textarea>
    </div>

    <!-- Карта -->
    <div id="yandex-map" class="map-container"></div>
    <div>
      <h2>Выберите пункт выдачи заказа (ПВЗ)</h2>
      <div id="map" style="width: 100%; height: 400px;"></div>
      <p v-if="selectedPickupPoint">Вы выбрали ПВЗ: {{ selectedPickupPoint }}</p>
    </div>

    <!-- Кнопка оформления -->
    <button @click="checkout" class="checkout-btn">Подтвердить заказ</button>
  </main>

  <!-- Подвал сайта -->
  <AppFooter />
</template>

<script setup>
/**
 * Cart.vue — главный контейнер страницы корзины.
 * - Берёт данные из cartStore
 * - Передаёт события в store (remove/update/clear)
 */


import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AppFooter from '@/components/AppFooter/AppFooter.vue'
import EmptyCart from './EmptyCart.vue'
import CartItem from './CartItem.vue'
import CartSummary from './CartSummary.vue'


import { useCartStore } from '@/stores/useCartStore'
import { storeToRefs } from 'pinia'
import { ref, onMounted,onBeforeUnmount } from 'vue'
import { loadYMap } from '@/utils/loadYMap'



// --- Поля для формы оформления заказа ---
const customerName = ref('')     
const customerPhone = ref('')   
const customerEmail = ref('')    
const customerComment = ref('')  // Комментарий к заказу


// --- Данные для работы с картой ---
const selectedPickupPoint = ref(null) // Храним выбранный ПВЗ (его код или адрес)
let mapInstance = null                // Сюда запишем объект карты после инициализации
let placemark = null                  // Для отметки выбранного ПВЗ

// --- Функция инициализации карты ---
onMounted(async () => {
  try {
    // Загружаем API
    const ymaps = await loadYMap()

    // Создаём карту внутри контейнера с id="yandex-map"
    mapInstance = new ymaps.Map("yandex-map", {
      center: [55.751244, 37.618423], // Москва (по умолчанию)
      zoom: 10,
      controls: ["zoomControl", "fullscreenControl"],
    })

    // Для проверки добавим тестовую метку (можно удалить потом)
    const testPlacemark = new ymaps.Placemark(
      [55.751244, 37.618423], // Координаты
      {
        balloonContent: "Тестовая точка", // Что будет в попапе
      },
      {
        preset: "islands#redDotIcon", // Иконка метки
      }
    )
    mapInstance.geoObjects.add(testPlacemark)
  } catch (error) {
    console.error("Ошибка при инициализации карты:", error)
  }
})

onBeforeUnmount(() => {
  // При удалении компонента очищаем карту, чтобы не было утечек памяти
  if (mapInstance) {
    mapInstance.destroy()
    mapInstance = null
  }
})


// Логика работы с корзиной

const cartStore = useCartStore()

// Достаём реактивные данные (геттеры)
const { items: cartItems, totalItems, totalPrice } = storeToRefs(cartStore)

// Методы стора
const { removeByIndex, updateQuantityByIndex, updateOptionsByIndex, clearCart } = cartStore

// Генерация ключа для стабильного рендера элементов
const itemKey = (item, idx) => `${item.id}-${idx}`

// Действие оформления заказа
// --- Функция оформления заказа ---
function checkout() {
  if (!customerName.value || !customerPhone.value || !selectedPickupPoint.value) {
    alert('Заполните все обязательные поля и выберите пункт выдачи заказа!')
    return
  }

  const orderData = {
    customer: {
      name: customerName.value,
      phone: customerPhone.value,
      email: customerEmail.value,
      comment: customerComment.value
    },
    items: cartStore.items,
    pickupPoint: selectedPickupPoint.value
  }

  // Отправляем заказ на сервер (пока имитация console.log)
  console.log('Заказ отправлен:', orderData)

  // Очищаем корзину и форму
  cartStore.clearCart()
  customerName.value = ''
  customerPhone.value = ''
  customerEmail.value = ''
  customerComment.value = ''
  selectedPickupPoint.value = null
}
</script> 

<style lang="scss" scoped>

@import "./Cart.scss";  

</style>
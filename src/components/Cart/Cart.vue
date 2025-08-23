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
import { ref, onMounted } from 'vue'
// import { loadYmap } from '@/utils/loadYMap'



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
async function initMap() {
  try {
    // Ждем загрузки API Яндекс.Карт (из утилиты loadYmap.js)
    const ymaps = await loadYmap()

    // Создаем карту и помещаем её в контейнер с id="map"
    mapInstance = new ymaps.Map('map', {
      center: [55.751574, 37.573856], // Москва по умолчанию
      zoom: 9
    })

    // Пример: добавим клик по карте для выбора ПВЗ
    mapInstance.events.add('click', function (e) {
      const coords = e.get('coords')

      // Если метка уже есть → переносим её
      if (placemark) {
        placemark.geometry.setCoordinates(coords)
      } else {
        // Иначе создаем новую метку
        placemark = new ymaps.Placemark(coords, {
          balloonContent: 'Выбранный ПВЗ'
        }, {
          draggable: true
        })
        mapInstance.geoObjects.add(placemark)
      }

      // Здесь обычно мы бы вызывали API СДЭК для получения кода ПВЗ по координатам.
      // Пока сохраняем координаты как выбранный ПВЗ.
      selectedPickupPoint.value = coords
    })
  } catch (error) {
    console.error('Ошибка инициализации карты:', error)
  }
}



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
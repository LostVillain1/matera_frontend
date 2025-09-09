<template>
  <AppHeader />

  <main class="cart-page">
    <h1 class="title">Корзина</h1>

    <EmptyCart v-if="!cartItems.length" />

    <div v-else class="cart-grid">
      <!-- СПИСОК ТОВАРОВ -->
      <section class="cart-list" aria-label="Список товаров в корзине">
        <CartItem
          v-for="(item, idx) in cartItems"
          :key="itemKey(item, idx)"
          :item="item"
          @remove="() => removeByIndex(idx)"
          @update-quantity="(val) => updateQuantityByIndex(idx, val)"
          @update-options="(opts) => updateOptionsByIndex(idx, opts)"
        />
      </section>

      <!-- БЛОК ИТОГА -->
      <aside class="cart-summary-wrap">
        <div class="summary-card" :class="{ 'summary-card--compact': isMobile }">
          <!-- МОБИЛЬНЫЙ: только доставка и итого -->
          <template v-if="isMobile">
            <div class="summary-line">
              <span>Доставка</span>
              <span>0 ₽</span>
            </div>
            <div class="summary-total summary-total--mobile">
              <span>Итого</span>
              <span>{{ formatPrice(totalPrice) }} ₽</span>
            </div>
          </template>

          <!-- ≥768px: полный сайдбар -->
          <template v-else>
            <div class="summary-accordion">
              <button class="acc-row" :aria-expanded="opened.deliveryInfo.toString()" @click="opened.deliveryInfo = !opened.deliveryInfo">
                <span>Информация о доставке</span><span>+</span>
              </button>
              <transition name="slide">
                <div v-if="opened.deliveryInfo" class="acc-panel">
                  <p>Доставка осуществляется службой СДЕК.</p>
                </div>
              </transition>

              <button class="acc-row" :aria-expanded="opened.returns.toString()" @click="opened.returns = !opened.returns">
                <span>Обмен и возврат</span><span>+</span>
              </button>
              <transition name="slide">
                <div v-if="opened.returns" class="acc-panel"><p>Условия обмена и возврата уточняйте у оператора.</p></div>
              </transition>

              <button class="acc-row" :aria-expanded="opened.payment.toString()" @click="opened.payment = !opened.payment">
                <span>Об оплате</span><span>+</span>
              </button>
              <transition name="slide">
                <div v-if="opened.payment" class="acc-panel"><p>Оплата картой онлайн.</p></div>
              </transition>
            </div>

            <div class="summary-split"></div>

            <div class="summary-line"><span>Доставка</span><span>0 ₽</span></div>
            <div class="summary-total"><span>Итого</span><span>{{ formatPrice(totalPrice) }} ₽</span></div>

            <button class="pay-btn" @click="checkout">Оплатить</button>
            <p class="policy">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и офертой</p>
            <label class="agree"><input type="checkbox" v-model="agree" /><span>Согласие на обработку персональных данных</span></label>
          </template>
        </div>
      </aside>

      <!-- ФОРМА ПЕРСОНАЛЬНЫХ ДАННЫХ -->
      <section v-if="cartItems.length" class="checkout-form">
        <h2 class="form-title">Персональные данные</h2>
        <div class="form-grid">
          <div class="form-field"><label>Имя</label><input v-model="customerName" type="text" class="line-input" /></div>
          <div class="form-field"><label>Фамилия</label><input v-model="customerSurname" type="text" class="line-input" /></div>
          <div class="form-field"><label>Телефон</label><input v-model="customerPhone" type="tel" class="line-input" /></div>
          <div class="form-field"><label>Почта</label><input v-model="customerEmail" type="email" class="line-input" /></div>
        </div>
      </section>

      <!-- ДОСТАВКА (карту пока не трогаем) -->
      <section class="delivery-section">
        <h2 class="delivery-title">Информация о доставке</h2>
        <div class="delivery-method">
          <span class="label">Способ доставки</span>
          <label class="radio"><input type="radio" checked disabled /><span>СДЕК</span></label>
        </div>
        <div id="yandex-map" class="delivery-map"></div>
        <p v-if="selectedPickupPoint" class="pvz">ПВЗ: {{ selectedPickupPoint }}</p>
      </section>
    </div>
  </main>

  <AppFooter />
</template>

<script setup>
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AppFooter from '@/components/AppFooter/AppFooter.vue'
import EmptyCart from './EmptyCart.vue'
import CartItem from './CartItem.vue'

import { useCartStore } from '@/stores/useCartStore'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { loadYMap } from '@/utils/loadYMap'

const cartStore = useCartStore()
const { items: cartItems, totalPrice } = storeToRefs(cartStore)
const { removeByIndex, updateQuantityByIndex, updateOptionsByIndex } = cartStore

// форма
const customerName = ref('')
const customerSurname = ref('')
const customerPhone = ref('')
const customerEmail = ref('')
const agree = ref(false)

// карта
const selectedPickupPoint = ref(null)
let mapInstance = null

onMounted(async () => {
  try {
    const ymaps = await loadYMap()
    mapInstance = new ymaps.Map('yandex-map', {
      center: [55.751244, 37.618423],
      zoom: 10,
      controls: ['zoomControl', 'fullscreenControl']
    })
    const test = new ymaps.Placemark([55.751244, 37.618423], { balloonContent: 'Тестовая точка' })
    test.events.add('click', () => (selectedPickupPoint.value = 'Москва, центр (тест)'))
    mapInstance.geoObjects.add(test)
  } catch (e) { console.error('YMap init error', e) }
})

onBeforeUnmount(() => { if (mapInstance) { mapInstance.destroy(); mapInstance = null } })

const opened = ref({ deliveryInfo: true, returns: false, payment: false })

const isMobile = ref(window.innerWidth < 768)
const onResize = () => { isMobile.value = window.innerWidth < 768 }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

const itemKey = (item, idx) => `${item.product?.id || item.id}-${idx}`

function formatPrice(v) { return (Number(v) || 0).toLocaleString('ru-RU') }

function checkout() {
  if (!agree.value) { alert('Подтвердите согласие на обработку персональных данных'); return }
  if (!customerName.value || !customerPhone.value) { alert('Заполните имя и телефон'); return }
  console.log('submit order', {
    customerName: customerName.value, customerSurname: customerSurname.value,
    customerPhone: customerPhone.value, customerEmail: customerEmail.value,
    items: cartItems.value, pvz: selectedPickupPoint.value
  })
  cartStore.checkout()
}
</script>

<style lang="scss" scoped>
@import "./Cart.scss";
</style>

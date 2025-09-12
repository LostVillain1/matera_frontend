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
        <!-- разделительная линия перед блоком «Итого» -->
        <hr class="cart-divider" />
      </section>

      <!-- ПРАВАЯ КОЛОНКА (сайдбар) -->
      <aside class="cart-summary-wrap">
        <div class="summary-card" :class="{ 'summary-card--compact': isMobile }">
          <!-- МОБИЛЬНО: только доставка/итого -->
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

          <!-- ≥768px: аккордеоны + суммы + кнопка + тексты -->
          <template v-else>
            <div class="exp-list" role="list">
              <!-- 1. Информация о доставке -->
              <div class="exp-item" role="listitem">
                <button
                  class="exp-btn"
                  type="button"
                  :aria-expanded="opened.deliveryInfo"
                  @click="opened.deliveryInfo = !opened.deliveryInfo"
                >
                  <span class="exp-title">Информация о доставке</span>
                  <span class="acc-plus" :class="{ open: opened.deliveryInfo }" aria-hidden="true"></span>
                </button>
                <transition name="exp">
                  <div v-show="opened.deliveryInfo" class="exp-panel" role="region" aria-label="Информация о доставке">
                    <p>Доставка осуществляется службой СДЕК.</p>
                  </div>
                </transition>
              </div>

              <!-- 2. Обмен и возврат -->
              <div class="exp-item" role="listitem">
                <button
                  class="exp-btn"
                  type="button"
                  :aria-expanded="opened.returns"
                  @click="opened.returns = !opened.returns"
                >
                  <span class="exp-title">Обмен и возврат</span>
                  <span class="acc-plus" :class="{ open: opened.returns }" aria-hidden="true"></span>
                </button>
                <transition name="exp">
                  <div v-show="opened.returns" class="exp-panel" role="region" aria-label="Обмен и возврат">
                    <p>Условия обмена и возврата уточняйте у оператора.</p>
                  </div>
                </transition>
              </div>

              <!-- 3. Об оплате -->
              <div class="exp-item" role="listitem">
                <button
                  class="exp-btn"
                  type="button"
                  :aria-expanded="opened.payment"
                  @click="opened.payment = !opened.payment"
                >
                  <span class="exp-title">Об оплате</span>
                  <span class="acc-plus" :class="{ open: opened.payment }" aria-hidden="true"></span>
                </button>
                <transition name="exp">
                  <div v-show="opened.payment" class="exp-panel" role="region" aria-label="Об оплате">
                    <p>Оплата банковской картой онлайн.</p>
                  </div>
                </transition>
              </div>
            </div>

            <div class="summary-split"></div>

            <div class="summary-line">
              <span>Доставка</span><span>0 ₽</span>
            </div>
            <div class="summary-total">
              <span>Итого</span><span>{{ formatPrice(totalPrice) }} ₽</span>
            </div>

            <button class="pay-btn" :disabled="!agree" @click="checkout">Оплатить</button>

            <p class="policy">
              Нажимая кнопку, Вы соглашаетесь с
              <a href="/policy" target="_blank" rel="noopener">политикой конфиденциальности</a>
              и ознакомились с
              <a href="/oferta" target="_blank" rel="noopener">офертой</a>
            </p>

            <label class="agree">
              <input type="checkbox" v-model="agree" />
              <span>
                Согласие на обработку
                <a href="/personal-data" target="_blank" rel="noopener">персональных данных</a>
              </span>
            </label>
          </template>
        </div>
      </aside>

      <!-- ПЕРСОНАЛЬНЫЕ ДАННЫЕ -->
      <section class="checkout-form" v-if="cartItems.length">
        <h2 class="form-title">Персональные данные</h2>
        <div class="form-grid">
          <div class="form-field">
            <label>Имя</label>
            <input v-model="customerName" type="text" class="line-input" />
          </div>
          <div class="form-field">
            <label>Фамилия</label>
            <input v-model="customerSurname" type="text" class="line-input" />
          </div>
          <div class="form-field">
            <label>Телефон</label>
            <input v-model="customerPhone" type="tel" class="line-input" />
          </div>
          <div class="form-field">
            <label>Почта</label>
            <input v-model="customerEmail" type="email" class="line-input" />
          </div>
        </div>
      </section>

      <!-- ИНФОРМАЦИЯ О ДОСТАВКЕ -->
      <section class="delivery-section">
        <h2 class="delivery-title">Информация о доставке</h2>

        <div class="delivery-method">
          <span class="label">Способ доставки</span>
          <label class="radio">
            <input type="radio" checked disabled />
            <span>СДЕК</span>
          </label>
        </div>

        <!-- два поля в строку ≥900px -->
        <div class="delivery-row">
          <div class="form-field">
            <label>Город</label>
            <input v-model="deliveryCity" type="text" class="line-input" placeholder=" " />
          </div>

          <div class="form-field">
            <!-- <label>Адрес ПВЗ</label>
            <select v-model="pvzAddress" class="line-select">
              <option disabled value="">Выберите ПВЗ</option>
              <option v-for="o in pvzOptions" :key="o" :value="o">{{ o }}</option>
            </select>
            <span class="select-caret" aria-hidden="true"></span> -->
          </div>
        </div>

        <!-- карта -->
        <div id="yandex-map" class="delivery-map"></div>
        <p v-if="selectedPickupPoint" class="pvz">ПВЗ: {{ selectedPickupPoint }}</p>

        <!-- МОБИЛЬНО: кнопка + тексты + те же аккордеоны под картой -->
        <template v-if="isMobile">
          <button class="pay-btn pay-btn--mobile" :disabled="!agree" @click="checkout">Оплатить</button>

          <p class="policy">
            Нажимая кнопку, Вы соглашаетесь с
            <a href="/policy" target="_blank" rel="noopener">политикой конфиденциальности</a>
            и ознакомились с
            <a href="/oferta" target="_blank" rel="noopener">офертой</a>
          </p>

          <label class="agree">
            <input type="checkbox" v-model="agree" />
            <span>
              Согласие на обработку
              <a href="/personal-data" target="_blank" rel="noopener">персональных данных</a>
            </span>
          </label>

          <div class="exp-list exp-list--mobile" role="list">
            <div class="exp-item" role="listitem">
              <button class="exp-btn" type="button" :aria-expanded="opened.deliveryInfo" @click="opened.deliveryInfo = !opened.deliveryInfo">
                <span class="exp-title">Информация о доставке</span>
                <span class="acc-plus" :class="{ open: opened.deliveryInfo }" aria-hidden="true"></span>
              </button>
              <transition name="exp">
                <div v-show="opened.deliveryInfo" class="exp-panel" role="region" aria-label="Информация о доставке">
                  <p>Доставка осуществляется службой СДЕК.</p>
                </div>
              </transition>
            </div>

            <div class="exp-item" role="listitem">
              <button class="exp-btn" type="button" :aria-expanded="opened.returns" @click="opened.returns = !opened.returns">
                <span class="exp-title">Обмен и возврат</span>
                <span class="acc-plus" :class="{ open: opened.returns }" aria-hidden="true"></span>
              </button>
              <transition name="exp">
                <div v-show="opened.returns" class="exp-panel" role="region" aria-label="Обмен и возврат">
                  <p>Условия обмена и возврата уточняйте у оператора.</p>
                </div>
              </transition>
            </div>

            <div class="exp-item" role="listitem">
              <button class="exp-btn" type="button" :aria-expanded="opened.payment" @click="opened.payment = !opened.payment">
                <span class="exp-title">Об оплате</span>
                <span class="acc-plus" :class="{ open: opened.payment }" aria-hidden="true"></span>
              </button>
              <transition name="exp">
                <div v-show="opened.payment" class="exp-panel" role="region" aria-label="Об оплате">
                  <p>Оплата банковской картой онлайн.</p>
                </div>
              </transition>
            </div>
          </div>
        </template>
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

/* === STORE === */
const cartStore = useCartStore()
const { items: cartItems, totalPrice } = storeToRefs(cartStore)
const { removeByIndex, updateQuantityByIndex, updateOptionsByIndex } = cartStore

/* === ФОРМА === */
const customerName = ref('')
const customerSurname = ref('')
const customerPhone = ref('')
const customerEmail = ref('')
const agree = ref(false)

/* === ДОСТАВКА (UI-заглушки) === */
const deliveryCity = ref('')
const pvzAddress = ref('')
const pvzOptions = [
  'ул. Пушкина, 10 — ПВЗ 123',
  'пр-т Мира, 45 — ПВЗ 207',
  'ул. Лесная, 7 — ПВЗ 331'
]

/* === АККОРДЕОНЫ: локальные флаги (без массивов в JS) === */
const opened = ref({
  deliveryInfo: false,
  returns: false,
  payment: false
})

/* === КАРТА === */
const selectedPickupPoint = ref(null)
let mapInstance = null
onMounted(async () => {
  try {
    const ymaps = await loadYMap()
    mapInstance = new ymaps.Map('yandex-map', {
      center: [54.1961, 37.6184],
      zoom: 12,
      controls: ['zoomControl', 'fullscreenControl']
    })
    const test = new ymaps.Placemark([54.1961, 37.6184], { balloonContent: 'Тестовая точка' })
    test.events.add('click', () => (selectedPickupPoint.value = 'Выбран тестовый ПВЗ'))
    mapInstance.geoObjects.add(test)
  } catch (e) {
    console.error('YMap init error', e)
  }
})
onBeforeUnmount(() => { if (mapInstance) { mapInstance.destroy(); mapInstance = null } })

/* === АДАПТИВ === */
const isMobile = ref(window.innerWidth < 768)
const onResize = () => { isMobile.value = window.innerWidth < 768 }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

/* === УТИЛИТЫ === */
const itemKey = (item, idx) => `${item.product?.id || item.id}-${idx}`
const formatPrice = (v) => (Number(v) || 0).toLocaleString('ru-RU')

/* === ОПЛАТА === */
function checkout() {
  if (!agree.value) {
    alert('Подтвердите согласие на обработку персональных данных')
    return
  }
  if (!customerName.value || !customerPhone.value) {
    alert('Заполните имя и телефон')
    return
  }
  console.log('submit order', {
    customerName: customerName.value,
    customerSurname: customerSurname.value,
    customerPhone: customerPhone.value,
    customerEmail: customerEmail.value,
    items: cartItems.value,
    pvz: selectedPickupPoint.value,
    city: deliveryCity.value,
    pvzAddress: pvzAddress.value
  })
  cartStore.checkout()
}
</script>

<style lang="scss" scoped>
@import "./Cart.scss";
</style>

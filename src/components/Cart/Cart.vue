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
            <!-- КАСТОМНЫЙ АККОРДЕОН (desktop/tablet) -->
            <div class="exp-list" role="list">
              <div v-for="sec in sections" :key="sec.key" class="exp-item" role="listitem">
                <button
                  class="exp-btn"
                  type="button"
                  :aria-expanded="opened[sec.key]"
                  :aria-controls="`exp-panel-${sec.key}`"
                  @click="opened[sec.key] = !opened[sec.key]"
                >
                  <span class="exp-title">{{ sec.title }}</span>
                  <span class="acc-plus" :class="{ open: opened[sec.key] }" aria-hidden="true"></span>
                </button>

                <transition name="exp">
                  <div
                    v-show="opened[sec.key]"
                    class="exp-panel"
                    :id="`exp-panel-${sec.key}`"
                    role="region"
                    :aria-label="sec.title"
                  >
                    <p v-html="sec.html"></p>
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

      <!-- ДОСТАВКА -->
      <section class="delivery-section">
        <h2 class="delivery-title">Информация о доставке</h2>

        <div class="delivery-method">
          <span class="label">Способ доставки</span>
          <label class="radio"><input type="radio" checked disabled /><span>СДЕК</span></label>
        </div>

        <div id="yandex-map" class="delivery-map"></div>
        <p v-if="selectedPickupPoint" class="pvz">ПВЗ: {{ selectedPickupPoint }}</p>

        <!-- Мобилка: кнопка/текст/чекбокс + АККОРДЕОН под картой -->
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

          <!-- КАСТОМНЫЙ АККОРДЕОН (mobile) -->
          <div class="exp-list exp-list--mobile" role="list">
            <div v-for="sec in sections" :key="sec.key" class="exp-item" role="listitem">
              <button
                class="exp-btn"
                type="button"
                :aria-expanded="opened[sec.key]"
                :aria-controls="`exp-panel-m-${sec.key}`"
                @click="opened[sec.key] = !opened[sec.key]"
              >
                <span class="exp-title">{{ sec.title }}</span>
                <span class="acc-plus" :class="{ open: opened[sec.key] }" aria-hidden="true"></span>
              </button>

              <transition name="exp">
                <div
                  v-show="opened[sec.key]"
                  class="exp-panel"
                  :id="`exp-panel-m-${sec.key}`"
                  role="region"
                  :aria-label="sec.title"
                >
                  <p v-html="sec.html"></p>
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

const cartStore = useCartStore()
const { items: cartItems, totalPrice } = storeToRefs(cartStore)
const { removeByIndex, updateQuantityByIndex, updateOptionsByIndex } = cartStore

// форма
const customerName = ref('')
const customerSurname = ref('')
const customerPhone = ref('')
const customerEmail = ref('')
const agree = ref(false)

// контент выпадающих секций
const sections = [
  { key: 'deliveryInfo', title: 'Информация о доставке', html: 'Доставка осуществляется службой СДЕК.' },
  { key: 'returns',      title: 'Обмен и возврат',        html: 'Условия обмена и возврата уточняйте у оператора.' },
  { key: 'payment',      title: 'Об оплате',              html: 'Оплата банковской картой онлайн.' }
]
const opened = ref({
  deliveryInfo: false,
  returns: false,
  payment: false
})

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

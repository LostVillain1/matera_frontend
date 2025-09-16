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

          <!-- ≥768px: аккордеоны (CSS <details>) + суммы + кнопка + тексты -->
          <template v-else>
            <div class="exp-list" role="list">
              <!-- 1. Информация о доставке -->
              <details class="exp" role="listitem">
                <summary class="exp-btn">
                  <span class="exp-title">Информация о доставке</span>
                  <span class="acc-plus" aria-hidden="true"></span>
                </summary>
                <div class="exp-panel" role="region" aria-label="Информация о доставке">
                  <p>Доставка осуществляется службой СДЕК.</p>
                </div>
              </details>

              <!-- 2. Обмен и возврат -->
              <details class="exp" role="listitem">
                <summary class="exp-btn">
                  <span class="exp-title">Обмен и возврат</span>
                  <span class="acc-plus" aria-hidden="true"></span>
                </summary>
                <div class="exp-panel" role="region" aria-label="Обмен и возврат">
                  <p>Условия обмена и возврата уточняйте у оператора.</p>
                </div>
              </details>

              <!-- 3. Об оплате -->
              <details class="exp" role="listitem">
                <summary class="exp-btn">
                  <span class="exp-title">Об оплате</span>
                  <span class="acc-plus" aria-hidden="true"></span>
                </summary>
                <div class="exp-panel" role="region" aria-label="Об оплате">
                  <p>Оплата банковской картой онлайн.</p>
                </div>
              </details>
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
          <!-- Город -->
          <div class="form-field">
            <label>Город</label>

            <div class="city-inline">
              <input
                v-model="delivery.cityInput"
                type="text"
                class="line-input"
                placeholder="Например: Тверь"
                @keyup.enter="findCityThenPvz"
              />
              <button class="btn-find" :disabled="delivery.loadingCity" @click="findCityThenPvz">
                {{ delivery.loadingCity ? '...' : 'Найти' }}
              </button>
            </div>

            <p v-if="delivery.cityName" class="hint ok">Выбран город: {{ delivery.cityName }}</p>
            <p v-if="delivery.errorMsg" class="hint err">{{ delivery.errorMsg }}</p>
          </div>

          <!-- Адрес ПВЗ -->
          <div class="form-field">
            <label>Адрес ПВЗ</label>

            <div v-if="!delivery.hasCity" class="pvz-placeholder">
              Сначала укажите город
            </div>

            <!-- Автооткрывающийся dropdown после поиска города -->
            <template v-else>
              <div v-if="delivery.loadingPvz" class="hint">Загружаем пункты…</div>

              <div v-if="delivery.hasPvz" class="pvz-dropdown" :class="{ open: showPvz }">
                <button type="button" class="pvz-trigger" @click="showPvz = !showPvz">
                  <span>{{ delivery.selectedPvz?.name || 'Выберите ПВЗ' }}</span>
                  <i class="caret" aria-hidden="true"></i>
                </button>
                <ul v-show="showPvz" class="pvz-menu">
                  <li
                    v-for="p in delivery.pvzList"
                    :key="p.code"
                    class="pvz-item"
                    @click="delivery.selectPvz(p.code); showPvz = false"
                  >
                    <div class="pvz-title">{{ p.name }}</div>
                    <div class="pvz-addr">{{ p.address }}</div>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>

        <!-- карта -->
        <div id="yandex-map" class="delivery-map"></div>
        <p v-if="selectedPickupPoint" class="pvz">
          ПВЗ: {{ selectedPickupPoint.name }} — {{ selectedPickupPoint.address }}
        </p>

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
            <details class="exp" role="listitem">
              <summary class="exp-btn">
                <span class="exp-title">Информация о доставке</span>
                <span class="acc-plus" aria-hidden="true"></span>
              </summary>
              <div class="exp-panel" role="region" aria-label="Информация о доставке">
                <p>Доставка осуществляется службой СДЕК.</p>
              </div>
            </details>
            <details class="exp" role="listitem">
              <summary class="exp-btn">
                <span class="exp-title">Обмен и возврат</span>
                <span class="acc-plus" aria-hidden="true"></span>
              </summary>
              <div class="exp-panel" role="region" aria-label="Обмен и возврат">
                <p>Условия обмена и возврата уточняйте у оператора.</p>
              </div>
            </details>
            <details class="exp" role="listitem">
              <summary class="exp-btn">
                <span class="exp-title">Об оплате</span>
                <span class="acc-plus" aria-hidden="true"></span>
              </summary>
              <div class="exp-panel" role="region" aria-label="Об оплате">
                <p>Оплата банковской картой онлайн.</p>
              </div>
            </details>
          </div>
        </template>
      </section>
    </div>
  </main>

  <AppFooter />
</template>

<script setup>
/**
 * ВАЖНО:
 * - Аккордеоны построены на <details>/<summary>, никакой JS для них не нужен.
 * - Выбор города/ПВЗ и карта живут в отдельном Pinia-сторе useDeliveryStore.
 * - После поиска города ПВЗ подгружаются автоматически и раскрывается dropdown.
 * - Кнопка "Оплатить" блокируется, пока не выставлен чекбокс согласия.
 */

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AppFooter from '@/components/AppFooter/AppFooter.vue'
import EmptyCart from './EmptyCart.vue'
import CartItem from './CartItem.vue'
import { useCartStore } from '@/stores/useCartStore'
import { useDeliveryStore } from '@/stores/useDeliveryStore'
import { loadYMap } from '@/utils/loadYMap'

/* === CART STORE === */
const cartStore = useCartStore()
const { items: cartItems, totalPrice } = storeToRefs(cartStore)
const { removeByIndex, updateQuantityByIndex, updateOptionsByIndex } = cartStore

/* === DELIVERY STORE (город/ПВЗ) === */
const delivery = useDeliveryStore()
const selectedPickupPoint = computed(() => delivery.selectedPvz)
const showPvz = ref(false)

/* === ФОРМА === */
const customerName = ref('')
const customerSurname = ref('')
const customerPhone = ref('')
const customerEmail = ref('')
const agree = ref(false)

/* === КАРТА (Яндекс.Карты JS API) === */
let mapInstance = null
let markersCollection = null

onMounted(async () => {
  try {
    const ymaps = await loadYMap()
    mapInstance = new ymaps.Map('yandex-map', {
      center: [55.751244, 37.618423],
      zoom: 10,
      controls: ['zoomControl', 'fullscreenControl']
    })
    markersCollection = new ymaps.GeoObjectCollection()
    mapInstance.geoObjects.add(markersCollection)
  } catch (e) {
    console.error('YMap init error', e)
  }
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.destroy()
    mapInstance = null
  }
})

/* Ставим маркеры при загрузке ПВЗ */
watch(
  () => delivery.pvzList,
  (list) => {
    if (!mapInstance || !markersCollection) return
    markersCollection.removeAll()
    if (!Array.isArray(list) || !list.length) return
    const bounds = []
    list.forEach((p) => {
      const coords = [p.location?.lat, p.location?.lon]
      if (!coords[0] && !coords[1]) return
      const pm = new window.ymaps.Placemark(
        coords,
        { hintContent: p.name, balloonContent: `<strong>${p.name}</strong><br/>${p.address}` },
        { preset: 'islands#violetDotIcon' }
      )
      pm.events.add('click', () => delivery.selectPvz(p.code))
      markersCollection.add(pm)
      bounds.push(coords)
    })
    if (bounds.length) mapInstance.setBounds(bounds, { checkZoomRange: true, zoomMargin: 30 })
  },
  { deep: true }
)

/* Центрируем карту на выбранный ПВЗ */
watch(
  () => delivery.selectedPvz,
  (p) => {
    if (!mapInstance || !p?.location) return
    mapInstance.setCenter([p.location.lat, p.location.lon], 14, { duration: 300 })
  }
)

/* Найти город → загрузить ПВЗ → открыть dropdown */
const findCityThenPvz = async () => {
  showPvz.value = false
  await delivery.findCity()
  if (delivery.hasCity) {
    await delivery.loadPvzList()
    if (delivery.hasPvz) showPvz.value = true
  }
}

/* При правке города закрываем dropdown (и при необходимости сбрасываем выбор в сторе) */
watch(
  () => delivery.cityInput,
  () => { showPvz.value = false }
)

/* === АДАПТИВ === */
const isMobile = ref(window.innerWidth < 768)
const onResize = () => (isMobile.value = window.innerWidth < 768)
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

/* === УТИЛИТЫ === */
const itemKey = (item, idx) => `${item.product?.id || item.id}-${idx}`
const formatPrice = (v) => (Number(v) || 0).toLocaleString('ru-RU')

/* === ОФОРМЛЕНИЕ === */
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
    delivery: {
      cityName: delivery.cityName,
      cityCode: delivery.cityCode,
      pvz: delivery.selectedPvz
    }
  })
  cartStore.checkout()
}
</script>

<style lang="scss" scoped>
@import "./Cart.scss";
</style>

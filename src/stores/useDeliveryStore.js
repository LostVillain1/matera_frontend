// stores/useDeliveryStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API = import.meta.env.VITE_API_BASE || '/api'

// const API = {
//   cities: 'https://matera-couture.ru/api/cdek/cities/',
//   pvz: 'https://matera-couture.ru/api/cdek/pvz/'
// }

export const useDeliveryStore = defineStore('delivery', () => {
  // ---- state
  const cityInput = ref('')          // то, что пользователь набрал
  const cityCode  = ref('')          // код города из бекенда (строкой)
  const cityName  = ref('')          // нормализованное имя города из ответа
  const pvzList   = ref([])          // список ПВЗ {code, name, address, location:{lat,lon}, ...}
  const selectedPvz = ref(null)      // выбранный объект ПВЗ или null
  const loadingCity = ref(false)
  const loadingPvz  = ref(false)
  const errorMsg    = ref('')

  // ---- getters
  const hasCity   = computed(() => !!cityCode.value)
  const hasPvz    = computed(() => pvzList.value.length > 0)
  const readyToShip = computed(() => hasCity.value && !!selectedPvz.value)

  // ---- actions
  async function findCity() {
    errorMsg.value = ''
    selectedPvz.value = null
    pvzList.value = []
    cityCode.value = ''
    cityName.value = ''
    const q = (cityInput.value || '').trim()
    if (!q) { errorMsg.value = 'Введите название города полностью'; return }

    loadingCity.value = true
    try {
      const url = `${API}/cdek/cities/?country=RU&search=${encodeURIComponent(q)}`
      const res = await fetch(url, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const first = data?.cities?.[0]
      if (!first?.code) {
        errorMsg.value = 'Город не найден. Проверьте написание.'
        return
      }
      cityCode.value = String(first.code)
      cityName.value = first.name
    } catch (e) {
      console.error(e)
      errorMsg.value = 'Не удалось получить код города'
    } finally {
      loadingCity.value = false
    }
  }

  async function loadPvzList(pvzType = 'PVZ') {
    errorMsg.value = ''
    pvzList.value = []
    selectedPvz.value = null
    if (!cityCode.value) { errorMsg.value = 'Сначала укажите город'; return }

    loadingPvz.value = true
    try {
      const url = `${API}/cdek/pvz/?city_code=${encodeURIComponent(cityCode.value)}&pvz_type=${encodeURIComponent(pvzType)}`
      const res = await fetch(url, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      pvzList.value = data?.pvz_list || []
      if (!pvzList.value.length) errorMsg.value = 'ПВЗ не найдены для этого города'
    } catch (e) {
      console.error(e)
      errorMsg.value = 'Не удалось загрузить ПВЗ'
    } finally {
      loadingPvz.value = false
    }
  }

  function selectPvz(code) {
    selectedPvz.value = pvzList.value.find(p => p.code === code) || null
  }

  function resetDelivery() {
    cityInput.value = ''
    cityCode.value = ''
    cityName.value = ''
    pvzList.value = []
    selectedPvz.value = null
    errorMsg.value = ''
    loadingCity.value = false
    loadingPvz.value = false
  }

  return {
    // state
    cityInput, cityCode, cityName, pvzList, selectedPvz, loadingCity, loadingPvz, errorMsg,
    // getters
    hasCity, hasPvz, readyToShip,
    // actions
    findCity, loadPvzList, selectPvz, resetDelivery
  }
})

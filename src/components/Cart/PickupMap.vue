<template>
  <div class="pickup-map">
    <div id="pickup-map" class="pickup-map__container"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import loadYmap from "@/utils/loadYMap.js"

const model = defineModel() // выбранный ПВЗ

onMounted(async () => {
  await loadYmap() // ждём загрузку API
  const map = new ymaps.Map("pickup-map", {
    center: [55.76, 37.64], // Москва
    zoom: 10
  })

  // Пример ПВЗ (имитация API)
  const pickupPoints = [
    { id: "PVZ1", coords: [55.76, 37.64], name: "ПВЗ №1" },
    { id: "PVZ2", coords: [55.70, 37.60], name: "ПВЗ №2" },
    { id: "PVZ3", coords: [55.80, 37.66], name: "ПВЗ №3" }
  ]

  pickupPoints.forEach(point => {
    const placemark = new ymaps.Placemark(point.coords, { balloonContent: point.name })
    placemark.events.add("click", () => {
      model.value = point // записываем выбранный ПВЗ
    })
    map.geoObjects.add(placemark)
  })
})
</script>

<style scoped>
.pickup-map__container {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  margin-top: 1rem;
}
</style>
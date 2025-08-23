<template>
  <div class="city-select">
    <label class="city-select__label">Город</label>
    <select v-model="selectedCity" class="city-select__control" @change="emitCity">
      <option disabled value="">Выберите город</option>
      <option v-for="city in cities" :key="city.code" :value="city">
        {{ city.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

// v-model для выбранного города
const selectedCity = defineModel()

// Имитация API загрузки городов
const cities = ref([])

// Загружаем список при монтировании
onMounted(() => {
  cities.value = [
    { code: "MSK", name: "Москва" },
    { code: "SPB", name: "Санкт-Петербург" },
    { code: "EKB", name: "Екатеринбург" }
  ]
})

// Пробрасываем событие выбора в родительский компонент
const emit = defineEmits(["update:modelValue"])
const emitCity = () => {
  emit("update:modelValue", selectedCity.value)
}
</script>

<style scoped>
.city-select {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
.city-select__label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
}
.city-select__control {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
}
</style>
<template>
  <div class="base-field">
    <!-- Заголовок поля -->
    <!-- <label v-if="label" class="base-field__label">{{ label }}</label> -->
    <input
      :type="type"
      class="base-field__input"
      :placeholder="placeholder"
      v-model="model"
    />
  </div>
</template>

<script setup>
// Принимаем props
defineProps({
//   label: String,        // Текст над полем
  type: { type: String, default: "text" }, // Тип инпута
  placeholder: String   // Плейсхолдер
})

// Двусторонняя привязка через v-model
const model = defineModel()
</script>

<style scoped>
.base-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
.base-field__label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
}
.base-field__input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}
.base-field__input:focus {
  outline: none;
  border-color: #000;
}
</style>
<template>
  <div class="base-dropdown">
    <!-- Заголовок дропдауна -->
    <label v-if="label" class="dropdown-label">{{ label }}</label>

    <!-- Сам селект -->
    <select
      class="dropdown-select"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <!-- Если нужно placeholder -->
      <option v-if="placeholder" disabled value="">{{ placeholder }}</option>

      <!-- Опции -->
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
/**
 * Универсальный выпадающий список (BaseDropdown)
 *
 * Пропсы:
 * - modelValue (String | Number): текущее выбранное значение
 * - options (Array<{ label: string, value: string | number }>): список опций
 * - label (String): заголовок над селектом
 * - placeholder (String): значение по умолчанию (например: "Выберите размер")
 *
 * События:
 * - update:modelValue → возвращает выбранное значение
 */

defineProps({
  modelValue: {
    type: [String, Number],
    default: ""
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: ""
  }
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.base-dropdown {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dropdown-label {
  font-size: 14px;
  color: #333;
}

.dropdown-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  transition: border 0.2s;
}

.dropdown-select:focus {
  outline: none;
  border-color: #333;
}
</style>
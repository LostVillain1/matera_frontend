<template>
  <div class="dropdown" @click="toggleDropdown">
    <!-- Текущее выбранное значение -->
    <div class="selected">{{ selectedLabel }}</div>

    <!-- Список опций -->
    <ul v-if="open" class="options">
      <li
        v-for="option in options"
        :key="option.value"
        :class="{ active: option.value === modelValue }"
        @click.stop="selectOption(option.value)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  options: { type: Array, required: true },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)

const selectedLabel = computed(() => {
  const found = props.options.find(opt => opt.value === props.modelValue)
  return found ? found.label : 'Выберите...'
})

function toggleDropdown() {
  open.value = !open.value
}

function selectOption(value) {
  emit('update:modelValue', value)
  open.value = false
}
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block; /* 🔥 теперь ширина по контенту */
  border: 1px solid #39213D;
  border-radius: 6px;
  padding: 6px 10px;
  background: #F3F1E2;
  cursor: pointer;
}

.selected {
  font-size: 14px;
  color: #39213D;
  white-space: nowrap; /* 🔥 предотвращаем перенос текста */
}

.options {
  position: absolute;
  left: 0;
  top: 110%;
  min-width: 100%; /* 🔥 список не уже, чем dropdown */
  background: #F3F1E2;
  border: 1px solid #39213D;
  border-radius: 6px;
  z-index: 10;
  list-style: none;
  padding: 4px 0;
}

.options li {
  padding: 6px 10px;
  cursor: pointer;
  white-space: nowrap; /* 🔥 тоже не переносим строки */
}

.options li.active,
.options li:hover {
  background: #d7d4c5;
}
</style>

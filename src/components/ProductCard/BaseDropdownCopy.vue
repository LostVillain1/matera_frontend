<template>
  <div class="dropdown">
    <!-- Заголовок дропдауна: выбранное значение -->
    <button class="dropdown-toggle" @click="toggleDropdown">
      {{ selectedOption }}
    </button>

    <!-- Список опций -->
    <ul v-if="isOpen" class="dropdown-menu">
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="selectOption(option)"
        class="dropdown-item"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup>
// Импортируем reactivity API
import { ref, computed } from "vue"

/*
  options: массив строк, например ["XS","S","M","L"]
  modelValue: текущее выбранное значение (реализуем v-model)
*/
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
})

// ====== Emits ======
/*
  update:modelValue — стандарт для работы с v-model
*/
const emit = defineEmits(["update:modelValue"])


const isOpen = ref(false) // Открыт ли дропдаун

// Выбранная опция = либо совпадающая строка, либо первый элемент
const selectedOption = computed(() => {
  return props.modelValue || props.options[0] || ""
})


function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectOption(option) {
  emit("update:modelValue", option) // обновляем v-model
  isOpen.value = false // закрываем список после выбора
}
</script>

<style scoped>
.dropdown {
  position: relative;
  width: 100%; /* мобильная ширина — на всю */
  max-width: 220px;
  font-size: 16px;
  font-weight: 500;
  color: #39213d;
}


.dropdown-toggle {
  width: 100%;
  padding: 12px;
  background-color: #f3f1e2;
  color: #39213d;
  border: 2px solid #39213d;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 6px;
  padding: 0;
  list-style: none;
  background-color: #f3f1e2;
  border: 2px solid #39213d;
  border-radius: 8px;
  max-height: 220px;
  overflow-y: auto;
  z-index: 10;
}

/* Опции */
.dropdown-item {
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  color: #39213d;
}
.dropdown-item:hover {
  background-color: #39213d;
  color: #f3f1e2;
}

/* === TABLET (>= 640px) === */
@media (min-width: 640px) {
  .dropdown {
    max-width: 260px;
    font-size: 18px;
  }
  .dropdown-toggle {
    font-size: 18px;
    padding: 14px 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* лёгкая тень */
  }
  .dropdown-menu {
    max-height: 250px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* тень для списка */
  }
  .dropdown-item {
    padding: 14px 16px;
    font-size: 18px;
  }
}

/* === DESKTOP (>= 1024px) === */
@media (min-width: 1024px) {
  .dropdown {
    max-width: 300px;
    font-size: 20px;
  }
  .dropdown-toggle {
    padding: 16px 18px;
    border-radius: 10px;
  }
  .dropdown-menu {
    max-height: 280px;
    border-radius: 10px;
  }
  .dropdown-item {
    padding: 16px 18px;
    font-size: 20px;
  }
}
</style>
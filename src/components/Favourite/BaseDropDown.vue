<template>
  <!--
    Обёртка дропдауна. Не растягиваемся на всю ширину — inline-block.
    Клики по обёртке открывают/закрывают список.
  -->
  <div
    class="dd"
    :class="{ open }"
    @click="toggleDropdown"
    ref="rootEl"
  >
    <!-- Текущее значение + иконка стрелки -->
    <div class="dd__selected">
      <span class="dd__label">{{ selectedLabel }}</span>

      <!-- SVG-стрелка; поворачивается при open -->
      <svg class="dd__chevron" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Порталить не обязательно: список позиционируем абсолютно -->
    <ul
      v-if="open"
      class="dd__options"
      role="listbox"
      :aria-activedescendant="activeId"
      @keydown.stop
    >
      <li
        v-for="(option, i) in options"
        :key="option.value"
        class="dd__option"
        :id="`opt-${uid}-${i}`"
        :class="{ 'is-active': option.value === modelValue }"
        role="option"
        :aria-selected="option.value === modelValue"
        @click.stop="selectOption(option.value)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
/**
 * Кастомный dropdown под макет:
 * - компактный прямоугольник, фон #F3F1E2, бордер #39213D
 * - текст и иконка #39213D
 * - ширина по контенту (inline-block), а не на весь контейнер
 * - закрытие по клику вне, по выбору пункта; управление флагом open внутри
 * - v-model для значения
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  options: { type: Array, required: true }, // [{label, value}]
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Выберите…' }
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const rootEl = ref(null)
const uid = Math.random().toString(36).slice(2, 8)

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : props.placeholder
})
const activeId = computed(() => {
  const idx = props.options.findIndex(o => o.value === props.modelValue)
  return idx >= 0 ? `opt-${uid}-${idx}` : undefined
})

function toggleDropdown() {
  open.value = !open.value
}

function selectOption(value) {
  emit('update:modelValue', value)
  open.value = false
}

/** Закрытие по клику вне компонента */
function onDocumentClick(e) {
  if (!rootEl.value) return
  if (!rootEl.value.contains(e.target)) open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick, { passive: true })
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
/* ====== MOBILE FIRST ====== */
.dd{
  position: relative;
  display: inline-block;                 /* ширина по контенту */
  background: #F3F1E2;
  border: 1px solid #39213D;
  /* border-radius: 0px; */
  padding: 10px 12px;                    /* увеличенный внутренний отступ */
  min-width: 84px;                       /* чтобы "XS" не ужимался */
  cursor: pointer;
  user-select: none;
}

.dd__selected{
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.dd__label{
  font-size: 16px;                       /* крупнее текста — как на макете */
  line-height: 1;
  color: #39213D;
  white-space: nowrap;
}

.dd__chevron{
  width: 18px; height: 18px;
  flex: 0 0 18px;
  color: #39213D;
  transition: transform .18s ease;
}
.open .dd__chevron{ transform: rotate(180deg); }

.dd__options{
  position: absolute;
  left: -1px;                            /* чтобы совпадали бордеры */
  top: calc(100% + 6px);
  background: #F3F1E2;
  border: 1px solid #39213D;
  border-radius: 4px;
  padding: 4px 0;
  list-style: none;
  z-index: 20;
  min-width: calc(100% + 2px);           /* не уже, чем «кнопка» */
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}

.dd__option{
  padding: 8px 12px;
  font-size: 16px;
  color: #39213D;
  white-space: nowrap;
  transition: background-color .12s ease;
}
.dd__option:hover{ background: #e6e3d6; }
.dd__option.is-active{
  background: #d7d4c5;                   /* активная/выбранная опция */
}

/* ====== DESKTOP TWEAKS ====== */
@media (min-width: 992px){
  .dd{ padding: 10px 14px; }
  .dd__label, .dd__option{ font-size: 17px; }
  .dd__chevron{ width: 20px; height: 20px; }
}
</style>

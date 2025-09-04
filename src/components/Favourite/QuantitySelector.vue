<template>
  <!-- корневой элемент принимает классы родителя (например, class="qty") -->
  <div class="qty-root">
    <button
      type="button"
      class="btn minus"
      aria-label="Уменьшить количество"
      @click="dec"
    >−</button>

    <span class="value" aria-live="polite">{{ modelValue }}</span>

    <button
      type="button"
      class="btn plus"
      aria-label="Увеличить количество"
      @click="inc"
    >+</button>
  </div>
</template>

<script setup>
/**
 * Компонент- счётчик.
 * v-model используется как обычно: v-model="quantity"
 * Классы, переданные на компонент (например, class="qty"), «провалятся» на корень.
 */
const props = defineProps({
  modelValue: { type: Number, default: 1 },
  min: { type: Number, default: 1 },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 }
})
const emit = defineEmits(['update:modelValue'])

function dec() {
  const next = Math.max(props.min, (props.modelValue || 1) - props.step)
  emit('update:modelValue', next)
}
function inc() {
  const next = Math.min(props.max, (props.modelValue || 1) + props.step)
  emit('update:modelValue', next)
}
</script>

<style scoped>
/* общий контейнер с рамкой вокруг минуса, значения и плюса */
.qty-root{
  display:inline-flex;
  align-items:center;          /* ← вертикальный центр для всех трёх */
  gap:8px;
  height:36px;                 /* базу переопределим на странице */
  padding:0 10px;
  border:1px solid #39213D;
  border-radius:6px;
  background:#F3F1E2;
  box-sizing:border-box;
}

.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:18px;
  height:100%;
  border:0;
  background:transparent;
  color:#39213D;
  font-size:16px;              /* было 18 — из-за метрик казалось выше */
  line-height:1;               /* без «сползания» вверх */
  cursor:pointer;
}

.value{
  display:inline-flex;         /* ← центрируем само число */
  align-items:center;
  justify-content:center;
  height:100%;
  min-width:24px;
  padding:0 2px;
  text-align:center;
  font-weight:600;
  font-size:16px;
  line-height:1;
  color:#39213D;
}
</style>

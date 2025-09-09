<template>
  <div class="qty" role="group" aria-label="Выбор количества" tabindex="0">
    <button
      type="button"
      class="qty__btn"
      :disabled="modelValue <= min"
      @click="dec"
      aria-label="Уменьшить количество"
    >−</button>

    <output class="qty__value" aria-live="polite" aria-atomic="true">
      {{ modelValue }}
    </output>

    <button
      type="button"
      class="qty__btn"
      :disabled="max !== null && modelValue >= max"
      @click="inc"
      aria-label="Увеличить количество"
    >+</button>
  </div>
</template>

<script setup>
/**
 * QuantitySelector
 * ✦ ПРАВКА: кастомный контрол количества под макет.
 * - v-model (number), min/max, управление стрелками.
 */
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: null }
})
const emit = defineEmits(['update:modelValue', 'change'])

function clamp(n) {
  const lo = props.min ?? 1
  const hi = props.max ?? Infinity
  return Math.min(Math.max(n, lo), hi)
}
function inc() {
  const v = clamp(props.modelValue + 1)
  emit('update:modelValue', v); emit('change', v)
}
function dec() {
  const v = clamp(props.modelValue - 1)
  emit('update:modelValue', v); emit('change', v)
}
</script>

<style scoped>
/* Mobile-first */
.qty{
  display:flex; align-items:center; justify-content:center; gap:12px;
  width:140px; height:44px;
  border:1px solid #bfb7a9; border-radius:8px;
  background:#ffffff;
}
.qty__btn{
  width:40px; height:36px; border:none; background:transparent;
  font-size:22px; line-height:1; cursor:pointer; color:#39213D;
}
.qty__btn:disabled{ opacity:.4; cursor:not-allowed }
.qty__value{ min-width:28px; text-align:center; font-size:18px; color:#39213D }

/* ≥1024px — как в десктоп-макете */
@media (min-width:1024px){
  .qty{ width:168px; height:48px; }
  .qty__btn{ width:48px; height:40px; font-size:24px; }
  .qty__value{ font-size:20px; min-width:32px; }
}
</style>

<template>
  <div class="quantity">
    <button @click="decrease">−</button>
    <span>{{ modelValue }}</span>
    <button @click="increase">+</button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 1 }
})
const emit = defineEmits(['update:modelValue'])

function increase() {
  emit('update:modelValue', props.modelValue + 1)
}
function decrease() {
  if (props.modelValue > 1) {
    emit('update:modelValue', props.modelValue - 1)
  }
}
</script>

<style scoped>
.quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

button {
  width: 28px;
  height: 28px;
  border: 1px solid #39213D;
  background: #F3F1E2;
  cursor: pointer;
  border-radius: 4px;
  font-size: 18px;
}
</style>

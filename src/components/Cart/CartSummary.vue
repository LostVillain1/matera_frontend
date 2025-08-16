<template>
  <aside class="summary">
    <div class="row">
      <span>Товаров</span>
      <strong>{{ totalItems }}</strong>
    </div>

    <div class="row">
      <span>Сумма</span>
      <strong>{{ formatPrice(totalPrice) }}</strong>
    </div>

    <button class="btn primary" @click="$emit('checkout')">Оформить заказ</button>
    <button class="btn secondary" @click="$emit('clear')">Очистить корзину</button>
  </aside>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/useCartStore'

const cartStore = useCartStore()
const { totalItems, totalPrice } = storeToRefs(cartStore)

function formatPrice(v) { return (Number(v) || 0).toLocaleString('ru-RU') + ' ₽' }
</script>

<style scoped>
.summary {
    background:#fff;
    padding:16px; 
    border-radius:8px; 
    border:1px solid #eee; 
    display:flex; 
    flex-direction:column; 
    gap:12px;
}
.row { 
    display:flex; 
    justify-content:space-between; 
}
.btn { 
    padding:12px; 
    border-radius:8px; 
    border:none; 
    cursor:pointer; 
    font-weight:600; 
}
.btn.primary { 
    background:#3d1f28; 
    color:#fff; 
}
.btn.secondary { 
    background:#eee; 
    color:#222; 
}
@media (min-width:1024px) { 
    .summary { 
        position: sticky; 
        top:20px 
    } 
}
</style>

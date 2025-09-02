<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-window" role="dialog" aria-modal="true" aria-label="Добавлен товар в корзину">
      <!-- <button class="modal-close" @click="close" aria-label="Закрыть">✕</button> -->

      <div class="modal-content">
        <h3 class="modal-title">Товар добавлен в корзину</h3>

        <div class="modal-product" v-if="product">
          <!-- <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.name" class="modal-product-image" /> -->
          <div class="modal-product-info">
            <p class="modal-product-name">{{ product.name }}</p>
            <p class="modal-product-price" v-if="product.price">{{ formatPrice(product.price) }} ₽</p>
          </div>
        </div>

        <!-- <p class="modal-text">Вы можете продолжить покупки или перейти в корзину.</p> -->

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="close">Продолжить покупки</button>
          <button class="btn btn-primary" @click="confirm">Перейти в корзину</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  product: { type: Object, required: false }
})

const emit = defineEmits(['close', 'confirm'])

function close() {
  emit('close')
}

function confirm() {
  emit('confirm')
}

function handleEsc(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleEsc)
})

function formatPrice(price) {
  return Number(price ?? 0).toLocaleString('ru-RU')
}
</script>

<style scoped>
/* === MOBILE-FIRST (все экраны до десктопа) === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center; /* теперь центрирование по вертикали */
  justify-content: center;
  z-index: 1000;
  padding: 12px;
}

.modal-window {
  font-family: 'PT Serif', serif;
  width: 100%;
  max-width: 360px;
  background: #fff;
  color: #FFFCDC;
  border-radius: 2px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  animation: fadeIn 0.25s ease-out;
  background-image: url('@/assets/bg_velur.png');
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-close {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.modal-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
}

.modal-product {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  margin-bottom: 20px;
}

.modal-product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.modal-product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
}

.modal-product-name {
  /* font-size: 16px; */
  font-weight: 500;
}

.modal-product-price {
  /* font-size: 16px; */
  color: #FFFCDC;
}

.modal-text {
  font-size: 13px;
  text-align: center;
  margin-bottom: 14px;
  color: #444;
}

.modal-actions {
  display: flex;
  gap: 8px;
  flex-direction: column; /* кнопки друг под другом */
}

.btn {
  width: 100%;
  padding: 10px 0;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #FFFCDC;
  color: #39213D;
  font-size: 16px;
}

.btn-secondary {
  background-color: transparent;
  color: #FFFCDC;
  font-size: 16px;
}

/* === DESKTOP >=1024px === */
@media screen and (min-width: 1024px) {
  .modal-window {
    max-width: 450px;
    padding: 24px;
    border-radius: 2px;
  }

  .modal-title {
    font-size: 28px;
  }

  .modal-product-image {
    width: 64px;
    height: 64px;
  }

  .modal-product-name {
    font-size: 22px;
  }

  .modal-product-price {
    font-size: 22px;
  }

  .modal-text {
    font-size: 14px;
  }

  .modal-actions {
    flex-direction: row; /* кнопки рядом на десктопе */
  }
}
</style>

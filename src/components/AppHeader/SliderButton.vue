<template>
  <button class="slider-button" @click="goToCatalog">
    <span class="button-text">Перейти в каталог</span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToCatalog() {
  console.log('Переход в каталог')
  router.push('/catalog')
}  
</script>
<style scoped>
.slider-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  font-size: 1.1rem;
  background-color: transparent;
  color: white;
  border: 2px solid white;
  /* border-radius: 30px; */
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.slider-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.button-icon {
  font-size: 1.3rem;
}

@media (max-width: 768px) {
  .slider-button {
    padding: 12px 24px;
    font-size: 1rem;
  }
  
  .button-icon {
    font-size: 1.1rem;
  }
}
</style>
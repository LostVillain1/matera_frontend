<template>
  <div class="favorite-item">
    <div class="image-wrapper" @click="toggleDetails">
      <img :src="product.image" :alt="product.name" />
    </div>

    <div class="details">
      <p class="code">Арт: {{ product.code }}</p>
      <p class="name">{{ product.name }}</p>
      <p class="price">{{ product.price.toLocaleString() }} ₽</p>

      <div class="colors" v-if="!isMobile || showDetails">
        <span
          v-for="color in product.colors"
          :key="color.name"
          class="color"
          :style="{ backgroundColor: color.hex }"
          :class="{ active: selectedColor === color.name }"
          @click="selectColor(color.name)"
        />
      </div>

      <div class="actions" v-if="!isMobile || showDetails">
        <select v-model="selectedSize">
          <option v-for="size in product.sizes" :key="size" :value="size">{{ size }}</option>
        </select>

        <div class="quantity-control">
          <button @click="decrease">-</button>
          <span>{{ quantity }}</span>
          <button @click="increase">+</button>
        </div>
      </div>

      <div class="icons">
        <button @click="$emit('add-to-cart', product)">
          🛒
        </button>
        <button @click="$emit('remove', product.id)">
          🗑️
        </button>
      </div>
    </div>

    <button v-if="isMobile" class="toggle" @click="toggleDetails">→</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

defineProps({
  product: Object
})

defineEmits(['remove', 'add-to-cart'])

const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const showDetails = ref(false)

const isMobile = computed(() => window.innerWidth < 768)

onMounted(() => {
  selectedColor.value = product.colors[0]?.name || ''
  selectedSize.value = product.sizes[0] || ''
})

function selectColor(colorName) {
  selectedColor.value = colorName
}

function increase() {
  quantity.value++
}

function decrease() {
  if (quantity.value > 1) quantity.value--
}

function toggleDetails() {
  showDetails.value = !showDetails.value
}
</script>

<style scoped>
@import './FavouriteItem.scss'
</style>

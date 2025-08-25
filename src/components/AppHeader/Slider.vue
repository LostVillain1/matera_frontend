<template>
  <div class="slider">
    <picture>
      <source 
        :srcset="currentSlide.desktop" 
        media="(min-width: 1024px)" />
      <source 
        :srcset="currentSlide.tablet" 
        media="(min-width: 768px)" />
      <img 
        :src="currentSlide.mobile" 
        :alt="currentSlide.alt"
        loading="lazy" />
    </picture>

    <div class="btn-container">
      <SliderButton />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SliderButton from './SliderButton.vue'



const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
  interval: {
      type: Number,
      default: 5000
  }
})

 
 
const currentIndex = ref(0)
let slideInterval = null

// Вычисляемое свойство для текущего слайда
const currentSlide = computed(() => props.slides[currentIndex.value])

// Функция перехода к следующему слайду
const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % props.slides.length
}

// Запуск автоматической смены слайдов
const startSlideShow = () => {
    slideInterval = setInterval(nextSlide, props.interval)
}

// Остановка слайд-шоу
const stopSlideShow = () => {
    clearInterval(slideInterval)
}

// Инициализация при монтировании компонента
onMounted(() => {
    startSlideShow()
})

// Очистка при демонтировании компонента
onUnmounted(() => {
    stopSlideShow()
})

    

</script>

<style scoped>
.slider {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

picture {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10%; /* Отступ от нижнего края */
}

@media (max-width: 768px) {
  .slider {
    height: 90vh;
  }
}
</style>
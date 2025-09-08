<!-- src/views/MainPage.vue -->
<template>
  <!-- Видео-оверлей (покажем один раз за сессию) -->
  <IntroVideo v-if="showIntro" @finished="hideIntro" />

  <div class="mp__wrapper">
    <AppHeader />
    <Slider :slides="slides" :interval="6000" />
  </div>

  <AppFooter />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AppFooter from '@/components/AppFooter/AppFooter.vue'
import Slider from '@/components/AppHeader/Slider.vue'
import IntroVideo from '@/components/IntroVideo.vue' 

// Если хочешь “один раз за сессию” — используем sessionStorage
const INTRO_FLAG = 'introPlayed'
const showIntro = ref(false)

onMounted(() => {
  const played = sessionStorage.getItem(INTRO_FLAG)
  showIntro.value = !played
})

function hideIntro() {
  showIntro.value = false
  sessionStorage.setItem(INTRO_FLAG, '1')
}

const slides = ref([
  {
    desktop: '/images/first_desc.png',
    tablet: '/images/first_tb.png',
    mobile: '/images/first_mob.png',
    alt: 'Первое изображение'
  },
  // {
  //   desktop: '/images/second_desc.png',
  //   tablet: '/images/second_tb.png',
  //   mobile: '/images/second_mob.png',
  //   alt: 'Второе изображение'
  // },
  // {
  //   desktop: '/images/third_desc.png',
  //   tablet: '/images/third_desc.png',
  //   mobile: '/images/third_desc.png',
  //   alt: 'Третье изображение'
  // },
])
</script>

<style lang="scss" scoped>
@import '@/views/MainPage.scss';
</style>

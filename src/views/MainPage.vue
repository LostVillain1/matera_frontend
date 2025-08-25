<template>
    <div class="mp__wrapper">
        <app-header></app-header>
        <Slider :slides="slides" :interval="3000" />
    </div>
    <AppFooter></AppFooter>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader/AppHeader.vue';
import AppFooter from '@/components/AppFooter/AppFooter.vue';
import { useBreakpoints } from '@/composables/useBreakpoints';
import MainPageMobile from '@/components/icons/MainPageMobile.vue';
import MainPageTablet from '@/components/icons/MainPageTablet.vue';
import Slider from '@/components/AppHeader/Slider.vue';

//Работа с брейкпонйтами из композаблы
const breakpoints = useBreakpoints();
const isMobile = breakpoints.isMobile
const isTablet = breakpoints.isTablet
const isLaptop = breakpoints.isLaptop
const isDesktop = breakpoints.isDesktop

const slides = ref(
    [
        {
          desktop: '/images/first_desc.png',
          tablet: '/images/first_tb.png',
          mobile: '/images/first_mob.png',
          alt: 'Первое изображение'
        },
        {
          desktop: '/images/second_desc.png',
          tablet: '/images/second_tb.png',
          mobile: '/images/second_mob.png',
          alt: 'Второе изображение'
        },
        {
          desktop: '/images/third_desc.png',
          tablet: '/images/third_desc.png',
          mobile: '/images/third_desc.png',
          alt: 'Третье изображение'
        },
    ]
)

</script>

<style lang="scss" scoped>
@import '@/views/MainPage.scss'
</style>
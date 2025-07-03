<template>
    <div class="mp__wrapper">
        <app-header></app-header>
        <div class="bg__wrapper">
            <img src="@/assets/mat_bg_mob.png" alt="" v-if="isMobile">
            <img src="@/assets/mat_bg_tablet.png" alt="" v-if="isTablet">
            <div class="logo-text__wrapper">              
                <main-page-mobile v-if="isMobile"></main-page-mobile>
                <main-page-tablet v-if="isTablet"></main-page-tablet>
            </div>
        </div>
    </div>
    
</template>

<script setup>
import AppHeader from '../AppHeader/AppHeader.vue';
import { useBreakpoints } from '@/composables/useBreakpoints';
import MainPageMobile from '../icons/MainPageMobile.vue';
import MainPageTablet from '../icons/MainPageTablet.vue';

//Работа с брейкпонйтами из композаблы
const breakpoints = useBreakpoints();
const isMobile = breakpoints.isMobile
const isTablet = breakpoints.isTablet
const isLaptop = breakpoints.isLaptop
const isDesktop = breakpoints.isDesktop

</script>

<style lang="scss" scoped>
@import './MainPage.scss'
</style>
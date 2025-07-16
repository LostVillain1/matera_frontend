<template>
    <div class="header__wrapper">
        <div class="burger__menu" v-if="isMobile || isTablet">
            <BurgerMenuIcon @click="toggleMenu" class="burger-icon" :class="{ 'open': isMenuOpen }"></BurgerMenuIcon>
            <transition name="fade">
                <div v-if="isMenuOpen" class="bg-menu_options">
                    <div>Каталог</div>
                    <div>Корзина</div>
                    <div>Избранное</div>
                    <div>О Бренде</div>
                    <div>Бутики</div> 
                    <!-- <a href="#" @click="closeMenu">Каталог</a>
                    <a href="#" @click="closeMenu">Корзина</a>
                    <a href="#" @click="closeMenu">Избранное</a>
                    <a href="#" @click="closeMenu">Бутики</a>
                    <a href="#" @click="closeMenu">О бренде</a> -->
                </div>
            </transition>
        </div>
        <div class="header__options left" v-if="!isMobile && !isTablet">
            <div>Каталог</div>
            <div>Бутики</div>
            <div>О бренде</div>
        </div>
        <div class="mat__logo center">
           <LogoHeader></LogoHeader>
        </div>
        <div class="right-side_wrapper right">            
            <div class="favourites" v-if="!isMobile && !isTablet">
                <FavouritesHeader></FavouritesHeader>
            </div>
            <div class="cart" v-if="!isMobile && !isTablet">
                <CartHeader></CartHeader>
            </div>
            <div class="langs__logo">
                <LangsIcon></LangsIcon>
            </div>
        </div>        
    </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import BurgerMenuIcon from '../icons/BurgerMenuIcon.vue';
import LangsIcon from '../icons/LangsIcon.vue';
import LogoHeader from '../icons/LogoHeader.vue';
import FavouritesHeader from '../icons/FavouritesHeader.vue';
import CartHeader from '../icons/CartHeader.vue';
import { useBreakpoints } from '@/composables/useBreakpoints';

//Работа с брейкпонйтами из композаблы
const breakpoints = useBreakpoints();
const isMobile = breakpoints.isMobile
const isTablet = breakpoints.isTablet
const isLaptop = breakpoints.isLaptop
const isDesktop = breakpoints.isDesktop


//Работа с отображением опций бургер меню
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false; // Закрываем меню при клике на одну из опций
};


//Управление размерами SVG -- Попробовать с CSS
const dynamicSvgWidth = computed(() => isLaptop.value ? 200 : 100);
const dynamicSvgHeight = computed(() => isLaptop.value ? 150 : 75);


</script>

<style lang="scss" scoped>
@import "./AppHeader.scss";  
</style>
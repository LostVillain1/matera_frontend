<template>
    <div class="header__wrapper">
        <div class="burger__menu" v-if="isMobile || isTablet">
            <BurgerMenuIcon @click="toggleMenu" class="burger-icon" :class="{ 'open': isMenuOpen }"></BurgerMenuIcon>
            <transition name="menu">
                <div v-if="isMenuOpen" class="bg-menu_options">
                    <router-link to="/catalog">Каталог</router-link>
                    <router-link to="/about">О бренде</router-link>
                    <router-link to="/boutique">Бутики</router-link>
                    <router-link to="/cart">Корзина</router-link>
                    <router-link to="/favourites">Избранное</router-link>                  
                </div>
            </transition>
        </div>
        <div class="header__options left" v-if="!isMobile && !isTablet">
            <router-link to="/catalog">Каталог</router-link>
            <router-link to="/about">О бренде</router-link>
            <router-link to="/boutique">Бутики</router-link>
            <!-- <div>Каталог</div>
            <div>О бренде</div>
            <div>Бутики</div> -->
        </div>
        <div class="mat__logo center">
            <router-link to="/">
                <!-- <LogoHeader></LogoHeader> -->
                 <MateraMob></MateraMob>
            </router-link>           
        </div>
        <div class="right-side_wrapper right">            
            <div class="favourites" v-if="!isMobile && !isTablet">
                <router-link to="/favourites">
                    <FavouritesHeader></FavouritesHeader>
                </router-link>                
            </div>
            <div class="cart" v-if="!isMobile && !isTablet">
                <router-link :to="{ name: 'cart' }">
                    <CartHeader></CartHeader>
                </router-link>                
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
import MateraMob from '../icons/MateraMob.vue';


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
// const dynamicSvgWidth = computed(() => isLaptop.value ? 200 : 100);
// const dynamicSvgHeight = computed(() => isLaptop.value ? 150 : 75);


</script>

<style lang="scss" scoped>
@import "./AppHeader.scss";  
</style>
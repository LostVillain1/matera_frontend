<template>
    <div class="bout__container">
        <app-header></app-header>
        <div class="page-content">
            <div class="bout__wrapper">
                <img src="@/assets/bout_mob.png" class="boutique">
            </div>
            <div class="bout__info">
                <div class="soon_wrapper">
                    <p class="soon">Москва — скоро открытие!</p>
                </div>
                <div class="bout__img">
                    <img src="@/assets/bout_mob.png" class="boutique">
                </div>            
                <div class="soon_wrapper">
                    <p class="soon">Бутик в Radisson Zavidovo</p>                
                </div>
                <div class="info soon">
                    <p >
                        Контрастное арт-пространство<br />
                        и точка моды в сердце популярного<br /> курорта.
                    </p>
                </div>            
                <div class="bout__img">
                    <img src="@/assets/bout_mob.png" class="boutique">
                </div>  
                <div class="soon">
                    Адрес
                </div>
                <div class="adress soon">
                    <p>
                        Raddisson, Zavidovo<br/>
                    </p>
                </div>            
            </div> 
        </div>
        <app-footer class="footer"></app-footer>  
    </div>         
</template>

<script setup>

import AppHeader from '@/components/AppHeader/AppHeader.vue';
import AppFooter from '@/components/AppFooter/AppFooter.vue'; 

</script>

<style lang="scss" scoped>
@import '@/views/Boutique.scss'
</style>


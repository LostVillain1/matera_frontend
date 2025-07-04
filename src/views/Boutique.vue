<template>
    <div class="bout__container">
        <app-header></app-header>
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
                <p class="">
                    329229, Вологодская область,<br />
                    город Ступино, наб. Сталина, 17
                </p>
            </div>            
        </div> 
    </div>           
</template>

<script setup>

import AppHeader from '@/components/AppHeader/AppHeader.vue';

</script>

<style lang="scss" scoped>
@import '@/views/Boutique.scss'
</style>


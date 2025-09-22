<template>
  <AppHeader></AppHeader>
   <section class="about">

    <!-- ГЕРОЙ (самое первое фото страницы) -->
    <figure class="hero" aria-label="Обложка раздела">
      <img src="@/assets/about/about_1.webp" alt="" />
    </figure>

    <!-- Хлебные крошки -->
    <nav class="breadcrumbs container" aria-label="Хлебные крошки">
      <RouterLink to="/">Главная</RouterLink>
      <span class="sep">//</span>
      <span aria-current="page">О бренде</span>
    </nav>

    <!-- Блок О БРЕНДЕ: текст слева, фото справа -->
    <div class="intro container">
      <div class="intro__text">
        <h1 class="h1">О бренде</h1>
        <p class="lead">
          MATERA — это союз итальянских дизайнеров и русских мастеров. Эскизы для наших коллекций
          рождаются в Италии и обретают материальную форму в московском ателье.
        </p>
      </div>
      <figure class="intro__img">
        <img src="@/assets/about/about_2.webp" alt="" />
      </figure>
    </div>

    <!-- СЛОГАН -->
    <section class="slogan container">
      <h2 class="slogan__title">
        <span class="rule" aria-hidden="true"></span>
        «Придумано в Италии — сделано в России»
        <span class="rule" aria-hidden="true"></span>
      </h2>
    </section>

    <!-- ДИПТИХ: большое фото слева, справа текст + маленькое фото -->
    <section class="duo container">
      <div class="duo__left">
        <figure>
          <img src="@/assets/about/about_3.webp" alt="" />
        </figure>
        <div class="name__history" v-if="!isMobile">
           Эти контрасты вдохновляют нас на создание образов, в основе которых лежит идея бесконечных сочетаний каноничной классики и актуальных уличных трендов.
        </div>      
      </div>
      

      <div class="duo__right">
        <p class="duo__text">
          — это не только наш слоган, но и суть бренда.
          <br></br>
          <br></br>
          Название MATERA отсылает к итальянскому
          городу, где наследие древней культуры гармонично соседствует с современной эстетикой.
        </p>
        <figure class="duo__thumb">
          <img src="@/assets/about/about_4.webp" alt="" />
        </figure>
      </div>
    </section>

    <div class="name__history" v-if="isMobile">
      Эти контрасты вдохновляют нас на создание образов, в основе которых лежит идея бесконечных сочетаний каноничной классики и актуальных уличных трендов.
    </div>

    

    <!-- ШИРОКИЙ КАДР (как в макете — один общий кадр) -->
    <section class="wide container">
      <figure class="wide__frame">
        <img src="@/assets/about/about_5.webp" alt="" />
      </figure>
    </section>

    <section class="center-note container">
      <p>
        Неважно, где вы и сколько вам лет, любите ли вы простоту или яркие акценты — мы найдём баланс.
      </p>
    </section>

    <!-- О СТИЛЕ -->
    <section class="style container">
      <div class="about_style">
        <h2 class="h2">О стиле</h2>
        <p class="muted">
          Наше направление — это эклектика как вечный творческий эксперимент. Каждое изделие объединяет в себе,
          казалось бы, противоположные стили.
        </p>
      </div>   

      <div class="style__pair">
        <figure><img src="@/assets/about/about_6.webp" alt="" /></figure>
        <figure><img src="@/assets/about/about_7.webp" alt="" /></figure>
      </div>

      <p class="mission">
        Наша миссия — создавать универсальные образы вне времени путём сочетания несочетаемых деталей и идей.
      </p>
    </section>

    <!-- МАСТЕРСКАЯ В МОСКВЕ (две строки сетки, как в макете) -->
    <section class="workshop container">
      <div class="workshop_mobile" v-if="isMobile">
        <div class="workshop__row">
          <div class="workshop__text">
            <h3 class="h3">Мастерская в Москве</h3>
            <p class="muted">
              Здесь итальянские идеи воплощаются руками российских мастеров. Каждое изделие
              выпускается лимитированным тиражом и создаётся вручную в экспериментальном цехе.
            </p>
          </div>
          <figure class="workshop__photo work_first">
            <img src="@/assets/about/about_8.webp" alt="" />
          </figure>
        </div>
        <div class="workshop__text">
          <p class="muted">
            Мы используем сертифицированные ткани мирового уровня. Качество гарантируется ручной проверкой
            всех материалов и их свойств на предмет устойчивости к стирке, тепловой обработке и износу.
          </p>
        </div>
        <div class="workshop__row workshop__row--swap">
          <figure class="workshop__photo work_second">
            <img src="@/assets/about/about_9.webp" alt="" />
          </figure>
        </div>
      </div>
    <div v-else class="workshop__container">
      <div class="workshop-duo__left">
        <div class="workshop__text">
            <h3 class="h3">Мастерская в Москве</h3>
            <p class="muted">
              Здесь итальянские идеи воплощаются руками российских мастеров. <br> </br> <br></br>Каждое изделие
              выпускается лимитированным тиражом и создаётся вручную в экспериментальном цехе.
            </p>
        </div>
        <figure>
          <img src="@/assets/about/about_9.webp" alt="" />
        </figure>          
      </div>
      <div class="workshop-duo__right">
        <div class="workshop__row workshop__row--swap">
          <figure class="workshop__photo work_second">
            <img src="@/assets/about/about_8.webp" alt="" />
          </figure>
        </div>
        <div class="workshop__text">
          <p class="muted">
            Мы используем сертифицированные ткани мирового уровня. Качество гарантируется ручной проверкой
            всех материалов и их свойств на предмет устойчивости к стирке, тепловой обработке и износу.
          </p>
        </div>
      </div>
    </div>
      <div class="workshop__note">
        <p>
          Уход от массовости позволяет нам полностью контролировать процесс производства, лично проверяя каждое сшитое изделие.
        </p>
      </div>    

      <div class="workshop__final">
        <figure><img src="@/assets/about/about_10.webp" alt="" /></figure>
        <figure><img src="@/assets/about/about_11.webp" alt="" /></figure>
      </div>
    </section>
  </section>
  <AppFooter></AppFooter>
</template>

<script setup>
import AppHeader from '@/components/AppHeader/AppHeader.vue';
import AppFooter from '@/components/AppFooter/AppFooter.vue';
import { ref } from 'vue'

import { useHead } from '@vueuse/head'

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: new URL('@/assets/about/about_1.webp', import.meta.url).href,
      fetchpriority: 'high'
    },
  ]  
})

const isMobile = ref(window.innerWidth < 768)
// console.log(isMobile)

</script>

<style lang="scss" scoped>
@import "./About.scss" 
</style>
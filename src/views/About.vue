<template>
  <AppHeader></AppHeader>
  <div class="about-page">
    <section class="about-brand">

      <!-- БЛОК 1 -->
      <div class="brand-block">      
        <div class="brand-text">
          <h2 class="brand-title">О бренде</h2>
          <p>
            <span class="key">MATERA</span> —  это бренд для самых требовательных.
          </p>
        </div>
        <img class="brand-image" src="@/assets/brand/milmos.png" alt="Италия - Россия">
      </div>
      <!-- БЛОК 2 -->
      <div class="brand-block reverse">            
        <div class="brand-text">
          <h3 class="brand-subtitle">«1. Сделано вручную</h3>
          <p>
            Созданием каждого изделия занимается команда мастеров в московском ателье.
            Это искусство, а не производство.
          </p>
        </div>
        <img class="brand-image" src="@/assets/brand/handsabout.png" alt="процесc">
      </div>

      <!-- БЛОК 3 -->
      <div class="brand-block">      
        <div class="brand-text">
          <h3 class="brand-subtitle">«2. Не как у всех</h3>
          <p>
            Что, если строгая классика и уличная мода станут гармоничным целым?
            MATERA объединяет контрасты, уникальность и эклектику: каждое изделие создано на стыке двух противоположных стилей.
          </p>
        </div>
        <img class="brand-image" src="@/assets/brand/aboutcoffee.png" alt="Девушка">
      </div>
      <div class="brand-block reverse center">            
        <div class="brand-text">
          <h3 class="brand-subtitle">3. Придумано в Италии</h3>
          <p>
            Наша одежда - это смешение стилей, воплощённое командой опытных миланских дизайнеров.
          </p>
        </div>
      </div>
      <div class="brand-block center">
        <img class="brand-image" src="@/assets/brand/img1.png" alt="Девушка">
      </div>
      <div class="brand-block">      
        <div class="brand-text way">
          <h3 class="brand-subtitle">4. Ограниченный тираж</h3>
          <div>
            <p>
              Отказ от массовости позволяет нам контролировать процесс работы над каждым изделием.
            </p>
          </div>
          <!-- <div>
            <p><span class="key">Наша миссия</span> — создавать универсальные образы вне времени путём сочетания несочетаемых деталей и идей.</p>
          </div>           -->
        </div>
      </div>
      <div class="brand-block">      
        <div class="brand-text">
          <h2 class="brand-title">5. Высшее качество</h2>
          <p>
            Ткани мирового уровня вкупе с ручной проверкой материалов и их сочетаний на устойчивость к стирке, глажке и носке.
          </p>
        </div>
        <img class="brand-image" src="@/assets/brand/img2.png" alt="Италия - Россия">
      </div>
      <div class="brand-block end">      
        <div class="brand-text">
          <p>
            Придумано в Италии.
            Сделано в России  
          </p>
        </div>
      </div>
    </section>  
  </div>
  <AppFooter></AppFooter>
</template>

<script setup>
import AppHeader from '@/components/AppHeader/AppHeader.vue';
import AppFooter from '@/components/AppFooter/AppFooter.vue';
</script>

<style lang="scss" scoped>
@import "./About.scss" 
</style>
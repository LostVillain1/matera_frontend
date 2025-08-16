<template>
  <AppHeader></AppHeader>
  <div class="about-page">
    <section class="about-brand">

      <!-- БЛОК 1 -->
      <div class="brand-block">      
        <div class="brand-text">
          <h2 class="brand-title">О бренде</h2>
          <p>
            <span class="key">MATERA</span> — это союз итальянских дизайнеров и русских мастеров.
            Эскизы для наших коллекций создаются в Италии и обретают
            материальную форму в московском ателье.
          </p>
        </div>
        <img class="brand-image" src="@/assets/brand/milmos.png" alt="Италия - Россия">
      </div>
      <!-- БЛОК 2 -->
      <div class="brand-block reverse">            
        <div class="brand-text">
          <h3 class="brand-subtitle">«Придумано в Италии — <br> сделано в России»</h3>
          <p>
            — это не только наш слоган, но и суть бренда.<br><br>
            Название MATERA отсылает к итальянскому городу, где наследие
            древней культуры гармонично соседствует с современной жизнью.
          </p>
        </div>
        <img class="brand-image" src="@/assets/brand/handsabout.png" alt="процесc">
      </div>

      <!-- БЛОК 3 -->
      <div class="brand-block">      
        <div class="brand-text">
          <p>
            Эти контрасты вдохновляют нас на создание образов, в основе которых лежит
            идея бесконечных сочетаний каноничной классики и актуальных уличных трендов.
          </p>
        </div>
        <img class="brand-image" src="@/assets/brand/aboutcoffee.png" alt="Девушка">
      </div>
      <div class="brand-block reverse center">            
        <div class="brand-text">
          <h3 class="brand-subtitle">Неважно, где вы и сколько вам лет, любите ли вы простоту или яркие акценты — мы найдём баланс.</h3>
        </div>
      </div>
      <div class="brand-block center">
        <img class="brand-image" src="@/assets/brand/img1.png" alt="Девушка">
      </div>
      <div class="brand-block">      
        <div class="brand-text way">
          <h3 class="brand-subtitle">О стиле</h3>
          <div>
            <p>
              <span class="key">Наше направление</span> — это эклектика как вечный творческий эксперимент. Каждое изделие объединяет в себе, казалось бы, противоположные стили.         
            </p>
          </div>
          <div>
            <p><span class="key">Наша миссия</span> — создавать универсальные образы вне времени путём сочетания несочетаемых деталей и идей.</p>
          </div>          
        </div>
      </div>
      <div class="brand-block">      
        <div class="brand-text">
          <h2 class="brand-title">Мастерская в Москве</h2>
          <p>
            Здесь итальянские идеи воплощаются руками российских мастеров.<br><br> 

            Каждое изделие выпускается лимитированным тиражом и создается вручную в экспериментальном цехе. 
          </p>
        </div>
        <img class="brand-image" src="@/assets/brand/img2.png" alt="Италия - Россия">
      </div>
      <div class="brand-block">      
        <div class="brand-text">
          <p>
            Мы используем сертифицированные ткани мирового уровня, а качество гарантируется ручной проверкой всех материалов и их сочетаний на предмет устойчивости к стирке, тепловой обработке и носке.  
          </p>
        </div>
        <img class="brand-image" src="@/assets/brand/img3.png" alt="Италия - Россия">
      </div>
      <div class="brand-block">      
        <div class="brand-text way">
          <p>Уход от массовости позволяет нам полностью контролировать процесс производства, лично проверяя каждое сшитое изделие.</p>
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
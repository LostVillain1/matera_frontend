<template>
    <AppHeader></AppHeader>
    <div class="about-page">
    <section class="logo">
      <div class="overlay">
        <h2>О бренде</h2>
        <h1>MATERA</h1>
        <p class="locations">MILANO&nbsp;|&nbsp;MOSCOW</p>
      </div>
    </section>

    <nav class="breadcrumbs">
      <span>Главная //</span>
      <span class="current"> О бренде /</span>
    </nav>

    <section class="text-section">
      <p>
        Наши эскизы создаются в&nbsp;Милане, вдохновлённые итальянской
        элегантностью и&nbsp;страстью к&nbsp;дизайну. Каждый штрих — это
        отражение утончённого стиля, который мы привносим в мир моды.
      </p>
      <!-- <img src="@/assets/milan.jpg" alt="Миланская студия" /> -->
    </section>

    <!-- Блок 2 -->
    <section class="text-section">
      <p>
        Каждая деталь оживает в&nbsp;московском ателье, где наши мастера
        превращают идеи в&nbsp;реальность. Мы&nbsp;сочетаем традиции и
        современность, чтобы создать одежду, которая говорит сама за себя.
      </p>
      <!-- <img src="@/assets/moscow.jpg" alt="Работа в ателье" /> -->

      <p class="quote">
        Неважно, где вы и&nbsp;сколько вам лет,<br />
        любите ли&nbsp;вы простоту или яркие акценты —<br />
        мы&nbsp;найдём баланс.
      </p>
      <p class="instagram">@matera_couture</p>
    </section>

    <div class="title">
        Искусство создания:<br />
        <span>от вдохновения к шедевру</span>
    </div>

    <section class="text-section">
      <p>
        Каждая деталь оживает в&nbsp;московском ателье, где наши мастера
        превращают идеи в&nbsp;реальность. Мы&nbsp;сочетаем традиции и
        современность, чтобы создать одежду, которая говорит сама за себя.
      </p>
      <!-- <img src="@/assets/moscow.jpg" alt="Работа в ателье" /> -->

      <p class="quote">
        Неважно, где вы и&nbsp;сколько вам лет,<br />
        любите ли&nbsp;вы простоту или яркие акценты —<br />
        мы&nbsp;найдём баланс.
      </p>
      <p class="instagram">@matera_couture</p>
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
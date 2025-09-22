<template>
  <!-- ВНЕШНИЙ КОНТЕЙНЕР СТРАНИЦЫ -->
  <div class="boutiques">
    <!-- Хедер готов — просто вставляем -->
    <AppHeader />

    <!-- ОСНОВНОЕ СОДЕРЖИМОЕ СТРАНИЦЫ -->
    <main class="page" role="main">
      <!-- Крупный верхний баннер (как на макете) -->
      <section class="hero" aria-label="Фоновое изображение бутика">
        <!-- Временно используем один и тот же файл; позже можно заменить на отдельные -->
        <img src="@/assets/boutiques/first.webp" class="hero__img" alt="" />
      </section>

      <!-- Хлебные крошки (верх) -->
      <nav class="breadcrumbs" aria-label="Хлебные крошки">
        <ol class="breadcrumbs__list">
          <li class="breadcrumbs__item">
            <RouterLink to="/" class="breadcrumbs__link">Главная</RouterLink>
          </li>
          <li class="breadcrumbs__sep">//</li>
          <li class="breadcrumbs__item">Бутики</li>
          <li class="breadcrumbs__sep">/</li>
        </ol>
      </nav>

      <!-- БЛОК 1: BAZAAR (CS) -->
      <section class="bout block" aria-labelledby="bout-1-title">
        <h1 id="bout-1-title" class="bout__title">BAZAAR (CS)</h1>

        <p class="bout__lead">
          Концептуальный магазин в самом центре Москвы, включающий уникальную селекцию
          брендов и новых имён в мире моды.
        </p>

        <figure class="bout__photo">
          <img src="@/assets/boutiques/first_bout.webp" class="bout__img" alt="Интерьер магазина BAZAAR (CS)" />
        </figure>

        <h2 class="bout__subtitle">Адрес</h2>

        <address class="address">
          <p class="address__line">город Москва,<br />ул. Большая Полянка, 3/9</p>
          <p class="address__time">
            Пн – Пт: 11:00 – 20:00<br />Сб – Вс: 11:00 – 19:00
          </p>
        </address>
      </section>

      <!-- Разделительная линия как в макете (для планшета/десктопа появится автоматически из CSS) -->
      <hr class="divider" aria-hidden="true" />

      <!-- БЛОК 2: Бутик в Radisson Zavidovo -->
      <section class="bout block" aria-labelledby="bout-2-title">
        <h2 id="bout-2-title" class="bout__title">Бутик в Radisson Zavidovo</h2>

        <p class="bout__lead">
          Контрастное арт-пространство и точка моды в сердце популярного курорта.
        </p>

        <figure class="bout__photo">
          <img src="@/assets/boutiques/sec_bout.webp" class="bout__img" alt="Интерьер бутика в Radisson Zavidovo" />
        </figure>

        <h3 class="bout__subtitle">Адрес</h3>

        <address class="address">
          <p class="address__line">
            Тверская область, д. Вараксино,<br />Тверской бульвар, 4.
          </p>
          <p class="address__time">Пн – Пт: 12:00 – 21:00</p>
        </address>
      </section>

      <!-- Хлебные крошки (низ) -->
      <nav class="breadcrumbs breadcrumbs--bottom" aria-label="Хлебные крошки">
        <ol class="breadcrumbs__list">
          <li class="breadcrumbs__item">
            <RouterLink to="/" class="breadcrumbs__link">Главная</RouterLink>
          </li>
          <li class="breadcrumbs__sep">//</li>
          <li class="breadcrumbs__item">Бутики</li>
          <li class="breadcrumbs__sep">/</li>
        </ol>
      </nav>
    </main>

    <!-- Футер готов — просто вставляем -->
    <AppFooter class="footer" />
  </div>
</template>

<script setup>
// Компоненты шапки/футера уже реализованы ранее в проекте
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AppFooter from '@/components/AppFooter/AppFooter.vue'
import { useHead } from '@vueuse/head'

// Прелоадим РОВНО те картинки, которые хотим подтянуть заранее.
// Совет: high — только для главного hero.
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: new URL('@/assets/boutiques/first.png', import.meta.url).href,
      fetchpriority: 'high'
    }
  ]  
})

</script>

<style lang="scss" scoped>
@import '@/views/Boutique.scss';
</style>

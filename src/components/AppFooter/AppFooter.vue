<template>
  <footer class="footer">
    <div class="footer-top">
      <p class="footer-text">
        Наши подписчики всегда в курсе<br />
        всех последних коллекций и<br />
        специальных предложений.
      </p>
      <p class="footer-link">@matera_couture</p>
    </div>

    <div class="footer-accordion">
      <AccordionItem title="Покупателю" />
      <AccordionItem title="Коллекции" />
      <AccordionItem title="Документация" />
    </div>

    <div class="footer-bottom">
      <p class="footer-copy">© 2025 MATERA. Все права защищены.</p>
      <p class="footer-design">
        Design by <a href="#" target="_blank">Lapaev Nikolay</a>
      </p>
    </div>
  </footer>
</template>

<script setup>
import AccordionItem from './AccordionItem.vue';
</script>

<style lang="scss" scoped>
@import './AppFooter.scss';
</style> 
 
 
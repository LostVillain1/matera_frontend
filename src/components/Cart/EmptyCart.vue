<template>
  <div class="empty">
    <p class="text">Ваша корзина пуста</p>
    <router-link to="/catalog" class="link">Перейти в каталог</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.empty { 
    background:#fff; 
    padding:40px; 
    text-align:center; 
    border-radius:8px; 
    color:#666 }
.link { 
    display:inline-block; 
    margin-top:12px; 
    padding:10px 14px; 
    background:#3d1f28; 
    color:#fff; 
    border-radius:8px; 
    text-decoration:none; 
}
</style>
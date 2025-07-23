<template>
  <div class="accordion-item">
    <button class="accordion-header" @click="toggle">
      <span>{{ title }}</span>
      <div :class="{ rotated: isOpen }">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.0837 6.65836C16.972 6.54933 16.8222 6.48828 16.6662 6.48828C16.5101 6.48828 16.3603 6.54933 16.2487 6.65836L9.99991 12.7496L3.75241 6.65836C3.64079 6.54933 3.49094 6.48828 3.33491 6.48828C3.17887 6.48828 3.02902 6.54933 2.91741 6.65836C2.86298 6.71136 2.81971 6.77472 2.79018 6.84471C2.76064 6.9147 2.74542 6.9899 2.74542 7.06586C2.74542 7.14183 2.76064 7.21703 2.79018 7.28702C2.81971 7.35701 2.86298 7.42037 2.91741 7.47336L9.56366 13.9509C9.68037 14.0646 9.83692 14.1283 9.99991 14.1283C10.1629 14.1283 10.3194 14.0646 10.4362 13.9509L17.0824 7.47336C17.1368 7.42037 17.1801 7.35701 17.2096 7.28702C17.2392 7.21703 17.2544 7.14183 17.2544 7.06586C17.2544 6.9899 17.2392 6.9147 17.2096 6.84471C17.1801 6.77472 17.1368 6.71136 17.0824 6.65836H17.0837Z" fill="#FFF7A8"/>
        </svg>
      </div>      

      <!-- <span :class="{ rotated: isOpen }">⌄</span> -->
    </button>
    <div v-if="isOpen" class="accordion-content">
      <p>Тут может быть любой контент.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  title: String,
});

const isOpen = ref(false);
const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.accordion-item {
  border-top: 1px solid #8d8375;
  padding-top: 10px;
}

.accordion-header {
  color: #39213D;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  font-size: 20px;
  font-family: 'PT Serif', serif;
  padding: 10px 0;
  width: 100%;
  cursor: pointer;
}

.accordion-header span:last-child {
  transition: transform 0.3s;
}

.accordion-header div.rotated {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 10px 0;
  font-size: 16px;
  color: #39213D;
}

@media (min-width : 768px) {
  
  .accordion-header {
    font-size: 20px;
  } 

  .accordion-content {
    font-size: 18px;    
  }


}

</style>
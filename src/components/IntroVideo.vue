<!-- src/components/IntroVideo.vue -->
<template>
  <video
    ref="videoRef"
    class="intro-video"
    autoplay
    muted
    playsinline
    @ended="handleFinish"
    @error="handleFinish"
  >
    <source :src="videoSrc" type="video/webm" />
  </video>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import videoUrl from '@/assets/output.webm' // <-- импорт файла, чтобы бандлер точно подхватил
const videoSrc = videoUrl

const emit = defineEmits(['finished'])
const videoRef = ref(null)

const handleFinish = () => {
  if (videoRef.value) videoRef.value.classList.add('is-hidden')
  emit('finished')
}

onMounted(() => {
  videoRef.value?.play?.().catch(() => {
    // если автоплей заблокирован — сразу завершаем (или сделай кнопку "воспроизвести")
    handleFinish()
  })
})
</script>

<style scoped>
.intro-video {
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  z-index: 1000;
  pointer-events: none;
  transition: opacity 2s ease;
}
.intro-video.is-hidden { opacity: 0; }
</style>

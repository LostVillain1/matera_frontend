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
    <!-- положи файл в /src/assets/ -->
    <source src="@/assets/output.webm" type="video/webm" />
  </video>
</template>

<script setup>
import { ref, onMounted } from "vue"

const emit = defineEmits(["finished"])
const videoRef = ref(null)

const handleFinish = () => {
  // плавно прячем и говорим родителю, что всё
  if (videoRef.value) videoRef.value.classList.add("is-hidden")
  emit("finished")
}

// На всякий случай: если проигрывание заблокировано браузером,
// можно попытаться стартануть по готовности
onMounted(() => {
  videoRef.value?.play?.().catch(() => {
    // если не удалось автозапустить — сразу “закончить”
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
  transition: opacity .5s ease;
}
.intro-video.is-hidden { opacity: 0; }
</style>
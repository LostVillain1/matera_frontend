import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

export function useBreakpoints() {
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    laptop: 1440,
    desktop: 1920,
  };

  const screenType = ref(null);

  const updateScreenType = () => {
    const width = window.innerWidth;
    if (width < breakpoints.mobile) screenType.value = 'mobile';
    else if (width < breakpoints.tablet) screenType.value = 'tablet';
    else if (width < breakpoints.laptop) screenType.value = 'laptop';
    else if (width < breakpoints.desktop) screenType.value = 'desktop';
    else screenType.value = 'ultraWide';
  };

  onMounted(() => {
    updateScreenType();
    window.addEventListener('resize', updateScreenType);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScreenType);
  });

  // Реактивные флаги 
  const isMobile = computed(() => screenType.value === 'mobile');
  const isTablet = computed(() => screenType.value === 'tablet');
  const isLaptop = computed(() => screenType.value === 'laptop');
  const isDesktop = computed(() => screenType.value === 'desktop');
  const isUltraWide = computed(() => screenType.value === 'ultraWide');

  return { 
    screenType,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isUltraWide,
    breakpoints
  };
}
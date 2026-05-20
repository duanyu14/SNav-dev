<template>
  <Transition name="fade">
    <div v-show="menuOpen && !props.screenSaverVisible && !status.backgroundShow" class="menu-overlay" @click="closeMenu"></div>
  </Transition>
  <div
    class="top-menu-container"
    v-show="!props.screenSaverVisible && !status.backgroundShow"
    :class="{ 'mobile': isMobile }"
  >
    <div
      class="menu-trigger"
      v-show="(isMobile || arrowVisible || menuOpen) && !status.backgroundShow && !props.screenSaverVisible"
      @click="toggleMenu"
      :class="{ active: menuOpen }"
    >
      <img
        :src="menuOpen ? '/icon/arrow_up.png' : '/icon/arrow_down.png'"
        class="arrow-icon"
        alt="arrow"
      />
    </div>

    <Transition name="slide-down">
      <div v-show="menuOpen" class="menu-content cards" @click.stop>
        <div class="menu-left">
          <div class="time-row">
            <span class="hour">{{ timeData.hour }}:{{ timeData.minute }}:{{ timeData.second }}</span>
          </div>
          <div class="date-row">
            <span>{{ timeData.year }}-{{ formatZero(timeData.month) }}-{{ timeData.day }} {{ timeData.weekday }}</span>
          </div>
          <div v-if="set.showWeather" class="weather-row">
            <span>{{ site.weatherData?.condition || '--' }} {{ site.weatherData?.temp || '--' }}℃</span>
          </div>
        </div>
        <div class="menu-center">
          <Hitokoto mini />
        </div>
        <div class="menu-right">
          <div class="quick-links">
            <a
              v-for="item in topLinks"
              :key="item.id"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >
              <SvgIcon :iconName="`icon-${item.icon || 'link'}`" />
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { statusStore, setStore, siteStore } from '@/stores';
import { getCurrentTime } from '@/utils/timeTools';
import Hitokoto from '@/components/Hitokoto.vue';

const props = defineProps({
  screenSaverVisible: Boolean
});

const status = statusStore();
const set = setStore();
const site = siteStore();

const menuOpen = ref(false);
const arrowVisible = ref(false);
const isMobile = ref(window.innerWidth <= 1024);
const timeData = ref({});

const formatZero = (num) => {
  return num < 10 ? '0' + num : num;
};

const topLinks = computed(() => site.shortcutData.slice(0, 4));

const updateTime = () => {
  const time = getCurrentTime(set.showZeroTime, set.use12HourFormat);
  timeData.value = time;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

const handleClickOutside = (e) => {
  if (menuOpen.value) {
    const isMenuElement = e.target.closest('.top-menu-container') || e.target.classList.contains('menu-overlay');
    if (!isMenuElement) {
      closeMenu();
    }
  }
};

const handleMouseMove = (e) => {
  if (!isMobile.value && !props.screenSaverVisible && !status.backgroundShow) {
    const threshold = 50;
    arrowVisible.value = e.clientY <= threshold;
  } else {
    arrowVisible.value = false;
  }
};

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && menuOpen.value) {
    closeMenu();
  }
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 1024;
};

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);

  document.addEventListener('click', handleClickOutside);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style lang="scss" scoped>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 290;
  pointer-events: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.top-menu-container {
  position: fixed;
  top: 20px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 300;
  pointer-events: none;

  &.mobile {
    .menu-trigger {
      width: 56px;
      height: 56px;
    }
  }

  .menu-trigger {
    pointer-events: auto;
    width: 48px;
    height: 48px;
    background: var(--main-background-light-color);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s, background 0.3s;
    box-shadow: var(--main-box-shadow);

    &:hover {
      transform: scale(1.1);
      background: var(--main-background-hover-color);
    }
    &:active {
      transform: scale(0.95);
    }

    .arrow-icon {
      width: 24px;
      height: 24px;
      filter: brightness(0) invert(1);
    }
  }

  .menu-content {
    pointer-events: auto;
    margin-top: 10px;
    width: 90%;
    max-width: 1100px;
    padding: 20px 28px;
    background: var(--main-background-light-color);
    backdrop-filter: blur(10px);
    border-radius: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    box-shadow: var(--main-box-shadow);
    color: var(--main-text-color);

    .menu-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .time-row {
        .hour {
          font-family: 'HarmonyOS_Regular', monospace;
          font-size: 2rem;
          font-weight: bold;
        }
      }
      .date-row {
        font-size: 1rem;
        opacity: 0.85;
      }
      .weather-row {
        font-size: 0.9rem;
        margin-top: 4px;
      }
    }

    .menu-center {
      flex: 2;
      display: flex;
      justify-content: center;
      :deep(.hitokoto) {
        text-align: center;
        .content .text {
          font-size: 1rem;
          -webkit-line-clamp: 2;
        }
        .content .from {
          font-size: 0.9rem;
        }
      }
    }

    .menu-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;

      .quick-links {
        display: flex;
        flex-direction: column;
        gap: 10px;

        a {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--main-text-color);
          text-decoration: none;
          font-size: 0.85rem;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          transition: all 0.2s;
          white-space: nowrap;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
          }
        }
      }
    }

    @media (max-width: 1024px) {
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .menu-left,
      .menu-center,
      .menu-right {
        width: 100%;
        justify-content: center;
        text-align: center;
      }

      .menu-left {
        align-items: center;
        gap: 4px;
        .time-row .hour {
          font-size: 1.3rem;
        }
        .date-row {
          font-size: 0.85rem;
        }
      }

      .menu-right .quick-links {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
      }
    }

    @media (max-width: 720px) {
      padding: 16px 15px;
      width: 95%;
      border-radius: 20px;

      .menu-left {
        .time-row .hour {
          font-size: 1.2rem;
        }
        .date-row {
          font-size: 0.8rem;
        }
      }

      .menu-center :deep(.hitokoto) {
        .content .text {
          font-size: 0.9rem;
        }
      }

      .menu-right .quick-links {
        gap: 8px;
        a {
          font-size: 0.8rem;
          padding: 5px 10px;
        }
      }
    }
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
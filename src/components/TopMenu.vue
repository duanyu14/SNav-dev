<template>
  <div
    class="top-menu-container"
    v-show="!screenSaverVisible"
    :class="{ 'mobile': isMobile }"
  >
    <!-- 箭头触发器 -->
    <div
      class="menu-trigger"
      v-show="isMobile || arrowVisible || menuVisible"
      @click="toggleMenu"
    >
      <img
        :src="menuVisible ? '/icon/arrow_up.png' : '/icon/arrow_down.png'"
        class="arrow-icon"
        alt="arrow"
      />
    </div>

    <!-- 下拉菜单 -->
    <Transition name="slide-down">
      <div v-show="menuVisible" class="menu-content cards">
        <div class="menu-left">
          <!-- 迷你版时间 -->
          <div class="mini-time">
            <span class="hour">{{ timeData.hour }}:{{ timeData.minute }}</span>
            <span class="date">{{ timeData.month }}/{{ timeData.day }} {{ timeData.weekday }}</span>
          </div>
          <!-- 迷你版天气（复用 WeatherTime 中的缓存数据） -->
          <div v-if="set.showWeather" class="mini-weather">
            <span>{{ weatherData?.condition || '--' }} {{ weatherData?.temp || '--' }}℃</span>
          </div>
          <!-- 一言（迷你版） -->
          <Hitokoto mini />
        </div>
        <div class="menu-right">
          <div class="quick-links">
            <a
              v-for="item in topLinks"
              :key="item.id"
              :href="item.url"
              target="_blank"
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
  screenSaverVisible: Boolean  // 由父组件传入，用于控制整个组件隐藏
});

const status = statusStore();
const set = setStore();
const site = siteStore();

// 菜单显示状态
const menuVisible = ref(false);
// 箭头是否可见（桌面端鼠标靠近顶部时触发）
const arrowVisible = ref(false);
// 是否为移动端（宽度 ≤ 720px）
const isMobile = ref(window.innerWidth <= 720);
// 时间数据
const timeData = ref({});
// 天气数据（从 localStorage 读取）
const weatherData = ref(null);

// 取前 4 个快捷站点作为快捷链接
const topLinks = computed(() => site.shortcutData.slice(0, 4));

// 更新时间
const updateTime = () => {
  timeData.value = getCurrentTime(set.showZeroTime, set.use12HourFormat);
};

// 获取天气（从 localStorage 读取，与 WeatherTime 保持一致）
const getWeatherFromCache = () => {
  const cached = JSON.parse(localStorage.getItem('lastWeatherData'));
  if (cached && cached.data) {
    weatherData.value = cached.data;
  }
};

// 切换菜单（点击箭头时）
const toggleMenu = (e) => {
  e.stopPropagation();
  menuVisible.value = !menuVisible.value;
};

// 点击外部关闭菜单
const handleClickOutside = (e) => {
  if (menuVisible.value && !e.target.closest('.top-menu-container')) {
    menuVisible.value = false;
  }
};

// 鼠标移动检测靠近顶部（仅 PC）
const handleMouseMove = (e) => {
  if (!isMobile.value && !props.screenSaverVisible) {
    const threshold = 50;
    arrowVisible.value = e.clientY <= threshold;
  } else {
    arrowVisible.value = false;
  }
};

// 窗口大小变化检测移动端
const handleResize = () => {
  isMobile.value = window.innerWidth <= 720;
};

// ----- 触摸滑动支持（移动端） -----
let touchStartY = 0;
const TOUCH_THRESHOLD = 50; // 滑动距离阈值

const handleTouchStart = (e) => {
  touchStartY = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  // 仅在移动端、菜单未展开、且非屏保时响应
  if (!isMobile.value || menuVisible.value || props.screenSaverVisible) return;
  const touchEndY = e.touches[0].clientY;
  const deltaY = touchEndY - touchStartY;
  if (deltaY > TOUCH_THRESHOLD) {
    // 向下滑动超过阈值，打开菜单
    menuVisible.value = true;
  }
};

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
  getWeatherFromCache();

  document.addEventListener('click', handleClickOutside);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', handleResize);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
});
</script>

<style lang="scss" scoped>
.top-menu-container {
  position: fixed;
  top: 20px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 300;
  pointer-events: none; /* 让容器不阻挡点击，但内部可点 */

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
      font-size: 24px;
      color: var(--main-text-color);
    }
  }

  .menu-content {
    pointer-events: auto;
    margin-top: 10px;
    width: 90%;
    max-width: 900px;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--main-background-light-color);
    backdrop-filter: blur(10px);
    border-radius: 40px;
    box-shadow: var(--main-box-shadow);
    color: var(--main-text-color);

    .menu-left {
      display: flex;
      gap: 24px;
      align-items: center;
      font-size: 0.9rem;

      .mini-time {
        display: flex;
        flex-direction: column;
        .hour {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .date {
          font-size: 0.8rem;
          opacity: 0.7;
        }
      }

      .mini-weather {
        font-size: 0.9rem;
      }

      :deep(.hitokoto) {
        margin-top: 0;
        font-size: 0.85rem;
        max-width: 200px;
      }
    }

    .menu-right {
      .quick-links {
        display: flex;
        gap: 16px;

        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--main-text-color);
          text-decoration: none;
          font-size: 0.8rem;
          transition: 0.2s;

          &:hover {
            color: var(--main-text-hover-color);
            transform: scale(1.05);
          }

          .i-icon {
            font-size: 20px;
            margin-bottom: 4px;
          }
        }
      }
    }

    // 移动端适配
    @media (max-width: 720px) {
      flex-direction: column;
      align-items: stretch;
      padding: 16px;
      width: 95%;
      border-radius: 20px;

      .menu-left {
        justify-content: space-around;
        margin-bottom: 12px;
      }

      .menu-right .quick-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px 8px;

        a {
          font-size: 0.9rem;
          .i-icon {
            font-size: 24px;
          }
        }
      }
    }
  }
}

/* 滑入动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.arrow-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1); /* 将黑色图标变为白色 */
}
</style>
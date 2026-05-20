<template>
  <Provider>
    <Cover @loadComplete="loadComplete" />
    <TopMenu :screenSaverVisible="screenSaverVisible" />
    <ScreenSaver :visible="screenSaverVisible" @click="onUserActivity" />
    <Transition name="fade" mode="out-in">
      <main
        v-if="status.imgLoadStatus && !screenSaverVisible"
        tabindex="0"
        id="main"
        :class="`main-${status.siteStatus}`"
        :style="{ pointerEvents: mainClickable ? 'auto' : 'none' }"
        @click="status.setSiteStatus('normal')"
        @contextmenu="mainContextmenu"
        @keydown="mainPressKeyboard"
      >
        <WeatherTime />
        <SearchInp @contextmenu.stop />
        <AllFunc @contextmenu.stop />
        <Footer />
        <Transition name="fade">
          <div
            class="all-controls"
            v-show="status.siteStatus !== 'focus' && status.siteStatus !== 'normal'"
          >
            <div
              class="change-status"
              :title="status.mainBoxBig ? '收起' : '展开'"
              @click.stop="status.setMainBoxBig(!status.mainBoxBig)"
            >
              <Transition name="fade" mode="out-in">
                <SvgIcon
                  :iconName="`icon-${status.mainBoxBig ? 'packup' : 'unfold'}`"
                  :key="status.mainBoxBig ? 'packup' : 'unfold'"
                />
              </Transition>
            </div>
            <div
              class="change-status"
              :title="status.siteStatus !== 'set' ? '设置' : '首页'"
              @click.stop="status.setSiteStatus(status.siteStatus !== 'set' ? 'set' : 'normal')"
            >
              <Transition name="fade" mode="out-in">
                <SvgIcon
                  :iconName="`icon-${status.siteStatus !== 'set' ? 'setting' : 'home'}`"
                  :key="status.siteStatus !== 'set' ? 'setting' : 'home'"
                />
              </Transition>
            </div>
          </div>
        </Transition>
      </main>
      <Loading v-else />
    </Transition>
  </Provider>
</template>

<script setup>
import {
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
  ref
} from "vue";
import { statusStore, setStore, siteStore } from "@/stores";
import { getGreeting } from "@/utils/timeTools";
import { getAdcode, getWeather, getHitokoto } from "@/api";
import Provider from "@/components/Provider.vue";
import Cover from "@/components/Cover.vue";
import WeatherTime from "@/components/WeatherTime.vue";
import SearchInp from "@/components/SearchInput/SearchInp.vue";
import AllFunc from "@/components/AllFunc/AllFunc.vue";
import Footer from "@/components/Footer.vue";
import Loading from "@/components/Loading.vue";
import TopMenu from "@/components/TopMenu.vue";
import ScreenSaver from "@/components/ScreenSaver.vue";
import { checkDays } from "@/utils/checkDays";

const set = setStore();
const status = statusStore();
const site = siteStore();
const mainClickable = ref(false);

const screenSaverVisible = ref(false);
let idleTimer = null;
const IDLE_TIMEOUT = 30 * 1000;
const WEATHER_CACHE_TIME = 5 * 60 * 1000;
const HITOKOTO_CACHE_TIME = 60 * 1000;

const resetIdleTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);
  if (screenSaverVisible.value) return;
  idleTimer = setTimeout(() => {
    screenSaverVisible.value = true;
    $message.info('检测到您长时间未操作，已进入屏保模式', {
      duration: 2000
    });
  }, IDLE_TIMEOUT);
};

const onUserActivity = () => {
  if (screenSaverVisible.value) {
    screenSaverVisible.value = false;
    status.setSiteStatus('normal');
    status.setMenuOpenState(false);
    status.setBackgroundShow(false);
    resetIdleTimer();
  } else {
    resetIdleTimer();
  }
};

const startIdleDetection = () => {
  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.addEventListener(event, onUserActivity);
  });
  resetIdleTimer();
};

const stopIdleDetection = () => {
  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.removeEventListener(event, onUserActivity);
  });
  if (idleTimer) clearTimeout(idleTimer);
};

const fetchWeatherData = async () => {
  const weatherKey = import.meta.env.VITE_WEATHER_KEY;
  if (!weatherKey) {
    return;
  }
  const currentTime = Date.now();
  if (currentTime - site.lastWeatherFetchTime >= WEATHER_CACHE_TIME) {
    try {
      const adCodeResult = await getAdcode(weatherKey);
      if (adCodeResult.infocode === "10000") {
        const weatherResult = await getWeather(weatherKey, adCodeResult.adcode);
        if (weatherResult.infocode === "10000" && weatherResult.lives && weatherResult.lives.length > 0) {
          const data = weatherResult.lives[0];
          const weatherData = {
            condition: data.weather,
            temp: data.temperature,
            windDir: data.winddirection + "风",
            windLevel: data.windpower,
          };
          site.setWeatherData(weatherData);
          localStorage.setItem("lastWeatherData", JSON.stringify({
            data: weatherData,
            lastFetchTime: currentTime
          }));
        }
      }
    } catch (error) {
      console.error("获取天气数据失败：", error);
    }
  }
};

const fetchHitokotoData = async () => {
  const currentTime = Date.now();
  if (currentTime - site.lastHitokotoFetchTime >= HITOKOTO_CACHE_TIME) {
    try {
      const hitokotoResult = await getHitokoto();
      if (hitokotoResult) {
        site.setHitokotoData(hitokotoResult);
      }
    } catch (error) {
      console.error("获取一言数据失败：", error);
    }
  }
};

const welcomeText = import.meta.env.VITE_WELCOME_TEXT ?? "欢迎访问本站";

const mainContextmenu = (event) => {
  event.preventDefault();
  status.setSiteStatus("box");
};

const loadComplete = () => {
  nextTick().then(() => {
    mainClickable.value = true;
    $message.info(getGreeting() + "，" + welcomeText, {
      showIcon: false,
      duration: 3000,
    });
    checkDays();
    fetchWeatherData();
    fetchHitokotoData();
  });
};

const mainPressKeyboard = (event) => {
  const keyCode = event.keyCode;
  if (keyCode === 13) {
    const mainInput = document.getElementById("main-input");
    status.setSiteStatus("focus");
    mainInput?.focus();
  }

  if (event.ctrlKey && event.shiftKey && event.key === "S") {
    event.preventDefault();
    screenSaverVisible.value = !screenSaverVisible.value;
    if (screenSaverVisible.value) {
      $message.info("已进入屏保模式（调试）", {
        grouping: true,
      });
    } else {
      onUserActivity();
      $message.info("已退出屏保模式（调试）", {
        grouping: true,
      });
    }
  }
};

const changeThemeType = (val) => {
  const htmlElement = document.querySelector("html");
  const themeType = val === "light" ? "light" : "dark";
  htmlElement.setAttribute("theme", themeType);
};

watch(() => set.themeType, changeThemeType, { immediate: true });

onMounted(() => {
  startIdleDetection();
});

onBeforeUnmount(() => {
  stopIdleDetection();
});
</script>

<style lang="scss" scoped>
#main,
#loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.main-normal,
  &.main-focus {
    .main-box {
      opacity: 0;
      margin-top: 0;
      transform: scale(0.35);
      pointer-events: none;
    }
  }
  &.main-box,
  &.main-set {
    .main-box {
      opacity: 1;
      margin-top: 20vh;
      transform: scale(1);
      visibility: visible;
      @media (max-width: 478px) {
        margin-top: 22vh;
      }
    }
    .search-input {
      :deep(.all) {
        opacity: 0;
        width: 0;
        visibility: hidden;
      }
    }
  }
  .all-controls {
    position: fixed;
    width: 100%;
    top: 0;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .change-status {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      padding: 8px;
      border-radius: 8px;
      color: var(--main-text-color);
      z-index: 1;
      transition:
        opacity 0.3s,
        background-color 0.3s,
        transform 0.3s;
      &:hover {
        backdrop-filter: blur(20px);
        background-color: var(--main-background-light-color);
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
}
#loading {
  color: var(--main-text-color);
  .logo {
    width: 100px;
    height: 100px;
    margin-bottom: 24px;
    animation: logo-breathe 3s infinite alternate;
  }
  .tip {
    font-size: 20px;
  }
}
</style>
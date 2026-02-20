<template>
  <Transition name="fade">
    <div v-if="visible" class="screen-saver" @click="emit('click')">
      <div class="overlay"></div>
      <div class="content">
        <div class="time">
          <span class="hour">{{ timeData.hour }}:{{ timeData.minute }}:{{ timeData.second }}</span>
          <span class="date">{{ timeData.month }}/{{ timeData.day }} {{ timeData.weekday }}</span>
        </div>
        <div class="info">
          <div class="weather" v-if="set.showWeather">
            {{ weatherData?.condition || '--' }} {{ weatherData?.temp || '--' }}℃
          </div>
          <Hitokoto mini />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { setStore } from '@/stores';
import { getCurrentTime } from '@/utils/timeTools';
import Hitokoto from './Hitokoto.vue';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['click']);

const set = setStore();
const timeData = ref({});
const weatherData = ref(null);

const updateTime = () => {
  timeData.value = getCurrentTime(set.showZeroTime, set.use12HourFormat);
};

const getWeatherFromCache = () => {
  const cached = JSON.parse(localStorage.getItem('lastWeatherData'));
  if (cached && cached.data) {
    weatherData.value = cached.data;
  }
};

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
  getWeatherFromCache();
});
</script>

<style lang="scss" scoped>
.screen-saver {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  cursor: pointer;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    pointer-events: none;

    .time {
      text-align: center;
      margin-bottom: 30px;

      .hour {
        font-size: 5rem;
        font-family: 'HarmonyOS_Regular', sans-serif;
        line-height: 1.2;
      }

      .date {
        font-size: 1.5rem;
        opacity: 0.8;
      }

      @media (max-width: 720px) {
        .hour { font-size: 3.5rem; }
        .date { font-size: 1.2rem; }
      }
    }

    .info {
      display: flex;
      gap: 30px;
      font-size: 1.5rem;

      :deep(.hitokoto) {
        font-size: 1.2rem;
        opacity: 1;
      }

      @media (max-width: 720px) {
        flex-direction: column;
        align-items: center;
        gap: 10px;
        :deep(.hitokoto) { font-size: 1rem; }
      }
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
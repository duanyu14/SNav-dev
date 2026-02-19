<template>
  <div class="hitokoto" v-if="hitokotoText">
    <span class="text">“{{ hitokotoText }}”</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "@/utils/request"; // 使用项目封装的 axios

// 一言内容
const hitokotoText = ref("");
// 定时器句柄
let timer = null;

// 获取一言的函数
const fetchHitokoto = async () => {
  try {
    // 一言接口，无需参数
    const res = await axios.get("https://v1.hitokoto.cn/");
    // 接口返回的数据结构：{ hitokoto: "...", from: "...", ... }
    if (res && res.hitokoto) {
      hitokotoText.value = res.hitokoto;
    } else {
      hitokotoText.value = "一言获取失败";
    }
  } catch (error) {
    console.error("一言获取失败", error);
    hitokotoText.value = "网络开小差了";
  }
};

// 组件挂载时获取一言并启动定时器
onMounted(() => {
  fetchHitokoto();
  timer = setInterval(fetchHitokoto, 30000); // 30秒更新一次
});

// 组件卸载前清除定时器，避免内存泄漏
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.hitokoto {
  margin-top: 10px;                /* 与上方天气拉开距离 */
  font-size: 0.9rem;               /* 比时间稍小 */
  opacity: 0.7;                     /* 半透明，更柔和 */
  text-shadow: var(--main-text-shadow);
  max-width: 80vw;                  /* 限制宽度，防止过长换行 */
  white-space: nowrap;              /* 单行显示，过长用省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.3s;         /* 平滑过渡 */
  color: var(--main-text-color);    /* 与文字颜色保持一致 */
}

/* 可选：在焦点/盒子状态下让一言透明度更低一些，更不显眼 */
.weather-time.focus .hitokoto,
.weather-time.box .hitokoto,
.weather-time.set .hitokoto {
  opacity: 0.4;
}
</style>
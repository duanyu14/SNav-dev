<template>
  <div class="hitokoto" v-if="hitokotoText">
    <div class="content">
      <span class="text">“{{ hitokotoText }}”</span>
      <span v-if="hitokotoFrom" class="from">—— {{ hitokotoFrom }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { siteStore } from "@/stores";

defineProps({
  mini: {
    type: Boolean,
    default: false
  }
});

const site = siteStore();
const hitokotoText = ref("");
const hitokotoFrom = ref("");

const updateHitokoto = () => {
  if (site.hitokotoData) {
    hitokotoText.value = site.hitokotoData.hitokoto || "";
    hitokotoFrom.value = site.hitokotoData.from || "";
  }
};

onMounted(() => {
  updateHitokoto();
});

watch(() => site.hitokotoData, () => {
  updateHitokoto();
}, { deep: true });
</script>

<style scoped>
.hitokoto {
  margin-top: 10px;
  font-size: 0.9rem;
  opacity: 0.7;
  text-shadow: var(--main-text-shadow);
  max-width: 80vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.3s;
  color: var(--main-text-color);

  .content {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;

    .text {
      font-size: 0.9rem;
    }

    .from {
      font-size: 0.8rem;
      opacity: 0.6;
    }
  }
}

.weather-time.focus .hitokoto,
.weather-time.box .hitokoto,
.weather-time.set .hitokoto {
  opacity: 0.4;
}
</style>
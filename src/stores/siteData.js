import { defineStore } from "pinia";
import defaultShortCut from "@/assets/defaultShortCut";

const useSiteDataStore = defineStore("siteData", {
  state: () => {
    return {
      shortcutData: defaultShortCut,
      noteList: [],
      todoList: [],
      weatherData: null,
      hitokotoData: null,
      lastWeatherFetchTime: 0,
      lastHitokotoFetchTime: 0,
    };
  },
  actions: {
    setShortcutData(value) {
      this.shortcutData = value;
    },
    setWeatherData(data) {
      this.weatherData = data;
      this.lastWeatherFetchTime = Date.now();
    },
    setHitokotoData(data) {
      this.hitokotoData = data;
      this.lastHitokotoFetchTime = Date.now();
    },
    recoverSiteData(data) {
      try {
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            this[key] = data[key];
          }
        }
        return true;
      } catch (error) {
        console.error("站点数据恢复失败：", error);
        return false;
      }
    },
  },
  persist: {
    key: "siteData",
    storage: window.localStorage,
  },
});

export default useSiteDataStore;
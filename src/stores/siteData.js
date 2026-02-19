import { defineStore } from "pinia";
import defaultShortCut from "@/assets/defaultShortCut";

const useSiteDataStore = defineStore("siteData", {
  state: () => {
    return {
      shortcutData: defaultShortCut,
      noteList: [],   // 每个便签对象包含 id, title, content
      todoList: [],   // 每个待办对象包含 id, text, completed
    };
  },
  actions: {
    setShortcutData(value) {
      this.shortcutData = value;
    },
    // ✅ 将 recoverSiteData 放在这里
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
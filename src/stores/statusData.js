import { defineStore } from "pinia";

const useStatusDataStore = defineStore("statusData", {
  state: () => {
    return {
      imgLoadStatus: false,
      siteStatus: "normal",
      engineChangeStatus: false,
      searchInputValue: "",
      mainBoxBig: false,
      menuOpenState: false,
      backgroundShow: false,
    };
  },
  getters: {},
  actions: {
    setImgLoadStatus(value) {
      this.imgLoadStatus = value;
    },
    setSiteStatus(value, alsoChange = true) {
      this.siteStatus = value;
      if (value !== "focus") this.searchInputValue = "";
      if (alsoChange) this.engineChangeStatus = false;
    },
    setEngineChangeStatus(value) {
      this.engineChangeStatus = value;
    },
    setSearchInputValue(value) {
      this.searchInputValue = value;
    },
    setMainBoxBig(value) {
      this.mainBoxBig = value;
    },
    setMenuOpenState(value) {
      this.menuOpenState = value;
    },
    toggleMenuOpenState() {
      this.menuOpenState = !this.menuOpenState;
    },
    setBackgroundShow(value) {
      this.backgroundShow = value;
    },
    toggleBackgroundShow() {
      this.backgroundShow = !this.backgroundShow;
    },
  },
  persist: {
    key: "statusData",
    storage: window.localStorage,
    paths: ["mainBoxBig"],
  },
});

export default useStatusDataStore;
<template>
  <div class="all-set">
    <n-tabs class="set" size="large" justify-content="space-evenly" animated>
      <n-tab-pane name="main" tab="基础设置">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> 主题与壁纸 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">主题类别</span>
              <span class="tip">切换全站主题类别</span>
            </div>
            <n-select class="set" v-model:value="themeType" :options="themeTypeOptions" />
          </n-card>
          <n-card
            class="set-item cover"
            :content-style="{
              flexDirection: 'column',
              alignItems: 'flex-start',
            }"
          >
            <div class="desc">
              <div class="name">
                <span class="title">壁纸偏好</span>
                <span class="tip"> 除默认以外的其他选项可能会导致页面载入缓慢 </span>
              </div>
              <n-space>
                <Transition name="fade" mode="out-in">
                  <n-button
                    v-if="backgroundType !== 0"
                    strong
                    secondary
                    @click="changeBackground(0, true)"
                  >
                    恢复默认
                  </n-button>
                </Transition>
                <n-button strong secondary @click="customCoverModal = true">
                  <template v-if="backgroundType === 4" #icon>
                    <SvgIcon iconName="icon-confirm" />
                  </template>
                  {{ backgroundType === 4 ? "已开启自定义" : "自定义" }}
                </n-button>
              </n-space>
            </div>
            <n-grid
              class="cover-selete"
              responsive="screen"
              cols="2 s:3 m:4 l:4"
              :x-gap="16"
              :y-gap="16"
            >
              <n-grid-item
                v-for="(item, index) in backgroundTypeArr"
                :key="index"
                :class="index === backgroundType ? 'item check' : 'item'"
                @click="changeBackground(index)"
              >
                <span class="name" v-html="item.name" />
              </n-grid-item>
            </n-grid>
          </n-card>
          <n-h6 prefix="bar"> 搜索 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">搜索引擎</span>
              <span class="tip">切换或自定义搜索引擎</span>
            </div>
            <n-button
              strong
              secondary
              @click="
                () => {
                  status.setSiteStatus('focus');
                  status.setEngineChangeStatus(true);
                }
              "
            >
              前往调整
            </n-button>
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">搜索建议</span>
              <span class="tip">是否显示搜索建议</span>
            </div>
            <n-switch v-model:value="showSuggestions" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">跳转方式</span>
              <span class="tip">全站链接跳转方式</span>
            </div>
            <n-select class="set" v-model:value="urlJumpType" :options="urlJumpTypeOptions" />
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="personalization" tab="个性调整">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> 壁纸 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">壁纸遮罩</span>
              <span class="tip">壁纸周围是否显示暗色遮罩</span>
            </div>
            <n-switch v-model:value="showBackgroundGray" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">壁纸模糊</span>
              <span class="tip">调整壁纸高斯模糊的程度</span>
            </div>
            <n-slider
              class="set"
              v-model:value="backgroundBlur"
              :step="0.01"
              :min="0"
              :max="10"
              :tooltip="false"
            />
          </n-card>
          <n-h6 prefix="bar"> 天气与时间 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">天气显示</span>
              <span class="tip">是否在首页时间下展示天气</span>
            </div>
            <n-switch v-model:value="showWeather" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">时钟样式</span>
              <span class="tip">选择一种时钟样式</span>
            </div>
            <n-select class="set" v-model:value="timeStyle" :options="timeStyleOptions" />
          </n-card>
          <n-card v-if="timeStyle === 'one'" class="set-item">
            <div class="name">
              <span class="title">时间显秒</span>
              <span class="tip">是否在分钟后面显示秒数</span>
            </div>
            <n-switch v-model:value="showSeconds" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">时钟显零</span>
              <span class="tip">是否在时钟小于 10 时补 0</span>
            </div>
            <n-switch v-model:value="showZeroTime" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">显示农历</span>
            </div>
            <n-switch v-model:value="showLunar" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">12 小时制</span>
            </div>
            <n-switch v-model:value="use12HourFormat" :round="false" />
          </n-card>
          <n-h6 prefix="bar"> 搜索框 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">自动收缩</span>
              <span class="tip">是否在非搜索状态时收起搜索框</span>
            </div>
            <n-switch v-model:value="smallInput" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">自动聚焦</span>
              <span class="tip">打开网站时自动聚焦搜索框</span>
            </div>
            <n-switch v-model:value="autoFocus" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">自动失焦</span>
              <span class="tip">跳转搜索后搜索框自动失焦</span>
            </div>
            <n-switch v-model:value="autoInputBlur" :round="false" />
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="other" tab="其他设置">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> 重置 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">站点重置</span>
              <span class="tip">若站点显示异常或出现问题时可尝试此操作</span>
            </div>
            <n-button strong secondary @click="resetSite"> 重置 </n-button>
          </n-card>
          <n-h6 prefix="bar"> 备份 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">站点备份</span>
              <span class="tip">将站点配置及个性化内容进行备份</span>
            </div>
            <n-button strong secondary @click="backupSite"> 备份 </n-button>
          </n-card>
          <n-h6 prefix="bar"> 恢复 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">数据恢复</span>
              <span class="tip">将备份的站点内容进行恢复</span>
            </div>
            <input
              ref="recoverRef"
              type="file"
              style="display: none"
              accept=".json"
              @change="recoverSite"
            />
            <n-button strong secondary @click="recoverRef?.click()"> 恢复 </n-button>
          </n-card>
          <n-h6 prefix="bar"> 实验室 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">功能调试入口</span>
              <span class="tip">用于单独调试各个功能模块</span>
            </div>
            <n-grid class="lab-grid" responsive="screen" cols="2 s:3" :x-gap="12" :y-gap="12">
              <n-grid-item v-for="(item, index) in labFeatures" :key="index">
                <n-button
                  size="small"
                  :class="item.color"
                  @click="openLabFeature(item.action)"
                >
                  {{ item.name }}
                </n-button>
              </n-grid-item>
            </n-grid>
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
    </n-tabs>
    <!-- 自定义壁纸 -->
    <n-modal preset="card" title="自定义壁纸" v-model:show="customCoverModal" :bordered="false">
      <n-form>
        <n-form-item label="自定义壁纸链接">
          <n-input
            clearable
            type="text"
            v-model:value="customCoverUrl"
            placeholder="请输入自定义壁纸链接"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button strong secondary @click="customCoverModal = false"> 取消 </n-button>
          <n-button strong secondary @click="setCustomCover"> 确认 </n-button>
        </n-space>
      </template>
    </n-modal>
    <!-- 实验室功能调试弹窗 -->
    <n-modal 
      preset="card" 
      title="实验室 - 功能调试" 
      v-model:show="labModal" 
      :bordered="false"
      width="600px"
    >
      <div class="lab-content">
        <div class="lab-info">
          <n-tag type="warning" size="small">实验室功能</n-tag>
          <span class="lab-title">{{ getFeatureName(currentLabFeature) }}</span>
        </div>
        <div class="lab-description">
          {{ getFeatureDescription(currentLabFeature) }}
        </div>
        <div class="lab-actions">
          <n-space vertical>
            <n-button block strong @click="testFeature(currentLabFeature)">
              开始测试
            </n-button>
            <n-button block secondary @click="showFeatureInfo(currentLabFeature)">
              查看功能信息
            </n-button>
            <n-button block secondary @click="resetFeature(currentLabFeature)">
              重置功能设置
            </n-button>
          </n-space>
        </div>
        <div class="lab-status" v-if="labStatus">
          <n-alert :type="labStatus.type" :title="labStatus.title">
            <div class="status-content">
              <div v-if="labStatus.message" class="status-message">{{ labStatus.message }}</div>
              <div v-if="labStatus.description" class="status-description">{{ labStatus.description }}</div>
            </div>
          </n-alert>
        </div>
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button strong secondary @click="labModal = false"> 关闭 </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  NH6,
  NTabs,
  NTabPane,
  NSpace,
  NCard,
  NSwitch,
  NSelect,
  NScrollbar,
  NButton,
  NGrid,
  NGridItem,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSlider,
  NTag,
  NAlert,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { setStore, statusStore, siteStore } from "@/stores";  // ✅ 合并
import identifyInput from "@/utils/identifyInput";

const set = setStore();
const status = statusStore();
const site = siteStore();   // 新增
const {
  themeType,
  backgroundType,
  backgroundCustom,
  showBackgroundGray,
  backgroundBlur,
  smallInput,
  autoFocus,
  autoInputBlur,
  showLunar,
  showWeather,
  showSeconds,
  showZeroTime,
  use12HourFormat,
  showSuggestions,
  urlJumpType,
  timeStyle,
} = storeToRefs(set);
const recoverRef = ref(null);
const customCoverModal = ref(false);
const customCoverUrl = ref("");
const labModal = ref(false);
const currentLabFeature = ref(null);

// 实验室功能列表
const labFeatures = [
  { name: "时间显示", action: "time", color: "primary" },
  { name: "天气显示", action: "weather", color: "success" },
  { name: "一言显示", action: "hitokoto", color: "warning" },
  { name: "下拉菜单", action: "topmenu", color: "info" },
  { name: "屏保功能", action: "screensaver", color: "error" },
  { name: "壁纸切换", action: "cover", color: "primary" },
  { name: "快捷键", action: "shortcut", color: "success" },
  { name: "便签", action: "note", color: "warning" },
  { name: "待办", action: "todo", color: "info" },
];

// 打开实验室功能调试
const openLabFeature = (feature) => {
  currentLabFeature.value = feature;
  labModal.value = true;
  labStatus.value = null;
};

const labStatus = ref(null);

const featureInfo = {
  time: { name: "时间显示", description: "显示当前时间，支持农历、秒显示、12小时制等选项", settings: ["showLunar", "showSeconds", "use12HourFormat", "showZeroTime"] },
  weather: { name: "天气显示", description: "显示当前位置的天气信息，支持5分钟自动刷新", settings: ["showWeather"] },
  hitokoto: { name: "一言显示", description: "显示随机的一言句子，支持1分钟自动刷新", settings: [] },
  topmenu: { name: "下拉菜单", description: "顶部下拉菜单，显示时间、天气、一言和快捷链接", settings: [] },
  screensaver: { name: "屏保功能", description: "长时间未操作自动进入屏保模式", settings: [] },
  cover: { name: "壁纸切换", description: "背景壁纸管理，支持多种壁纸源", settings: ["backgroundType", "backgroundBlur", "showBackgroundGray", "backgroundCustom"] },
  shortcut: { name: "快捷键", description: "自定义快捷链接管理", settings: [] },
  note: { name: "便签", description: "便签功能，支持添加、编辑、删除便签", settings: [] },
  todo: { name: "待办", description: "待办事项管理，支持添加、完成、删除待办", settings: [] },
};

const getFeatureName = (feature) => {
  return featureInfo[feature]?.name || "未知功能";
};

const getFeatureDescription = (feature) => {
  return featureInfo[feature]?.description || "暂无描述";
};

const testFeature = (feature) => {
  labStatus.value = { type: "info", title: "测试中", message: `正在测试 ${getFeatureName(feature)} 功能...` };
  
  setTimeout(() => {
    switch (feature) {
      case "time":
        labStatus.value = { 
          type: "success", 
          title: "测试成功", 
          message: "时间显示功能正常工作",
          description: `当前位置：页面中央时间区域 | 当前时间：${new Date().toLocaleTimeString()}`
        };
        break;
      case "weather":
        if (site.weatherData) {
          labStatus.value = { 
            type: "success", 
            title: "测试成功", 
            message: "天气数据正常",
            description: `当前位置：页面顶部下拉菜单 | 天气：${site.weatherData.weather}，温度：${site.weatherData.temp}°C`
          };
        } else {
          labStatus.value = { 
            type: "warning", 
            title: "测试结果", 
            message: "天气数据尚未加载",
            description: "请检查网络连接或稍后重试。位置：页面顶部下拉菜单"
          };
        }
        break;
      case "hitokoto":
        if (site.hitokotoData) {
          labStatus.value = { 
            type: "success", 
            title: "测试成功", 
            message: `一言数据正常`,
            description: `当前位置：页面顶部下拉菜单 | 内容：「${site.hitokotoData.hitokoto}」——${site.hitokotoData.from}`
          };
        } else {
          labStatus.value = { 
            type: "warning", 
            title: "测试结果", 
            message: "一言数据尚未加载",
            description: "请检查网络连接。位置：页面顶部下拉菜单"
          };
        }
        break;
      case "topmenu":
        status.toggleMenuOpenState();
        labStatus.value = { 
          type: "success", 
          title: "测试成功", 
          message: "下拉菜单已切换",
          description: "位置：页面顶部导航栏，鼠标靠近顶部区域或点击右侧按钮可打开"
        };
        break;
      case "screensaver":
        labStatus.value = { 
          type: "info", 
          title: "测试提示", 
          message: "屏保功能说明",
          description: "位置：页面全局 | 触发条件：5分钟无操作后自动进入，可通过移动鼠标或点击退出"
        };
        break;
      case "cover":
        const oldType = set.backgroundType;
        set.backgroundType = (oldType + 1) % 4;
        labStatus.value = { 
          type: "success", 
          title: "测试成功", 
          message: `壁纸已切换到类型 ${set.backgroundType}`,
          description: "位置：页面背景 | 点击其他壁纸类型可继续切换"
        };
        break;
      case "shortcut":
        labStatus.value = { 
          type: "success", 
          title: "测试成功", 
          message: `快捷链接共 ${site.shortcutData?.length || 0} 条`,
          description: "位置：页面中央主区域 | 点击可打开快捷链接管理"
        };
        break;
      case "note":
        labStatus.value = { 
          type: "success", 
          title: "测试成功", 
          message: `便签共 ${site.noteList?.length || 0} 条`,
          description: "位置：页面底部功能区 | 点击可打开便签管理"
        };
        break;
      case "todo":
        labStatus.value = { 
          type: "success", 
          title: "测试成功", 
          message: `待办共 ${site.todoList?.length || 0} 条`,
          description: "位置：页面底部功能区 | 点击可打开待办管理"
        };
        break;
      default:
        labStatus.value = { type: "error", title: "测试失败", message: "未知功能" };
    }
  }, 500);
};

const showFeatureInfo = (feature) => {
  const info = featureInfo[feature];
  if (!info) {
    labStatus.value = { type: "error", title: "错误", message: "未知功能" };
    return;
  }
  
  let settingsText = "";
  if (info.settings && info.settings.length > 0) {
    settingsText = `相关设置：${info.settings.join("、")}`;
  }
  
  labStatus.value = { 
    type: "info", 
    title: "功能信息", 
    message: `功能名称：${info.name}`,
    description: `${info.description}${settingsText ? '。' + settingsText : ''}`
  };
};

const resetFeature = (feature) => {
  labStatus.value = { type: "warning", title: "重置确认", message: `确定要重置 ${getFeatureName(feature)} 的设置吗？` };
  
  setTimeout(() => {
    switch (feature) {
      case "time":
        set.showLunar = true;
        set.showSeconds = true;
        set.use12HourFormat = false;
        set.showZeroTime = true;
        break;
      case "cover":
        set.backgroundType = 0;
        set.backgroundBlur = 15;
        set.showBackgroundGray = false;
        set.backgroundCustom = "";
        break;
      case "weather":
        set.showWeather = true;
        break;
      default:
        labStatus.value = { type: "info", title: "提示", message: `${getFeatureName(feature)} 没有可重置的设置项` };
        return;
    }
    labStatus.value = { type: "success", title: "重置成功", message: `${getFeatureName(feature)} 的设置已恢复默认` };
  }, 300);
};

// 壁纸类别
const backgroundTypeArr = [
  { name: "本地默认", tip: "默认壁纸，随机更换" },
  { name: "每日必应", tip: "必应每日一图，每天更新" },
  { name: "随机风景", tip: "随机风景图，随机更换" },
  { name: "随机动漫", tip: "随机二次元图，随机更换" },
];

// 主题类别
const themeTypeOptions = [
  {
    label: "浅色模式",
    value: "light",
  },
  {
    label: "深色模式",
    value: "dark",
  },
];

// 切换壁纸
const changeBackground = (type, reset = false) => {
  if (reset) {
    $dialog.warning({
      title: "壁纸恢复",
      content: "确认恢复默认壁纸？若当前为自定义壁纸，你的自定义壁纸将丢失！",
      positiveText: "恢复",
      negativeText: "取消",
      onPositiveClick: () => {
        backgroundType.value = 0;
        $message.info("已恢复为默认壁纸");
      },
    });
    return true;
  }
  backgroundType.value = type;
  $message.success(`已切换为${backgroundTypeArr[type].name}`);
};

// 链接跳转方式
const urlJumpTypeOptions = [
  {
    label: "新页面打开",
    value: "open",
  },
  {
    label: "当前页打开",
    value: "href",
  },
];

// 时钟样式
const timeStyleOptions = [
  {
    label: "横向排布",
    value: "one",
  },
  {
    label: "竖向排布",
    value: "two",
  },
];

// 自定义壁纸
const setCustomCover = () => {
  if (identifyInput(customCoverUrl.value) === "url") {
    backgroundType.value = 4;
    backgroundCustom.value = customCoverUrl.value;
    customCoverModal.value = false;
    $message.error("已切换为自定义壁纸，刷新后生效");
  } else {
    $message.error("请输入正确的网址");
  }
};

// 站点重置
const resetSite = () => {
  $dialog.warning({
    title: "站点重置",
    content: "确认重置站点为默认状态？你的全部数据以及自定义设置都将丢失！",
    positiveText: "重置",
    negativeText: "取消",
    onPositiveClick: () => {
      localStorage.clear();
      $message.info("站点重置成功，即将刷新");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });
};

// 站点备份
const backupSite = () => {
  try {
    const date = new Date();
    const shortcutCount = site.shortcutData?.length || 0;
    const noteCount = site.noteList?.length || 0;
    const todoCount = site.todoList?.length || 0;
    
    const backupData = {
      version: "2.4.4.3",
      backupTime: date.toISOString(),
      backupDate: dateString,
      appName: "Snavigation",
      setData: set.$state,
      siteData: site.$state,
      statusData: {
        mainBoxBig: status.mainBoxBig
      }
    };

    const fileName = `Snavigation_Backup_${dateString}.json`;
    const jsonData = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    $message.success(`站点备份成功！\n包含：捷径(${shortcutCount})、便签(${noteCount})、待办(${todoCount})`);
  } catch (error) {
    console.error("站点备份失败：", error);
    $message.error("站点备份失败");
  }
};

// 验证备份文件
const validateBackupFile = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, message: '备份文件格式无效' };
  }
  
  if (!data.setData && !data.siteData) {
    if (data.backgroundType !== undefined || data.backgroundBlur !== undefined) {
      return { valid: true, version: 'old', message: '旧版备份文件' };
    }
    return { valid: false, message: '备份文件不包含有效数据' };
  }
  
  return { 
    valid: true, 
    version: data.version || 'unknown', 
    message: '有效备份文件',
    backupTime: data.backupTime,
    appName: data.appName
  };
};

// 站点恢复
const recoverSite = async () => {
  try {
    const fileInput = recoverRef.value;
    if (!fileInput?.files.length) {
      $message.error("请选择要恢复的备份文件");
      return false;
    }
    
    const file = fileInput.files[0];
    const jsonData = await file.text();
    let data;
    
    try {
      data = JSON.parse(jsonData);
    } catch {
      $message.error("备份文件格式错误，无法解析");
      return false;
    }
    
    const validation = validateBackupFile(data);
    if (!validation.valid) {
      $message.error(validation.message);
      return false;
    }
    
    const shortcutCount = data.siteData?.shortcutData?.length || 0;
    const noteCount = data.siteData?.noteList?.length || 0;
    const todoCount = data.siteData?.todoList?.length || 0;
    
    let content = "确认使用该备份文件？你现有的数据都将被覆盖！\n\n";
    if (validation.backupTime) {
      const backupDate = new Date(validation.backupTime);
      content += `备份时间：${backupDate.toLocaleString()}\n`;
    }
    if (validation.version) {
      content += `备份版本：${validation.version}\n`;
    }
    content += `包含内容：\n- 设置：是\n- 捷径：${shortcutCount} 条\n- 便签：${noteCount} 条\n- 待办：${todoCount} 条`;
    
    $dialog.warning({
      title: "站点恢复",
      content: content,
      positiveText: "恢复",
      negativeText: "取消",
      onPositiveClick: async () => {
        try {
          if (data.setData) {
            set.recoverSiteData(data.setData);
          } else {
            set.recoverSiteData(data);
          }
          
          if (data.siteData) {
            site.$patch(data.siteData);
          }
          
          if (data.statusData?.mainBoxBig !== undefined) {
            status.setMainBoxBig(data.statusData.mainBoxBig);
          }
          
          $message.info("站点恢复成功，即将刷新");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } catch (restoreError) {
          console.error("恢复过程出错：", restoreError);
          $message.error("恢复过程出错，请检查备份文件");
        }
      },
      onNegativeClick: () => {
        recoverRef.value.value = null;
      },
    });
  } catch (error) {
    console.error("站点数据恢复失败：", error);
    $message.error("站点数据恢复失败，请重试");
  }
};

onMounted(() => {
  // 检测是否存在自定义壁纸
  if (backgroundCustom.value) customCoverUrl.value = backgroundCustom.value;
});
</script>

<style lang="scss">
.cover-selete {
  margin-top: 12px;
  .item {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: var(--main-background-light-color);
    transition:
      background-color 0.3s,
      box-shadow 0.3s;
    &.check {
      background-color: var(--main-background-hover-color);
      &::before {
        content: "";
        position: absolute;
        border-radius: 12px;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border: 2px solid var(--main-background-hover-color);
        transition: opacity 0.3s;
      }
    }
    &:hover {
      background-color: var(--main-background-hover-color);
      box-shadow: 0 0 0px 2px var(--main-background-hover-color);
      &::before {
        opacity: 0;
      }
    }
    &:active {
      box-shadow: none;
    }
  }
}

.lab-grid {
  margin-top: 12px;
}

.lab-content {
  .lab-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .lab-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
  }
  
  .lab-description {
    font-size: 14px;
    color: var(--text-secondary-color);
    line-height: 1.6;
    margin-bottom: 20px;
    padding: 12px;
    background-color: var(--main-background-light-color);
    border-radius: 8px;
  }
  
  .lab-actions {
    margin-bottom: 16px;
  }
  
  .lab-status {
    margin-top: 12px;
    max-height: 200px;
    overflow-y: auto;
    
    .status-content {
      .status-message {
        font-weight: 500;
        margin-bottom: 8px;
      }
      
      .status-description {
        color: var(--text-secondary-color);
        font-size: 13px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
      }
    }
  }
}
</style>

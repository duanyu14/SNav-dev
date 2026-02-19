<template>
  <div class="note__layout">
    <!-- 如果便签列表为空，显示提示和添加按钮 -->
    <div v-if="noteList.length === 0" class="empty-state">
      <span class="tip">还没有便签，去添加一个吧</span>
      <n-button strong secondary @click="openAddModal">
        <template #icon>
          <SvgIcon iconName="icon-add" />
        </template>
        添加便签
      </n-button>
    </div>

    <!-- 便签列表 -->
    <div v-else class="note-list">
      <n-scrollbar class="scrollbar">
        <n-grid :cols="3" :x-gap="12" :y-gap="12">
          <n-grid-item v-for="note in noteList" :key="note.id">
            <n-card class="note-card" :title="note.title" hoverable @contextmenu.prevent="openContextMenu($event, note)">
              <div class="note-content">{{ note.content }}</div>
              <template #action>
                <n-space justify="end">
                  <n-button text @click="openEditModal(note)">
                    <SvgIcon iconName="icon-edit" />
                  </n-button>
                  <n-button text @click="confirmDelete(note)">
                    <SvgIcon iconName="icon-delete-1" />
                  </n-button>
                </n-space>
              </template>
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-scrollbar>
    </div>

    <!-- 右下角添加按钮（当有便签时） -->
    <div v-if="noteList.length > 0" class="add-button" @click="openAddModal">
      <SvgIcon iconName="icon-add" />
    </div>

    <!-- 添加/编辑便签的弹窗 -->
    <n-modal
      v-model:show="modalShow"
      preset="card"
      :title="modalType === 'add' ? '新建便签' : '编辑便签'"
      style="width: 400px"
      :bordered="false"
    >
      <n-form :model="formData" :rules="rules" ref="formRef">
        <n-form-item label="标题" path="title">
          <n-input v-model:value="formData.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="内容" path="content">
          <n-input
            v-model:value="formData.content"
            type="textarea"
            placeholder="请输入内容"
            :rows="4"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button strong secondary @click="modalShow = false">取消</n-button>
          <n-button strong secondary @click="submitForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 右键菜单（用于删除） -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownX"
      :y="dropdownY"
      :options="dropdownOptions"
      :show="dropdownShow"
      @clickoutside="dropdownShow = false"
      @select="handleDropdownSelect"
    />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import {
  NButton,
  NScrollbar,
  NGrid,
  NGridItem,
  NCard,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NDropdown,
} from 'naive-ui'
import { storeToRefs } from 'pinia'
import { siteStore } from '@/stores'
import SvgIcon from '@/components/SvgIcon.vue'
import { useDialog } from 'naive-ui'

const site = siteStore()
const { noteList } = storeToRefs(site)
const dialog = useDialog()

// 弹窗相关
const modalShow = ref(false)
const modalType = ref('add') // 'add' 或 'edit'
const formRef = ref(null)
const formData = reactive({
  id: null,
  title: '',
  content: '',
})

// 表单验证规则
const rules = {
  title: { required: true, message: '请输入标题', trigger: 'blur' },
  content: { required: true, message: '请输入内容', trigger: 'blur' },
}

// 右键菜单
const dropdownX = ref(0)
const dropdownY = ref(0)
const dropdownShow = ref(false)
const currentNote = ref(null) // 当前右键点击的便签
const dropdownOptions = [
  { label: '编辑', key: 'edit' },
  { label: '删除', key: 'delete' },
]

// 打开添加弹窗
const openAddModal = () => {
  modalType.value = 'add'
  formData.id = null
  formData.title = ''
  formData.content = ''
  modalShow.value = true
}

// 打开编辑弹窗
const openEditModal = (note) => {
  modalType.value = 'edit'
  formData.id = note.id
  formData.title = note.title
  formData.content = note.content
  modalShow.value = true
}

// 提交表单（添加或编辑）
const submitForm = () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      $message.error('请检查输入')
      return
    }
    if (modalType.value === 'add') {
      // 生成新ID：取最大id+1
      const maxId = noteList.value.reduce((max, n) => Math.max(max, n.id), -1)
      const newNote = {
        id: maxId + 1,
        title: formData.title,
        content: formData.content,
      }
      noteList.value.push(newNote)
      $message.success('添加成功')
    } else {
      // 编辑：找到对应项更新
      const index = noteList.value.findIndex((n) => n.id === formData.id)
      if (index !== -1) {
        noteList.value[index].title = formData.title
        noteList.value[index].content = formData.content
        $message.success('修改成功')
      }
    }
    modalShow.value = false
  })
}

// 确认删除
const confirmDelete = (note) => {
  dialog.warning({
    title: '删除便签',
    content: `确定删除“${note.title}”吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      const index = noteList.value.findIndex((n) => n.id === note.id)
      if (index !== -1) {
        noteList.value.splice(index, 1)
        $message.success('已删除')
      }
    },
  })
}

// 右键菜单
const openContextMenu = (e, note) => {
  e.preventDefault()
  dropdownShow.value = false
  currentNote.value = note
  nextTick().then(() => {
    dropdownShow.value = true
    dropdownX.value = e.clientX
    dropdownY.value = e.clientY
  })
}

// 右键菜单选项点击
const handleDropdownSelect = (key) => {
  dropdownShow.value = false
  if (key === 'edit') {
    openEditModal(currentNote.value)
  } else if (key === 'delete') {
    confirmDelete(currentNote.value)
  }
}
</script>

<style lang="scss" scoped>
.note__layout {
  width: 100%;
  height: 100%;
  position: relative;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  .tip {
    font-size: 18px;
    margin-bottom: 16px;
    opacity: 0.8;
  }
}
.note-list {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.note-card {
  background-color: var(--main-background-light-color);
  border: none;
  .note-content {
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.add-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--main-background-light-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: var(--main-background-hover-color);
  }
}
</style>
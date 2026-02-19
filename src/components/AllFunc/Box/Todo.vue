<template>
  <div class="todo__layout">
    <!-- 添加待办输入框 -->
    <div class="add-todo">
      <n-input
        v-model:value="newTodoText"
        placeholder="输入待办事项，按回车添加"
        @keyup.enter="addTodo"
        clearable
      />
    </div>

    <!-- 待办列表 -->
    <div v-if="todoList.length > 0" class="todo-list">
      <n-scrollbar class="scrollbar">
        <n-list>
          <n-list-item v-for="todo in sortedTodos" :key="todo.id">
            <div class="todo-item">
              <n-checkbox v-model:checked="todo.completed" @update:checked="saveTodos">
                <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
              </n-checkbox>
              <n-space>
                <n-button text @click="openEditModal(todo)">
                  <SvgIcon iconName="icon-edit" />
                </n-button>
                <n-button text @click="confirmDelete(todo)">
                  <SvgIcon iconName="icon-delete-1" />
                </n-button>
              </n-space>
            </div>
          </n-list-item>
        </n-list>
      </n-scrollbar>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <span class="tip">暂无待办，添加一条吧</span>
    </div>

    <!-- 编辑待办弹窗 -->
    <n-modal
      v-model:show="editModalShow"
      preset="card"
      title="编辑待办"
      style="width: 400px"
      :bordered="false"
    >
      <n-input v-model:value="editText" placeholder="请输入新内容" />
      <template #footer>
        <n-space justify="end">
          <n-button strong secondary @click="editModalShow = false">取消</n-button>
          <n-button strong secondary @click="saveEdit">保存</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  NInput,
  NButton,
  NScrollbar,
  NList,
  NListItem,
  NCheckbox,
  NSpace,
  NModal,
} from 'naive-ui'
import { storeToRefs } from 'pinia'
import { siteStore } from '@/stores'
import SvgIcon from '@/components/SvgIcon.vue'
import { useDialog } from 'naive-ui'

const site = siteStore()
const { todoList } = storeToRefs(site)
const dialog = useDialog()

// 新待办输入
const newTodoText = ref('')

// 添加待办
const addTodo = () => {
  const text = newTodoText.value.trim()
  if (!text) {
    $message.warning('请输入内容')
    return
  }
  const maxId = todoList.value.reduce((max, t) => Math.max(max, t.id), -1)
  todoList.value.push({
    id: maxId + 1,
    text,
    completed: false,
  })
  newTodoText.value = ''
  $message.success('添加成功')
}

// 排序：未完成的在前，已完成的在后
const sortedTodos = computed(() => {
  return [...todoList.value].sort((a, b) => {
    if (a.completed === b.completed) return 0
    return a.completed ? 1 : -1
  })
})

// 保存（其实直接修改了数组，但为了通知Pinia，可以直接修改，因为数组是响应式的）
const saveTodos = () => {
  // 不需要额外操作，复选框已经双向绑定
}

// 编辑相关
const editModalShow = ref(false)
const editText = ref('')
const editingTodo = ref(null)

const openEditModal = (todo) => {
  editingTodo.value = todo
  editText.value = todo.text
  editModalShow.value = true
}

const saveEdit = () => {
  if (!editText.value.trim()) {
    $message.warning('内容不能为空')
    return
  }
  if (editingTodo.value) {
    editingTodo.value.text = editText.value
    editModalShow.value = false
    $message.success('修改成功')
  }
}

// 删除确认
const confirmDelete = (todo) => {
  dialog.warning({
    title: '删除待办',
    content: `确定删除“${todo.text}”吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      const index = todoList.value.findIndex((t) => t.id === todo.id)
      if (index !== -1) {
        todoList.value.splice(index, 1)
        $message.success('已删除')
      }
    },
  })
}
</script>

<style lang="scss" scoped>
.todo__layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}
.add-todo {
  margin-bottom: 16px;
}
.todo-list {
  flex: 1;
  overflow: hidden;
}
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .completed {
    text-decoration: line-through;
    opacity: 0.6;
  }
}
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .tip {
    font-size: 18px;
    opacity: 0.8;
  }
}
</style>
<template>
  <n-tabs class="all-box" size="large" justify-content="space-evenly" animated>
    <n-tab-pane class="no-padding height--full" name="link" tab="捷径">
      <ShortCut />
    </n-tab-pane>
    <n-tab-pane class="no-padding height--full" name="note" tab="便签">
      <Note />
    </n-tab-pane>
    <n-tab-pane class="no-padding height--full" name="more" tab="待办">
      <Todo />
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { NTabs, NTabPane } from "naive-ui";
import ShortCut from "@/components/AllFunc/Box/ShortCut.vue";
import Note from "@/components/AllFunc/Box/Note.vue";   // 导入便签组件
import Todo from "@/components/AllFunc/Box/Todo.vue";   // 导入待办组件
</script>
<style>
.height--full {
  height: 100%;
}
</style>
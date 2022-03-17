<template>
  <a-card>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="设置任务">
        <SettingTask></SettingTask>
      </a-tab-pane>
      <a-tab-pane key="2" tab="查看任务">
        开发中...
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import SettingTask from './SettingTask.vue';

const activeKey = ref('1');
</script>

<style scoped>

</style>

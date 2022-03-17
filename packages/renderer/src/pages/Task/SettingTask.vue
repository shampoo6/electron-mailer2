<template>
  <div>
    <a-form
      layout="inline"
    >
      <a-form-item label="模板">
        <TemplateSelector v-model:selected-id="selectedId" v-model:templates="templates"
                          v-model:template-list="templateList"></TemplateSelector>
      </a-form-item>
      <a-form-item label="寄件时间">
        <a-time-picker v-model:value="time">
        </a-time-picker>
      </a-form-item>
    </a-form>
    <a-calendar @select="onSelect" :disabledDate="disabledDate">
      <template #dateCellRender="{ current }">
        <div v-if="tasks[current.format('yyyy-MM-DD')]">
          <div>{{ getTemplateName(tasks[current.format('yyyy-MM-DD')]) }}</div>
          <div>{{ getTaskPrepareSendTime(tasks[current.format('yyyy-MM-DD')].prepareSendTime) }}</div>
          <div>
            <a-badge v-if="tasks[current.format('yyyy-MM-DD')].state === TaskState.Waiting" status="default" text="等待中" />
            <a-badge v-else-if="tasks[current.format('yyyy-MM-DD')].state === TaskState.Running" status="warning" text="执行中" />
            <a-badge v-else-if="tasks[current.format('yyyy-MM-DD')].state === TaskState.Fail" status="error" text="失败" />
            <a-badge v-else status="success" text="成功" />
          </div>
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, reactive, ref} from 'vue';
import TemplateSelector from '/@/components/TemplateSelector.vue';
import {Moment} from 'moment';
import moment from 'moment';
import {message, notification} from 'ant-design-vue';
import {TaskState} from '/@/constants/taskState';
import {Task} from '/@/model/task';
import taskApi from '/@/api/task';

const selectedId = ref(null);
const time = ref(null);
const templates = ref(reactive({}));

// tasks 是一个用年月日来代表key的对象
// key 格式为：yyyy-MM-dd
// 一天只能填写一个计划不能多选
const tasks: any = ref(reactive({}));
const templateList = ref(reactive([]));

const onSelect = (current: Moment) => {
  let key = current.format('yyyy-MM-DD');
  if (tasks._rawValue[key]) {
    taskApi.remove(key);
    list();
    return;
  }

  if (templateList.value.length === 0) {
    message.error('没有模板');
    return;
  }

  if (!time.value) {
    message.error('请选择时间');
    return;
  }

  let now = moment();

  let t: Moment = moment(time.value);
  t.year(current.year());
  t.month(current.month());
  t.date(current.date());

  if (now.isSame(current, 'd') && t.isBefore(current)) {
    message.error('不能选择过去的时间');
    return;
  }

  let task: any = {
    id: key,
    templateId: selectedId.value,
    prepareSendTime: Number(t.format('x')),
    sendTime: 0,
    state: TaskState.Waiting,
    msg: '创建任务',
  };
  taskApi.add(task);
  list();
};

const list = () => {
  tasks.value = taskApi.list();
};

const disabledDate = (current: Moment) => {
  const now = moment();
  return now.isAfter(current) && !now.isSame(current, 'd');
};

const getTemplateName = (task: Task) => {
  const template = (templates as any)._rawValue[task.templateId];
  return template ? template.name : '';
};

const getTaskPrepareSendTime = (time: number) => {
  return moment(time).format('HH:mm:ss');
};

onMounted(() => {
  list();

  nextTick(() => {
    if (templateList.value.length === 0) {
      notification.warning({
        message: '没有模板',
        description: '您还没有配置邮件模板，请转到模板管理页进行设置'
      });
      return;
    }
  });
});
</script>

<style scoped>
</style>

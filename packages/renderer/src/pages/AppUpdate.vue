<template>
  <div class="bg">
    <h1>{{ percent === 100 ? '更新完成' : '更新中' }}</h1>
    <a-progress type="circle" :percent="percent"/>
    <div class="info">
      速度: {{ speed }} {{
        speed > 1000000 ? 'mb/s' :
          speed > 1000 ? 'kb/s' : 'b/s'
      }}; {{ `${transferred}/${total}` }} 已下载/总量
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';

const percent = ref(0);
const speed = ref(0);
const transferred = ref(0);
const total = ref(0);

// 注册监听信息
window.ipcReceive('checkUpdate/info', (message: any) => {
  try {
    const info = JSON.parse(message);
    percent.value = info.percent;
    speed.value = info.speed;
    transferred.value = info.transferred;
    total.value = info.total;
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped lang="scss">
.bg {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.info {
  padding-top: 32px;
}
</style>

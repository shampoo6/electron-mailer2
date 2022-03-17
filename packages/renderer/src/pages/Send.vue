<template>
  <div>
    <a-card class="info">
      <a-descriptions title="模板信息" layout="vertical">
        <a-descriptions-item label="选择模板">
          <TemplateSelector ref="ts" v-model:selected-id="selectedId" v-model:templates="templates"
                            v-model:templateList="templateList" @change="onSelectChange"></TemplateSelector>
        </a-descriptions-item>
        <a-descriptions-item label="模板描述">
          {{ description }}
        </a-descriptions-item>
        <a-descriptions-item label="操作">
          <a-button type="primary" @click="send" :loading="loading">发送</a-button>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card class="content">
      <MailEditor ref="me"></MailEditor>
    </a-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, reactive, toRefs} from 'vue';
import MailEditor from '/@/components/MailEditor.vue';
import TemplateSelector from '/@/components/TemplateSelector.vue';
import mailerApi from '/@/api/mailer';
import {Mail} from '/@/model/mail';
import {message, notification} from 'ant-design-vue';

export default defineComponent({
  setup() {
    const state = reactive({
      loading: false,
      selectedId: '',
      templates: {},
      templateList: [] as Mail[],
      name: '',
      description: ''
    });

    const me = ref(null);
    const ts = ref(null);

    const send = () => {
      state.loading = true;
      mailerApi.send((me.value as any).getData()).then(() => {
        message.success('发送成功');
      }).catch(reason => {
        message.error(reason);
      }).finally(() => {
        state.loading = false;
      });
    };

    onMounted(() => {
      (ts as any).value.fetch();

      if (state.templateList.length === 0) {
        notification.warning({
          message: '没有模板',
          description: '您还没有配置邮件模板，请转到模板管理页进行设置'
        });
        return;
      }

      const t = (state.templates as any)[state.selectedId];
      state.description = t.description;
      (me.value as any).setData(t.mail);
    });

    const onSelectChange = () => {
      const t = (state.templates as any)[state.selectedId];
      state.description = t.description;
      (me.value as any).setData(t.mail);
    };

    return {
      ...toRefs(state),
      me,
      ts,
      send,
      onSelectChange
    };
  },
  components: {
    MailEditor,
    TemplateSelector
  }
});
</script>

<style lang="scss" scoped>
.info {
  position: sticky;
  top: 0;
  z-index: 1;
}

.content {
  position: relative;
  z-index: 0;
}
</style>

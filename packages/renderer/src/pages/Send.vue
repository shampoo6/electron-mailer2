<template>
  <div>
    <a-card class="info">
      <a-descriptions title="模板信息" layout="vertical">
        <a-descriptions-item label="操作">
          <a-button type="primary" @click="send">发送</a-button>
        </a-descriptions-item>
        <a-descriptions-item label="id">
          {{ id }}
        </a-descriptions-item>
        <a-descriptions-item label="模板名称">
          {{ name }}
        </a-descriptions-item>
        <a-descriptions-item label="模板描述">
          {{ description }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card class="content">
      <MailEditor ref="me"></MailEditor>
    </a-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, reactive, toRefs} from "vue";
import MailEditor from "/@/components/MailEditor.vue";
import templateApi from '/@/api/template'
import {Template} from "/@/model/template";
import mailerApi from '/@/api/mailer'

export default defineComponent({
  setup() {
    const state = reactive({
      id: '',
      name: '',
      description: ''
    })

    const me = ref(null)

    const send = () => {
      if (!me.value) return
      let result = mailerApi.send((me.value as any).getData())
      console.log(result)
    }

    onMounted(() => {
      let t: Template = templateApi.getDefaultTemplate();
      state.id = t.id;
      state.name = t.name;
      state.description = t.description;
      (me.value as any).setData(t.mail);
    })

    return {
      ...toRefs(state),
      me,
      send
    };
  },
  components: {
    MailEditor
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

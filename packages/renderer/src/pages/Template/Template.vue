<template>
  <a-card>
    <p>
      <a-form layout="inline">
        <a-form-item
          label="默认模板"
        >
          <TemplateSelector ref="ts" v-model:selected-id="selectedId" v-model:templates="templates"
                            v-model:template-list="templateList"></TemplateSelector>
        </a-form-item>
        <a-form-item>
          <a-button type="text" style="color: #00ff00;" @click="list">刷新</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="saveDefaultTemplateId">保存</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="background-color: #00ff00; border-color: #00ff00;" @click="addTemplate">
            添加模板
          </a-button>
        </a-form-item>
      </a-form>
    </p>
    <p>
      <a-table rowKey="id" :dataSource="templateList" bordered>
        <a-table-column key="id" title="序号" data-index="id"/>
        <a-table-column key="name" title="模板名" data-index="name"/>
        <a-table-column key="description" title="描述" data-index="description"/>
        <a-table-column key="action" title="操作">
          <template #default="{ record }">
            <a-button @click="()=>{modifyTemplate(record)}">修改</a-button>&nbsp;
            <a-popconfirm title="确定删除吗？" ok-text="是" cancel-text="否" @confirm="()=>{remove(record)}">
              <a-button type="primary" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </p>
  </a-card>
</template>

<script lang="ts">
import {reactive, toRefs, ref, defineComponent, onMounted} from 'vue';
import MailEditor from '/@/components/MailEditor.vue';
import templateApi from '../../api/template';
import router from "/@/routers";
import {message} from 'ant-design-vue';
import {Template} from "/@/model/template";
import TemplateSelector from "/@/components/TemplateSelector.vue";

export default defineComponent({
  setup() {
    const state = reactive({
      selectedId: '',
      templateList: [],
      templates: {}
    });

    const me = ref(null);
    const formRef = ref(null);
    const ts = ref(null);

    const addTemplate = () => {
      router.push('/template/edit/0');
    };

    const modifyTemplate = (template: Template) => {
      router.push(`/template/edit/${template.id}`);
    };

    const remove = (record: Template) => {
      templateApi.remove(record.id);
      list();
    };

    const saveDefaultTemplateId = () => {
      if (state.selectedId) {
        templateApi.saveDefaultTemplateId(state.selectedId);
        message.success('保存成功');
      }
    };

    const list = () => {
      ts.value.fetch();
    };

    onMounted(() => {
      list();
    });

    return {
      ...toRefs(state),
      addTemplate,
      modifyTemplate,
      me,
      formRef,
      ts,
      remove,
      list,
      saveDefaultTemplateId
    };
  },
  components: {
    MailEditor,
    TemplateSelector
  }
});
</script>

<style lang="scss" scoped>
.group-title {
  padding-top: 16px;
  font-weight: bolder;
  font-size: 20px;
}
</style>

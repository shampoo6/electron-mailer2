<template>
  <a-card>
    <p>
      <a-form layout="inline">
        <a-form-item
          label="默认模板"
        >
          <a-select style="width: 200px;" v-model:value="templateId" placeholder="Please select a template">
            <a-select-option value="" disabled>请选择模板</a-select-option>
            <a-select-option v-for="row in dataSource" :key="row.id" :value="row.id">{{ row.name }}
            </a-select-option>
          </a-select>
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
      <a-table rowKey="id" :dataSource="dataSource" bordered>
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
import {reactive, toRefs, ref, nextTick, defineComponent} from 'vue'
import MailEditor from '/@/components/MailEditor.vue'
import templateApi from '../../api/template'
import router from "/@/routers";
import {message} from 'ant-design-vue'
import {Template} from "/@/model/template";

export default defineComponent({
  setup() {
    const state = reactive({
      templateId: '',
      dataSource: [
        {
          id: '1',
          name: '测试模板1',
          description: '描述1'
        },
        {
          id: '2',
          name: '测试模板2',
          description: '描述2'
        },
        {
          id: '3',
          name: '测试模板3',
          description: '描述3'
        },
      ],
    })

    const me = ref(null)
    const formRef = ref(null)

    const visible = ref(false)

    const addTemplate = () => {
      router.push('/template/edit/0')
    }

    const modifyTemplate = (template: Template) => {
      router.push(`/template/edit/${template.id}`)
    }

    const remove = (record: Template) => {
      templateApi.remove(record.id)
      list()
    }

    const saveDefaultTemplateId = () => {
      if (state.templateId) {
        templateApi.saveDefaultTemplateId(state.templateId)
        message.success('保存成功');
      }
    }

    const list = () => {
      let data = templateApi.list()
      let rowData = []
      for (const key in data) {
        if (key === 'defaultTemplateId') continue
        rowData.push(data[key])
      }
      state.dataSource = rowData
      state.templateId = data.defaultTemplateId ? data.defaultTemplateId : ''
    }

    list()

    return {
      ...toRefs(state),
      visible,
      addTemplate,
      modifyTemplate,
      me,
      formRef,
      remove,
      list,
      saveDefaultTemplateId
    }
  },
  components: {
    MailEditor
  }
})
</script>

<style lang="scss" scoped>
.group-title {
  padding-top: 16px;
  font-weight: bolder;
  font-size: 20px;
}
</style>

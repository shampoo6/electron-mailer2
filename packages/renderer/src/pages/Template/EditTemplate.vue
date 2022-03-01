<template>
  <div class="content">
    <a-page-header
      class="header"
      :sub-title="title"
      @back="() => {$router.back()}"
    >
      <template #extra>
        <div>
          <a-button type="primary" @click="save">保存</a-button>
        </div>
      </template>
    </a-page-header>

    <div class="form">
      <a-form
        ref="formRef"
        :model="data"
        :rules="rules"
        :label-col="{span: 4}"
        :wrapper-col="{span: 20}"
      >
        <div>
          <div class="group-title">模板信息</div>
          <a-divider></a-divider>
        </div>
        <a-form-item label="id" name="id" v-if="data._id">
          <a-input v-model:value="data._id" readonly/>
        </a-form-item>
        <a-form-item label="模板名称" name="name">
          <a-input v-model:value="data.name"/>
        </a-form-item>
        <a-form-item label="模板描述" name="description">
          <a-input v-model:value="data.description"/>
        </a-form-item>
      </a-form>
      <MailEditor ref="me"></MailEditor>
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, ref} from "vue";
import templateApi from "/@/api/template";
import router from "/@/routers";

const insertText = '新增'
const editText = '编辑'

export default defineComponent({
  setup() {
    const state = reactive({
      isNew: true,
      title: insertText,
      data: {
        _id: '',
        name: '',
        description: ''
      },
      rules: {
        name: [{required: true, message: '请输入模板名称', trigger: 'blur'},],
        description: [{required: true, message: '请输入模板描述', trigger: 'blur'},],
      }
    })

    const me = ref(null)

    const save = () => {
      if (!me.value) return
      const template = (me.value as any).getData()
      template.id = state.data._id
      template.name = state.data.name
      template.description = state.data.description
      templateApi.save(template)
      router.back()
    }

    return {
      ...toRefs(state),
      save,
      me
    }
  },
  mounted() {
    this.isNew = this.$route.params.id === '0'
    this.title = this.isNew ? insertText : editText
    if (!this.isNew) {
      let template = templateApi.findById((this.$route.params as any).id)
      // 回显数据
      this.data._id = template.id
      this.data.name = template.name
      this.data.description = template.description;
      (this.$refs as any).me.setData(template.mail);
    }
  }
})
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
  position: relative;
}

.header {
  border: 1px solid rgb(235, 237, 240);
  background-color: #fff !important;
  position: sticky;
  top: 0;
  z-index: 1;
}

.form {
  padding: 0 24px 24px 24px;
  position: relative;
  z-index: 0;
}

.group-title {
  padding-top: 16px;
  font-weight: bolder;
  font-size: 20px;
}
</style>

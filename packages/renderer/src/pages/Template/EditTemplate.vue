<template>
  <div>
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
    <div style="display: flex; justify-content: flex-end;">
      <a-button type="primary" @click="save">保存</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditTemplate"
}
</script>

<style lang="scss" scoped>
.group-title {
  padding-top: 16px;
  font-weight: bolder;
  font-size: 20px;
}
</style>

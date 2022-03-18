<template>
  <div>
    <a-form
      ref="formRef"
      :model="data"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <div>
        <div class="group-title">账户信息</div>
        <a-divider></a-divider>
      </div>
      <a-form-item label="寄件邮箱" name="from">
        <a-input v-model:value="data.from"/>
      </a-form-item>
      <a-form-item label="授权密码" name="pwd">
        <a-input v-model:value="data.pwd"/>
      </a-form-item>
      <a-form-item label="smtp服务器" name="smtp">
        <a-input v-model:value="data.smtp"/>
      </a-form-item>
      <div>
        <div class="group-title">邮件内容</div>
        <a-divider></a-divider>
      </div>
      <a-form-item label="寄件人姓名" name="sender">
        <a-input v-model:value="data.sender"/>
      </a-form-item>
      <a-form-item label="收件邮箱" name="to">
        <a-input v-model:value="data.to"/>
      </a-form-item>
      <a-form-item label="抄送" name="copy">
        <a-input v-model:value="data.copy" placeholder="要抄送的邮箱地址可以用逗号隔开写多个地址"/>
      </a-form-item>
      <a-form-item label="主题" name="subject">
        <a-input v-model:value="data.subject"/>
      </a-form-item>
      <a-form-item label="邮件内容头" name="head">
        <div>
          <div ref="editorRef">
          </div>
        </div>
      </a-form-item>
      <a-form-item label="AI续写长度" name="length">
        <a-input type="number" v-model:value.number="data.length"/>
      </a-form-item>
      <a-form-item label="签名" name="sign">
        <div>
          <div ref="signRef">
          </div>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, onMounted} from 'vue';
import Quill from 'quill';
import {Mail} from '/@/model/mail';

const Delta = Quill.import('delta');

const formRef = ref(null);
const editorRef = ref(null);
const signRef = ref(null);

const quill = ref(null);
const sign = ref(null);
const data = reactive({
  from: '',
  pwd: '',
  smtp: '',
  sender: '',
  to: '',
  copy: '',
  subject: '',
  length: 0
});
const toolbarOptions = reactive([
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction

  // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],

  ['link', 'image'],

  ['clean']                                         // remove formatting button
]);

const rules = reactive({
  from: [
    {required: true, message: '请输入寄件邮箱', trigger: 'blur'},
  ],
  pwd: [
    {required: true, message: '请输入授权密码', trigger: 'blur'},
  ],
  smtp: [
    {required: true, message: '请输入smtp服务器', trigger: 'blur'},
  ],
  sender: [
    {required: true, message: '请输入寄件人姓名', trigger: 'blur'},
  ],
  to: [
    {required: true, message: '请输入收件邮箱', trigger: 'blur'},
  ],
  subject: [
    {required: true, message: '请输入主题', trigger: 'blur'},
  ],
});

const labelCol = reactive({span: 4});
const wrapperCol = reactive({span: 20});

const getData: () => Mail = () => {
  let _data = JSON.parse(JSON.stringify(data));
  _data.content = (quill as any)._rawValue.container.children[0].innerHTML;
  _data.text = (quill as any)._rawValue.container.children[0].innerText;
  _data.sign = (sign as any)._rawValue.container.children[0].innerHTML;
  return _data;
};

const setData = (mail: Mail) => {
  for (const key in data) {
    (data as any)[key] = (mail as any)[key];
  }
  (quill as any)._rawValue.container.children[0].innerHTML = mail.content;
  (sign as any)._rawValue.container.children[0].innerHTML = mail.sign;
};

onMounted(() => {
  quill.value = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions
    }
  });
  sign.value = new Quill(signRef.value, {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions
    }
  });
});

defineExpose({
  getData,
  setData
});

</script>

<style lang="scss" scoped>
.group-title {
  padding-top: 16px;
  font-weight: bolder;
  font-size: 20px;
}
</style>

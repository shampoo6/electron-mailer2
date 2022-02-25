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
            <!--            <p>Hello World!</p>
                        <p>Some initial <strong>bold</strong> text</p>
                        <p><br></p>-->
          </div>
        </div>
      </a-form-item>
      <a-form-item label="签名" name="sign">
        <div>
          <div ref="signRef">
            <!--            <p>Hello World!</p>
                        <p>Some initial <strong>bold</strong> text</p>
                        <p><br></p>-->
          </div>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import {reactive, ref, toRefs} from 'vue'
import * as Quill from 'quill'
import {Mail} from "/@/model/mail";


const Delta = Quill.import('delta');

export default {
  name: 'MailEditor',
  setup() {
    const state = reactive({
      quill: null,
      sign: null,
      data: {
        from: '',
        pwd: '',
        smtp: '',
        sender: '',
        to: '',
        copy: '',
        subject: '',
      },
    })

    const formRef = ref(null)
    const editorRef = ref(null)
    const signRef = ref(null)

    const getData: () => Mail = () => {
      let data = JSON.parse(JSON.stringify(state.data))
      data.content = (state.quill as any).container.children[0].innerHTML
      data.sign = (state.sign as any).container.children[0].innerHTML
      return data
    }

    const setData = (data: Mail) => {
      for (const key in state.data) {
        (state.data as any)[key] = (data as any)[key]
      }
      (state.quill as any).container.children[0].innerHTML = data.content;
      (state.sign as any).container.children[0].innerHTML = data.sign;
    }

    return {
      ...toRefs(state),
      formRef,
      editorRef,
      signRef,
      getData,
      setData
    }
  },
  data() {
    return {
      toolbarOptions: [
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
      ],
      quill: null,
      sign: null,

      rules: {
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
      },
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    }
  },
  mounted() {
    const that: any = (this as any)
    that.quill = new Quill(that.$refs.editorRef, {
      theme: 'snow',
      modules: {
        toolbar: that.toolbarOptions
      }
    })
    that.sign = new Quill(that.$refs.signRef, {
      theme: 'snow',
      modules: {
        toolbar: that.toolbarOptions
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.group-title {
  padding-top: 16px;
  font-weight: bolder;
  font-size: 20px;
}
</style>

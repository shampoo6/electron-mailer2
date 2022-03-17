import {Template} from "../renderer/src/model/template";

const {v4: uuidv4} = require('uuid')

const sign = '<p>请在此处填入邮件签名</p>'

const config: Template = {
  id: uuidv4().replace(/-/g, ''),
  name: "示例模板",
  description: "每次清空模板后会自动创建的模板",
  mail: {
    content: "<p>请在此处填写需要AI续写邮件的开头部分</p>",
    text: '请在此处填写需要AI续写邮件的开头部分',
    copy: "xxx@qq.com, xxx@163.com", from: "xxx@163.com",
    pwd: "请在此处填写寄件邮箱的客户端授权密码",
    sender: "请在此处填写寄件人姓名，如: 张三",
    sign: sign,
    smtp: "请在此处填写邮箱服务器，如: smtp.163.com",
    subject: "请在此处填写邮件主题，如: 发票邮件",
    to: "xxx@qq.com, xxx@163.com",
    length: 200
  }
}

export default config

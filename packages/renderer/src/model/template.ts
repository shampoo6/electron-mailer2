import {Mail} from "/@/model/mail";

export interface Template {
  // id
  id: string
  // 模板名称
  name: string
  // 模板描述
  description: string
  // 邮件配置
  mail: Mail
}

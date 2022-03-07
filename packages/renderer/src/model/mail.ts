// 邮件
export interface Mail {
  // 寄件邮箱
  from: string
  // 邮箱的第三方授权密码
  pwd: string
  // smtp协议的邮箱服务器地址
  smtp: string
  // 寄件人名称
  sender: string
  // 收件邮箱
  to: string
  // 抄送邮箱 多个邮箱间用逗号分割 如 xxx@xxx.com, yyy@yyy.com
  copy: string
  // 邮件主题
  subject: string
  // 邮件内容 存储的一个富文本的 html 字符串
  content: string
  // 邮件内容的文本信息
  text: string
  // 邮件签名 存储的一个富文本的 html 字符串
  sign: string,
  // AI 续写的长度
  length: number
}

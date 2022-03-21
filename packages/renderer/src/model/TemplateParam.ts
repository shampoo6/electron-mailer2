// 模板变量
export interface TemplateParam {
  // 变量名
  name: string;
  // 变量值(该值将被作为AI续写的开头内容)
  value: string;
  // 续写字数
  count: number;
}

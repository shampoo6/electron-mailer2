import {Template} from "/@/model/template";
import {notification} from "ant-design-vue";

export default {
  test() {
    window.ipcRenderer.send('template/test', {a: 1, b: 2})
  },
  save(template: Template) {
    window.ipcRenderer.sendSync('template/save', JSON.stringify(template))
  },
  list() {
    return JSON.parse(window.ipcRenderer.sendSync('template/list'))
  },
  saveDefaultTemplateId(templateId: string) {
    window.ipcRenderer.sendSync('template/saveDefaultTemplateId', templateId)
  },
  remove(id: string) {
    window.ipcRenderer.sendSync('template/remove', id)
  },
  findById(id: string) {
    let result = window.ipcRenderer.sendSync('template/findById', id)
    return result ? JSON.parse(result) : null
  },
  getDefaultTemplate() {
    let result = window.ipcRenderer.sendSync('template/getDefaultTemplate')
    if (!result) {
      notification.error({
        message: '系统错误',
        description:
          '未找到邮件模板，请在模板管理中定义并设置默认模板。',
      });
      return null
    }
    return JSON.parse(result)
  }
}

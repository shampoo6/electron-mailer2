export default {
  test() {
    window.ipcRenderer.send('template/test', {a: 1, b: 2})
  },
  save(templateData: string) {
    window.ipcRenderer.sendSync('template/save', templateData)
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
  }
}

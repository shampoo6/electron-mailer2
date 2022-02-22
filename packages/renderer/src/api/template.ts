export default {
  test() {
    ipcRenderer.send('template/test', {a: 1, b: 2})
  },
  save(templateData: string) {
    ipcRenderer.sendSync('template/save', templateData)
  },
  list() {
    return JSON.parse(ipcRenderer.sendSync('template/list'))
  },
  saveDefaultTemplateId(templateId: string) {
    ipcRenderer.sendSync('template/saveDefaultTemplateId', templateId)
  },
  remove(id: string) {
    ipcRenderer.sendSync('template/remove', id)
  }
}

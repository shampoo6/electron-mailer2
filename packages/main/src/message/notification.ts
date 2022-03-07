const electron = require('electron');
const {ipcMain, Notification} = electron
let supported = Notification.isSupported()

let instance: Electron.Notification

ipcMain.on('notification/show', (event, args) => {
  if (!supported) {
    event.returnValue = ''
    return
  }
  instance = instance || new Notification({
    title: 'electron-mailer2 消息'
  })
  instance.body = args
  instance.show()
  event.returnValue = ''
})

export default {}

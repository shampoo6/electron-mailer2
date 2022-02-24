import fileUtils from "/@/utils/fileUtils";

const {ipcMain} = require('electron')
const path = require('path')
const fsp = require('fs/promises')
const {v4: uuidv4} = require('uuid')

const documentName = 'templates.json'

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
// })
//
// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong' // 同步返回
// })

ipcMain.on('template/test', (event, arg) => {
  // console.log(arg)
  // console.log(typeof arg)
  // console.log(app.getAppPath())
  // let appDataPath = path.join(app.getPath('appData'), app.name)
  // console.log(appDataPath)
  //
  // fs.access(appDataPath, err => {
  //   if (err) console.error(err)
  //   else console.log('ok')
  // })
  fileUtils.getAppDataPathWithExist('savedData').then(p => {
    console.log(p)
  })
})

ipcMain.on('template/save', async (event, args) => {
  let templates = await fileUtils.getDocument(documentName)
  templates = templates || {}
  args = JSON.parse(args)
  if (args.id) {
    const template = templates[args.id]
    if (template)
      for (const key in args) {
        template[key] = args[key]
      }
  } else {
    const id = uuidv4().replace(/-/g, '')
    args.id = id
    templates[id] = args
  }
  await fileUtils.saveDocument(documentName, templates)
  event.returnValue = ''
})

ipcMain.on('template/saveDefaultTemplateId', async (event, args) => {
  if (!args) {
    event.returnValue = ''
    return
  }
  let templates = await fileUtils.getDocument(documentName)
  if (!templates) {
    event.returnValue = ''
    return
  }
  templates.defaultTemplateId = args
  await fileUtils.saveDocument(documentName, templates)
  event.returnValue = ''
})

ipcMain.on('template/list', async (event, args) => {
  let templates = await fileUtils.getDocument(documentName)
  templates = templates || {}
  event.returnValue = JSON.stringify(templates)
})

ipcMain.on('template/remove', async (event, args) => {
  if (!args) {
    event.returnValue = ''
    return
  }
  let templates = await fileUtils.getDocument(documentName);
  if (!templates) {
    event.returnValue = ''
    return
  }
  delete templates[args]
  // 判断是否要清空默认模板设置
  if (templates.defaultTemplateId === args)
    delete templates.defaultTemplateId

  await fileUtils.saveDocument(documentName, templates)

  event.returnValue = ''
})

ipcMain.on('template/findById', async (event, args) => {
  if (!args) {
    event.returnValue = ''
    return
  }
  let templates = await fileUtils.getDocument(documentName);
  if (!templates) {
    event.returnValue = ''
    return
  }
  event.returnValue = templates[args] ? JSON.stringify(templates[args]) : null
})

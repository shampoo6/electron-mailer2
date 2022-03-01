import {ipcMain} from "electron";
import mailer from '../utils/mailer'

ipcMain.on('mailer/send', async (event, args) => {
  let mail
  try {
    mail = JSON.parse(args)
    console.log(mail)
  } catch (e) {
    console.error(e)
    event.returnValue = '参数异常'
    return
  }

  try {
    await mailer.sendMail(mail)

  } catch (e) {
    console.error(e)
    event.returnValue = '发送失败'
    return
  }

  event.returnValue = ''
})

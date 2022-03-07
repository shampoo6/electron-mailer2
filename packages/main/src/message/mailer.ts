import {ipcMain, Notification} from "electron";
import mailer from '../utils/mailer'
import aiWriter from "/@/utils/aiWriter";
import {Mail} from "../../../renderer/src/model/mail";

ipcMain.on('mailer/send', async (event, args) => {

  let notification = Notification.isSupported() ? new Notification({
    title: 'electron-mailer2 消息',
    silent: false,
    urgency: 'critical'
  }) : null

  let mail: Mail
  try {
    mail = JSON.parse(args)
  } catch (e) {
    console.error(e)
    if(notification) {
      notification.body = '参数异常'
      notification.show()
    }
    event.reply('mailer/send-reply', '参数异常')
    return
  }

  let result: string
  try {
    result = await aiWriter.write(mail.text, mail.length)
  } catch (e) {
    console.error(e)
    if(notification) {
      notification.body = 'AI续写异常'
      notification.show()
    }
    event.reply('mailer/send-reply', 'AI续写异常')
    return
  }

  mail.text = result

  try {
    await mailer.sendMail(mail)

  } catch (e) {
    console.error(e)
    if(notification) {
      notification.body = '发送失败'
      notification.show()
    }
    event.reply('mailer/send-reply', '发送失败')
    return
  }
  if(notification) {
    notification.body = '发送成功'
    notification.show()
  }
  event.reply('mailer/send-reply', 'ok')
})

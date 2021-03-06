import {ipcMain} from 'electron';
import mailer from '../utils/mailer';
import {Mail} from '../../../renderer/src/model/mail';
import {getNotification} from '/@/utils/notification';

const log = require('electron-log');

ipcMain.on('mailer/send', async (event, args) => {

  // todo 重构发送通知代码
  let notification = getNotification({body: '发送成功'});

  let mail: Mail;
  try {
    mail = JSON.parse(args);
  } catch (e) {
    log.error(e);
    if (notification) {
      notification.body = '参数异常';
      notification.show();
    }
    event.reply('mailer/send-reply', '参数异常');
    return;
  }

  // 通过配置的参数结合模板引擎得到邮件内容
  try {
    await mailer.aiWriteAndSendMail(mail);
  } catch (e) {
    log.error(e);
    if (notification) {
      notification.body = '发送失败';
      notification.show();
    }
    event.reply('mailer/send-reply', '发送失败');
    return;
  }
  if (notification) {
    notification.body = '发送成功';
    notification.show();
  }

  event.reply('mailer/send-reply', 'ok');
});

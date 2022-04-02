import fileUtils from '/@/utils/fileUtils';
import {Notification} from 'electron';

let _options = {
  title: 'electron-mailer2 消息',
  silent: false,
  icon: fileUtils.getAssetsPath('img/icon.png'),
  timeoutType: 'never',
  sound: fileUtils.getAssetsPath('sound/sound.wav'),
  closeButtonText: '关闭',
  actions: [{
    type: 'button',
    text: '显示按钮'
  }]
};

export interface NotificationOptions {
  body: string,
  title?: string
}

export function getNotification(options: NotificationOptions) {
  if (!Notification.isSupported()) return null;

  let op: any = {..._options};

  Object.assign(op, options);

  return new Notification(op);
}

import {Mail} from "/@/model/mail";

export default {
  send(mail: Mail) {
    return new Promise((resolve, reject) => {
      window.ipcReceiveOnce('mailer/send-reply', (arg: any) => {
        if (arg === 'ok') resolve(arg)
        else reject(arg)
      })
      window.ipcRenderer.send('mailer/send', JSON.stringify(mail))
    })
  }
}

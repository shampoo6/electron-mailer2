import {Mail} from "/@/model/mail";

export default {
  send(mail: Mail) {
    return window.ipcRenderer.sendSync('mailer/send', JSON.stringify(mail))
  }
}

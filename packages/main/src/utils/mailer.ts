import {Mail} from "../../../renderer/src/model/mail";

const {createTransport} = require("nodemailer");

export default {
  async sendMail(mail: Mail) {
    // 暂时只支持 smtp 协议
    let poolConfig = `smtps://${mail.from}:${mail.pwd}@${mail.smtp}/?pool=false`;
    let transporter = createTransport(poolConfig)

    // send mail with defined transport object
    await transporter.sendMail({
      from: `"${mail.sender}" <${mail.from}>`,
      to: mail.to,
      cc: mail.copy,
      subject: mail.subject,
      html: mail.content + mail.sign
    })
  }
}

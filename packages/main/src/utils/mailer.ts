import {Mail} from '../../../renderer/src/model/mail';
import log from 'electron-log';
import aiWriter from '/@/utils/aiWriter';

const {createTransport} = require('nodemailer');

export default {
  async sendMail(mail: Mail) {
    // 暂时只支持 smtp 协议
    let poolConfig = `smtps://${mail.from}:${mail.pwd}@${mail.smtp}/?pool=false`;
    let transporter = createTransport(poolConfig);

    // send mail with defined transport object
    await transporter.sendMail({
      from: `"${mail.sender}" <${mail.from}>`,
      to: mail.to,
      cc: mail.copy,
      subject: mail.subject,
      html: `<p>${mail.text}</p>${mail.sign}`
    });
  },
  async aiWriteAndSendMail(mail: Mail) {
    let result: string;
    try {
      result = await aiWriter.write(mail.text, mail.length);
    } catch (e) {
      log.error(e);
      return;
    }

    mail.text = result;

    try {
      await this.sendMail(mail);
    } catch (e) {
      log.error(e);
      return;
    }
  }
};

import {Mail} from '../../../renderer/src/model/mail';
import log from 'electron-log';
import aiWriter from '/@/utils/aiWriter';
import {TemplateParam} from '../../../renderer/src/model/TemplateParam';

const {createTransport} = require('nodemailer');
const ejs = require('ejs');

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
      html: `<p>${mail.content}</p>${mail.sign}`
    });
  },
  async aiWriteAndSendMail(mail: Mail) {
    // 修改续写逻辑

    // 定义模板参数
    let params: any = {};

    // ai 续写
    if (Array.isArray(mail.params) && mail.params.length > 0) {
      // 启动 ai 续写
      let promises = mail.params.map((param: TemplateParam) => {
        return aiWriter.write(param.value, param.count);
      });

      let results: any;
      try {
        results = await Promise.all(promises);
      } catch (e) {
        log.error(e);
        return;
      }

      // 构造模板引擎参数
      mail.params.forEach((p, i) => {
        params[p.name] = results[i];
      });
    }
    // 构造邮件html内容
    // 转换html实体
    mail.content = mail.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    mail.content = ejs.render(mail.content, params);

    try {
      await this.sendMail(mail);
    } catch (e) {
      log.error(e);
      return;
    }
  }
};

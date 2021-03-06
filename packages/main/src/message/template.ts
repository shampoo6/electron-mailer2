import fileUtils from '/@/utils/fileUtils';
import defaultMailConfig from '../../defaultMailConfig';
import defaultMailConfigPro from '../../defaultMailConfigPro';

const {ipcMain} = require('electron');
const {v4: uuidv4} = require('uuid');

const documentName = 'templates.json';

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
  fileUtils.getAppDataPathWithExist('savedData').then(p => {
    console.log(p);
  });
});

ipcMain.on('template/save', async (event, args) => {
  let templates = await fileUtils.getDocument(documentName);
  templates = templates || {};
  args = JSON.parse(args);
  if (args.id) {
    const template = templates[args.id];
    if (template)
      for (const key in args) {
        template[key] = args[key];
      }
  } else {
    const id = uuidv4().replace(/-/g, '');
    args.id = id;
    templates[id] = args;
  }
  await fileUtils.saveDocument(documentName, templates);
  event.returnValue = '';
});

ipcMain.on('template/saveDefaultTemplateId', async (event, args) => {
  if (!args) {
    event.returnValue = '';
    return;
  }
  let templates = await fileUtils.getDocument(documentName);
  if (!templates) {
    event.returnValue = '';
    return;
  }
  templates.defaultTemplateId = args;
  await fileUtils.saveDocument(documentName, templates);
  event.returnValue = '';
});

ipcMain.on('template/list', async (event, args) => {
  let templates = await fileUtils.getDocument(documentName);
  templates = templates || {};

  if (JSON.stringify(templates) === '{}') {

    if (import.meta.env.DEV) {
      // 若模板为空且是开发模式 那么插入一个默认模板
      templates[defaultMailConfig.id] = defaultMailConfig;
      templates['defaultTemplateId'] = defaultMailConfig.id;
    } else if (import.meta.env.PROD) {
      templates[defaultMailConfigPro.id] = defaultMailConfigPro;
      templates['defaultTemplateId'] = defaultMailConfigPro.id;
    }

    await fileUtils.saveDocument(documentName, templates);
  }

  event.returnValue = JSON.stringify(templates);
});

ipcMain.on('template/remove', async (event, args) => {
  if (!args) {
    event.returnValue = '';
    return;
  }
  let templates = await fileUtils.getDocument(documentName);
  if (!templates) {
    event.returnValue = '';
    return;
  }
  delete templates[args];
  // 判断是否要清空默认模板设置
  if (templates.defaultTemplateId === args)
    delete templates.defaultTemplateId;

  await fileUtils.saveDocument(documentName, templates);

  event.returnValue = '';
});

ipcMain.on('template/findById', async (event, args) => {
  if (!args) {
    event.returnValue = '';
    return;
  }
  let templates = await fileUtils.getDocument(documentName);
  if (!templates) {
    event.returnValue = '';
    return;
  }
  event.returnValue = templates[args] ? JSON.stringify(templates[args]) : null;
});

ipcMain.on('template/getDefaultTemplate', async (event, args) => {
  const templates = await fileUtils.getDocument(documentName);
  if (!templates) {
    event.returnValue = null;
    return;
  }
  const template = templates[templates.defaultTemplateId];
  if (!template) {
    event.returnValue = null;
    return;
  }
  event.returnValue = JSON.stringify(template);
});

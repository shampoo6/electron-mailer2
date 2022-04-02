import {app, Notification} from 'electron';
import {TaskWorkerData, TaskWorkerType} from '/@/model/TaskWorkerData';
import Bree from 'bree';
import {Template} from '../../../renderer/src/model/template';
import {TaskState} from '../../../renderer/src/constants/taskState';
import mailer from '/@/utils/mailer';
import {Task} from '../../../renderer/src/model/task';
import moment from 'moment';
import fileUtils from './fileUtils';
import {getNotification, NotificationOptions} from '/@/utils/notification';

const log = require('electron-log');

// ai 续写程序路径
let scriptsPath = fileUtils.getAssetsPath('js/job.js');
log.debug('运行任务脚本路径为: ' + scriptsPath);

const taskName = 'tasks.json';
const templateName = 'templates.json';

// 任务名称列表
let taskNames: any[] = [];

// 扫描任务配置
let scanTaskConfig = {
  name: 'scan',
  interval: 'at 12:00 am',
  timeout: '5m',
  path: scriptsPath,
  worker: {
    workerData: {
      type: TaskWorkerType.Scan,
    } as TaskWorkerData
  }
};

// 发送邮件配置
let sendTaskConfig = {
  // name, 任务名需要添加
  // date: prepareSendTime.toDate(), 日期需要添加
  path: scriptsPath,
  worker: {
    workerData: {
      type: TaskWorkerType.Send,
      data: {
        // taskId: task.id 任务id需要添加
      }
    } as TaskWorkerData
  }
};

// bree 对象
const bree = new Bree({
  logger: log,
  root: false,
  workerMessageHandler: (() => {
    return (async function (args: any) {
      let data: TaskWorkerData = JSON.parse(args.message);
      let typeName = TaskWorkerType[data.type];
      const fn = eval(`this.do${typeName}`);
      if (typeof fn === 'function')
        await fn(data.data);
    }).bind({
      doSend,
      doScan
    });
  })()
});

async function doSend(data: any) {
  let tasks = await getTasks();
  let task = tasks[data.taskId];
  if (!task) {
    log.error('发送邮件时任务未找到');
    log.error(`任务id: ${task.id}`);
    return;
  }
  let templates = await getTemplates();
  let template: Template = templates[task.templateId];
  if (!template) {
    log.error('发送邮件时模板未找到');
    log.error(`任务id: ${task.id}`);
    log.error(`模板id: ${task.templateId}`);
    await changeTaskStatus(task.id, TaskState.Fail, `发送邮件时模板未找到`);
    return;
  }
  // ai续写并发送邮件
  await mailer.aiWriteAndSendMail(template.mail);

  let notification = getNotification({body: ''} as NotificationOptions);

  if (notification) {
    notification.body = `日期为 ${task.id} 的邮件已发送`;
    notification.show();
  }

  // 修改 task 状态
  await changeTaskStatus(task.id, TaskState.Complete);
}

async function doScan(data: any) {
  await scan();
}

async function getTemplates() {
  let templates = await fileUtils.getDocument(templateName);
  templates = templates || {};
  return templates;
}

async function getTasks() {
  let tasks = await fileUtils.getDocument(taskName);
  tasks = tasks || {};
  return tasks;
}

async function changeTaskStatus(id: string, state: TaskState, msg?: string) {
  const tasks: { [key: string]: any } = await getTasks();
  const task = tasks[id];
  if (!task) return;
  (task as Task).state = state;
  if (msg) (task as Task).msg = msg;
  (task as Task).sendTime = Date.now();
  await fileUtils.saveDocument(taskName, tasks);
}


////////////////////////////////以下是导出内容//////////////////////////////////


// 添加新任务
// 在添加bree.job时给参数设置了 type 和 data
// type 代表本次业务类型
// data 代表本次传递的参数
// type 如下
// send: 发送邮件
// scan: 扫描 tasks.json
export async function add(task: Task) {
  log.debug(`添加新任务, 任务id: ${task.id}`);

  // 判断是否是今天的任务
  // 今天的任务就添加一个 bree 任务
  const prepareSendTime = moment(task.prepareSendTime);
  if (!prepareSendTime.isSame(moment(), 'd')) return;
  // 获取模板
  let templates = await getTemplates();
  let template: Template = templates[task.templateId];
  if (!template) {
    log.error('未找到模板id对应模板');
    log.error(`任务id: ${task.id}`);
    log.error(`模板id: ${task.templateId}`);
    return;
  }

  // 设置状态
  await changeTaskStatus(task.id, TaskState.Running);

  let name = task.id;

  try {
    await bree.stop(name);
    await bree.remove(name);
  } catch (e) {
  }

  try {

    let config: any = {...sendTaskConfig};
    config.name = name;
    config.date = prepareSendTime.toDate();
    config.worker.workerData.data.taskId = task.id;

    bree.add(config);
    bree.start(name);

    taskNames.push(name);
  } catch (e) {
    log.error(e);
  }
}

// 移除任务
export async function remove(taskId: string) {
  log.debug(`删除任务, 任务id: ${taskId}`);
  try {
    await bree.stop(taskId);
    await bree.remove(taskId);
    const i = taskNames.findIndex(name => name === taskId);
    taskNames.splice(i, 1);
  } catch (e: any) {
    if (e.message.indexOf('does not exist') === -1) log.error(e);
  }
}

export async function scan() {
  log.debug('扫描任务开始');

  // 重置所有任务
  try {
    await bree.stop();
    await bree.remove('scan');
    const promises = taskNames.map(name => {
      return bree.remove(name);
    });
    await Promise.all(promises);
  } catch (e) {
  }
  taskNames.splice(0, taskNames.length);

  // 执行扫描逻辑
  // 默认情况下 任务已完成 那么7天后就自动删除任务

  // 扫描所有 tasks.json 中的任务
  const tasks = await getTasks();
  for (const taskId in tasks) {
    const task = tasks[taskId];
    // 检查时间是否是今天，是就启动任务
    if ((task.state === TaskState.Waiting || task.state === TaskState.Running)
      && moment(task.prepareSendTime).isSame(moment(), 'd')) {
      try {
        await add(task);
      } catch (e) {
        log.error(e);
      }
    } else if (task.state === TaskState.Complete) {
      // 其余任务检查是否过期，是就删除
      // 检测是否过期
      if (moment(task.sendTime).add(7, 'd').isBefore(moment())) {
        // 删除任务
        delete tasks[task.id];
        await fileUtils.saveDocument(taskName, tasks);
      }
    }
  }

  // 开启扫描任务
  bree.add(scanTaskConfig);
  bree.start('scan');
}

// 防抖
const onFocus = (() => {
  let timer: any;
  return () => {
    timer && clearTimeout(timer);
    timer = setTimeout(async () => {
      await scan();
    }, 5000);
  };
})();

export async function init() {
  /**
   * 添加窗口激活事件
   * 窗口激活后将重新扫描所有任务
   */
  app.on('browser-window-focus', () => {
    onFocus();
  });

  await scan();
}

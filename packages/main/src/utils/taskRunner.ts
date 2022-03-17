// 任务运行器

import {Template} from '../../../renderer/src/model/template';
import {Task} from '../../../renderer/src/model/task';
import fileUtils from '/@/utils/fileUtils';
import moment from 'moment';
import {TaskState} from '../../../renderer/src/constants/taskState';
import mailer from '../utils/mailer';
import {Notification} from 'electron';

const electron = require('electron');
const log = require('electron-log');
const path = require('path');
const Bree = require('bree');

const taskName = 'tasks.json';
const templateName = 'templates.json';

// ai 续写程序路径
let appPath = electron.app.getAppPath();
let scriptsPath = import.meta.env.DEV ? path.join(appPath, 'packages/main/src/scripts') : path.join(appPath, 'scripts');

const bree = new Bree({
  logger: log,
  root: false,
  workerMessageHandler: (() => {
    return (async function (args: any) {
      let data = JSON.parse(args.message);
      const fn = eval(`this.job_${data.type}`);
      if (typeof fn === 'function')
        fn(data.data);
    }).bind({
      job_send,
      job_scan
    });
  })()
});

async function job_send(data: any) {
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

  let notification = Notification.isSupported() ? new Notification({
    title: 'electron-mailer2 消息',
    silent: false,
    urgency: 'critical'
  }) : null;

  if (notification) {
    notification.body = `日期为 ${task.id} 的邮件已发送`;
    notification.show();
  }

  // 修改 task 状态
  await changeTaskStatus(task.id, TaskState.Complete);
}

async function job_scan(data: any) {
  await scan();
}

export async function init() {
  // app 启动时应初始化 task
  // 初始时需要调用 scan
  // 每天 0 点再次扫描，只有当天的任务会被计时

  await scan();

  try {
    bree.add({
      name: 'scan',
      interval: 'at 12:00 am',
      path: path.join(scriptsPath, 'sendMail.js'),
      worker: {
        workerData: {
          type: 'scan',
        }
      }
    });
    bree.start('scan');
  } catch (e) {
    log.error(e);
  }

}

export async function scan() {
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
}

// 添加新任务
// 在添加bree.job时给参数设置了 type 和 data
// type 代表本次业务类型
// data 代表本次传递的参数
// type 如下
// send: 发送邮件
// scan: 扫描 tasks.json
export async function add(task: Task) {
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
    bree.add({
      name,
      date: prepareSendTime.toDate(),
      path: path.join(scriptsPath, 'sendMail.js'),
      worker: {
        workerData: {
          type: 'send',
          data: {
            taskId: task.id
          }
        }
      }
    });
    bree.start(name);
  } catch (e) {
    log.error(e);
  }
}

// 移除任务
export async function remove(taskId: string) {
  try {
    await bree.stop(taskId);
    await bree.remove(taskId);
  } catch (e: any) {
    if (e.message.indexOf('does not exist') === -1) log.error(e);
  }
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

export async function changeTaskStatus(id: string, state: TaskState, msg?: string) {
  const tasks: { [key: string]: any } = await getTasks();
  const task = tasks[id];
  if (!task) return;
  (task as Task).state = state;
  if (msg) (task as Task).msg = msg;
  (task as Task).sendTime = Date.now();
  await fileUtils.saveDocument(taskName, tasks);
}

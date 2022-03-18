// import mailer from '../utils/mailer';
// import fileUtils from '../utils/fileUtils';
// import {TaskState} from '../../../renderer/src/constants/taskState';

const {workerData, parentPort} = require('worker_threads');
// const log = require('electron-log');
const {type, data} = workerData;
// const taskName = 'tasks.json';

// log.info(`任务id: ${taskId} 发送邮件任务开始`);

// let tasks = await fileUtils.getDocument(taskName);
// if (!tasks) {
//   log.error(`任务id: ${taskId} 更新任务状态为 Running 失败`);
//   log.error(`无法获取 tasks.json 数据`);
//   process.exit(1);
// }
//
// const task = tasks[taskId];
// if (!task) {
//   log.error(`任务id: ${taskId} 更新任务状态为 Running 失败`);
//   log.error(`无法获取 task 不存在`);
//   process.exit(1);
// }
//
// task.state = TaskState.Running;
// await fileUtils.saveDocument(taskName, tasks);
//
// mailer.sendMail(mail).then(async r => {
//   // 更新任务状态
//   task.state = TaskState.Complete;
//   log.info(`任务id: ${taskId} 发送邮件任务完成`);
// }).catch(async reason => {
//   task.state = TaskState.Fail;
//   log.error(`任务id: ${taskId} 发送邮件任务失败`);
//   log.error(reason);
// }).finally(async () => {
//   tasks = await fileUtils.getDocument(taskName);
//   tasks = tasks || {};
//   tasks[task.id] = task;
//   await fileUtils.saveDocument(taskName, tasks);
//   process.exit(0);
// });

// export {};

parentPort.postMessage(JSON.stringify({type, data}));

process.exit(0);

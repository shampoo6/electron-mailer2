import {ipcMain} from 'electron';
import fileUtils from '/@/utils/fileUtils';
import {add, remove} from '/@/utils/taskHandler';

const documentName = 'tasks.json';

// args: 任务对象
ipcMain.on('task/add', async (event, args) => {
  let task;
  try {
    task = JSON.parse(args);
  } catch (e) {
    event.returnValue = '添加失败';
    return;
  }
  let tasks = await fileUtils.getDocument(documentName);
  tasks = tasks || {};
  tasks[task.id] = task;
  await fileUtils.saveDocument(documentName, tasks);
  // 添加任务到任务执行器
  await add(task);
  event.returnValue = '';
});

// args: tasks的key 是格式为yyyy-MM-DD的年月日
ipcMain.on('task/remove', async (event, args) => {
  if (typeof args !== 'string' || args.trim() === '') {
    event.returnValue = '删除失败';
    return;
  }

  await remove(args); // 删除任务
  let tasks = await fileUtils.getDocument(documentName);
  delete tasks[args];
  await fileUtils.saveDocument(documentName, tasks);
  event.returnValue = '';
});

ipcMain.on('task/list', async (event, args) => {
  let tasks = await fileUtils.getDocument(documentName);
  tasks = tasks || {};
  event.returnValue = JSON.stringify(tasks);
});

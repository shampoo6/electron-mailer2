import {Task} from '/@/model/task';

export default {
  list() {
    return JSON.parse(window.ipcRenderer.sendSync('task/list'));
  },
  add(task: Task) {
    return window.ipcRenderer.sendSync('task/add', JSON.stringify(task));
  },
  remove(key: string) {
    return window.ipcRenderer.sendSync('task/remove', key);
  }
};

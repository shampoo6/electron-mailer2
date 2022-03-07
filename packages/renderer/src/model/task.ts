import {TaskState} from '/@/constants/taskState';

export interface Task {
  // 任务id
  id: string;
  // 模板id
  templateId: string;
  // 任务计划发送时间
  prepareSendTime: number;
  // 任务实际发送时间
  sendTime: number;
  // 任务状态
  state: TaskState;
  // 额外关于任务的一些说明
  msg: string;
}

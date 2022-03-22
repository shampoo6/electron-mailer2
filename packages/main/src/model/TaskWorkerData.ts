// bree job 中 workerData 的数据类型
export interface TaskWorkerData {
  type: TaskWorkerType;
  data?: { [key: string]: any };
}

export enum TaskWorkerType {
  // 发送邮件
  Send,
  // 扫描任务
  Scan,
}

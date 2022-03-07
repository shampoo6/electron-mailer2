export enum TaskState {
  // 等待被执行
  Waiting,
  // 执行中
  // 此处的执行中代表着已经加入了计划任务
  Running,
  // 任务失败
  Fail,
  // 已完成
  Complete
}

export {};

declare global {
  interface Window {
    ipcRenderer: any,
    ipcReceive: any,
    ipcReceiveOnce: any
    projectVersion: string
  }
}

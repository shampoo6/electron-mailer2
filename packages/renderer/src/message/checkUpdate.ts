export function initCheckUpdate() {
  window.ipcReceive('checkUpdate/info', (message: any) => {
    console.log(message)
  });

  window.ipcRenderer.send('checkUpdate/start');
};

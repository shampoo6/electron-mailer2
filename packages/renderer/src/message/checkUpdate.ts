import router from '/@/routers';

export function initCheckUpdate() {
  window.ipcReceive('checkUpdate/info', (message: any) => {
    console.log(message);
    if (message === 'Update available.') {
      router.replace('/app-update').then(r => {})
    }
  });

  window.ipcRenderer.send('checkUpdate/start');
}

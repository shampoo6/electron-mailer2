import {app} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import fileUtils from '/@/utils/fileUtils';
import {scan} from '/@/utils/taskHandler';
import {mainTray} from '/@/tray';
import {startWithBoot} from '/@/startWithBoot';

const log = require('electron-log');

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);


/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);


/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(() => fileUtils.getAppDataPathWithExist('savedData'))
  .then((savePath) => {
    global.savePath = savePath; // 保存路径
    return Promise.resolve();
  })
  .then(import('./message/template') as any)
  .then(import('./message/mailer') as any)
  .then(import('./message/notification') as any)
  .then(import('./message/task') as any)
  .then(startWithBoot)
  .then(scan)
  .then(mainTray)
  .then(restoreOrCreateWindow)
  .catch((e) => log.error('Failed create window:', e));


/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => log.error('Failed install extension:', e));
}

/**
 * Check new app version in production mode only
 */
// if (import.meta.env.PROD) {
//   app.whenReady()
//     .then(() => import('electron-updater'))
//     .then(({autoUpdater}) => {
//       return autoUpdater.checkForUpdatesAndNotify();
//     })
//     .catch((e) => {
//       console.error('Failed check updates:', e);
//     });
// }

// 修改自动更新逻辑，等待页面加载完成后的回调
if (import.meta.env.PROD) {
  import('./message/checkUpdate');
}

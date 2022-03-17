// Inital app
import {ipcMain, BrowserWindow} from 'electron';
const log = require('electron-log')
const updater = require('electron-updater');
const autoUpdater = updater.autoUpdater;

export {};

///////////////////
// Auto upadater //
///////////////////
autoUpdater.autoDownload = true;

autoUpdater.on('checking-for-update', function () {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', function (info: any) {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', function (info: any) {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', function (err: any) {
  sendStatusToWindow('Error in auto-updater.');
  sendStatusToWindow(err);
});

autoUpdater.on('download-progress', function (progressObj: any) {
  // let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  // log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
  // log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
  let info = {
    speed: progressObj.bytesPerSecond,
    percent: progressObj.percent,
    transferred: progressObj.transferred,
    total: progressObj.total
  };

  sendStatusToWindow(JSON.stringify(info));
});

autoUpdater.on('update-downloaded', function (info: any) {
  sendStatusToWindow('Update downloaded; will install in 1 seconds');
});

autoUpdater.on('update-downloaded', function (info: any) {
  setTimeout(function () {
    autoUpdater.quitAndInstall();
  }, 1000);
});

// autoUpdater.checkForUpdates();

function sendStatusToWindow(message: string) {
  log.info(message)
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
  (window as any).webContents.send('checkUpdate/info', message);
}

ipcMain.on('checkUpdate/start', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

// Inital app
const electron = require('electron');
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
  console.log(info);
});

autoUpdater.on('update-not-available', function (info: any) {
  sendStatusToWindow('Update not available.');
  console.log(info);
});

autoUpdater.on('error', function (err: any) {
  sendStatusToWindow('Error in auto-updater.');
  console.error(err);
});

autoUpdater.on('download-progress', function (progressObj: any) {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', function (info: any) {
  sendStatusToWindow('Update downloaded; will install in 1 seconds');
  console.log(info);
});

autoUpdater.on('update-downloaded', function (info: any) {
  setTimeout(function () {
    autoUpdater.quitAndInstall();
  }, 1000);
});

autoUpdater.checkForUpdates();

function sendStatusToWindow(message: string) {
  console.log(message);
}

import {Menu, Tray} from 'electron';
import fileUtils from '/@/utils/fileUtils';
import {restoreOrCreateWindow} from '/@/mainWindow';

/** 托盘图标 */
let tray;
let iconPath = fileUtils.getAssetsPath('img/icon.png');

export async function mainTray() {
  // 取消界面中的菜单栏
  Menu.setApplicationMenu(null);

  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开界面', click: () => {
        restoreOrCreateWindow();
      }
    },
    {label: '退出', role: 'quit'}
  ]);
  tray.setToolTip('electron-mailer2');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    restoreOrCreateWindow();
  });
}

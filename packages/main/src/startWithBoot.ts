import {app} from 'electron';

export async function startWithBoot() {
  if (import.meta.env.PROD)
    app.setLoginItemSettings({
      openAtLogin: true,
      args: ['--openAsHidden'],
    });
}

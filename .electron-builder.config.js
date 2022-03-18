if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date;
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  extraResources: [
    'run',
    'app-scripts'
  ],
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: [
    'packages/**/dist/**',
  ],
  extraMetadata: {
    // version: process.env.VITE_APP_VERSION,
    version: process.env.npm_package_version,
  },
  nsis: {
    artifactName: "${name}-setup-${version}.${ext}",
    deleteAppDataOnUninstall: true,
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
  publish: [
    {
      provider: "github",
      owner: "shampoo6",
      repo: "electron-mailer2"
    }
  ]
};

module.exports = config;

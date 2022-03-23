const {app} = require('electron');
const fsp = require('fs/promises');
const path = require('path');

let appPath = app.getAppPath();
const assetsPath = import.meta.env.DEV ? path.join(appPath, 'assets') : path.join(appPath, '../assets');

// 用于帮助读写项目数据的工具
export default {
  // 获取项目数据目录下指定文件夹路径
  // 且保证文件夹必然存在
  // 不支持多级目录
  async getAppDataPathWithExist(dirName: string) {
    const rPath = path.join(app.getPath('appData'), app.name, dirName);
    try {
      await fsp.access(rPath);
    } catch (e) {
      await fsp.mkdir(rPath);
    }
    return rPath;
  },

  // 获取 json 文档
  async getDocument(name: string) {
    const fileName = path.join(global.savePath, name);
    let document = null;
    try {
      await fsp.access(fileName);
      document = await fsp.readFile(fileName);
      document = JSON.parse(document.toString());
    } catch (e) {
      document = null;
    }
    return document;
  },

  async saveDocument(name: string, document: any) {
    const fileName = path.join(global.savePath, name);
    document = JSON.stringify(document);
    await fsp.writeFile(fileName, document);
  },
  // 获取静态资源的路径，_path 是 assets 路径下的相对路径
  getAssetsPath(_path: string) {
    return path.join(assetsPath, _path);
  }
};

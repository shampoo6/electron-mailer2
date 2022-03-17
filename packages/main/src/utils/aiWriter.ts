const electron = require('electron');
const log = require('electron-log')
const path = require('path')
const cp = require('child_process')

// ai 续写程序路径
let aiWriterPath = electron.app.getAppPath()
aiWriterPath = import.meta.env.DEV ? path.join(aiWriterPath, 'run') : path.join(aiWriterPath, '../run')

export default {
  // 开始续写
  // start: 起头的文本
  // length: 续写的字数
  write(start: string, length?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let text: any
      // 创建进程
      const p = cp.spawn('run',
        [start, length],
        {cwd: aiWriterPath})
      p.on('close', (code: any) => {
        log.debug(`ai writer child process ${p.pid} exited with code ${code}`)
        resolve(text)
      })
      p.on('error', (err: any) => {
        log.error(err)
        reject(err)
      })
      p.stdout.on('data', (data: any) => {
        let str = data.toString()
        str = str.substring(2, str.length - 3)
        let buff = Buffer.from(str, 'base64')
        text = buff.toString('utf-8')
      })
    })
  }
}

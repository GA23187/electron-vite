// main.js
// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const isDevelopment = process.env.NODE_ENV

 // 创建浏览器窗口
function createWindow () {
  const mainWindow = new BrowserWindow({
    id: 'electron',
    minWidth: 1100,
    minHeight: 700,
    autoHideMenuBar: true,
    fullscreenable: false,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: true,
    show: false,
    webPreferences: {
     // 在页面运行其他脚本之前预先加载指定的脚本 无论页面是否集成Node, 
     // 此脚本都可以访问所有Node API
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // 允许跨域？（特定electron版本下生效？）
      contextIsolation: false, // 上下文隔离
      nodeIntegration: true, //是否完整的支持 node. 默认值为true
      enableRemoteModule: true // remote模块
    }
  })
  // 加载 index.html
  mainWindow.loadURL(isDevelopment ? 'http://localhost:8050' : `file://${path.join(__dirname, '../dist/index.html')}`)
  // 打开开发工具
  if (isDevelopment) {
    mainWindow.webContents.openDevTools()
  }
  
  // 减少白屏时间
  mainWindow.on('ready-to-show', function () {
    mainWindow.show()
  })
  // 监听窗口大小改变事件
  mainWindow.on('resize', function () {
    mainWindow.webContents.send('resizeEvent', mainWindow.isMaximized())
  })
  
  mainWindow.hookWindowMessage(278, function (e) {
    mainWindow.setEnabled(false)
    setTimeout(() => {
      mainWindow.setEnabled(true)
    }, 100)
    return true
  })

  ipcMain.on('window-all-closed', (event, arg) => {
    // darwin 为ios系统
    if (process.platform !== 'darwin') app.quit()
  })
  // 最小化
  ipcMain.on('window-mini', (event, winId) => {
    mainWindow.minimize()
  })
  // 最大化
  ipcMain.on('window-max', (event, winId) => {
    mainWindow.maximize()
  })

  // 最大化/最小化
  ipcMain.on('window-max-min-size', (event, winId) => {
    if (winId) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  })

  // 还原
  ipcMain.on('window-restore', (event, winId) => {
    mainWindow.restore()
  })

  // 重新加载
  ipcMain.on('window-reload', (event, winId) => {
    mainWindow.reload()
  })
}

//Electron 支持的 Chrome 命令行开关
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('remote-debugging-port', '8315')
app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1')

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

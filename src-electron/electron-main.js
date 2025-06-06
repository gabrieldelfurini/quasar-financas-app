// imports

  import { app, BrowserWindow, Menu } from 'electron'
  import path from 'node:path'
  import os from 'node:os'
  import { fileURLToPath } from 'node:url'
  import { menuTemplate } from './menu/menu'


// contants and variables

  const platform = process.platform || os.platform()
  const currentDir = fileURLToPath(new URL('.', import.meta.url)),
        menu = Menu.buildFromTemplate(menuTemplate)
  export let mainWindow




// app ready

  app.whenReady().then(async () => {
      mainWindow = new BrowserWindow({
      icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
      width: 1000,
      height: 600,
      minWidth: 768,
      minHeight: 512,
      useContentSize: true,
      webPreferences: {
        contextIsolation: true,
        // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
        preload: path.resolve(
          currentDir,
          path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
        )
      }
    })

    if (process.env.DEV) {
      await mainWindow.loadURL(process.env.APP_URL)
    } else {
      await mainWindow.loadFile('index.html')
    }

    if (process.env.DEBUGGING) {
      // if on DEV or Production with debug enabled
      mainWindow.webContents.openDevTools()
    } else {
      // we're on production; no access to devtools pls
      mainWindow.webContents.on('devtools-opened', () => {
        mainWindow.webContents.closeDevTools()
      })
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })

    Menu.setApplicationMenu(menu)

  })


// app events

app.on('window-all-closed', () => {
  // if (platform !== 'darwin') {
    app.quit()
  // }
})

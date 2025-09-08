import { app, session, shell, BrowserWindow } from 'electron';
import path from 'node:path';
// import { URL } from 'node:url';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },

    // icon: '',
    fullscreenable: false,
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       'Content-Security-Policy': ['default-src \'self\'; script-src \'self\'; style-src \'self\''],
  //     }
  //   });
  // });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// app.on('web-contents-created', (event, contents) => {
//   contents.setWindowOpenHandler(({ url }) => {
//     // In this example, we'll ask the operating system
//     // to open this event's url in the default browser.
//     //
//     // See the following item for considerations regarding what
//     // URLs should be allowed through to shell.openExternal.
//     if (isSafeForExternalOpen(url)) {
//       setImmediate(() => {
//         shell.openExternal(url)
//       })
//     }

//     return { action: 'deny' }
//   })
// })

// app.on('web-contents-created', (event, contents) => {
//   contents.on('will-navigate', (event, navigationUrl) => {
//     const parsedUrl = new URL(navigationUrl)

//     if (parsedUrl.origin !== 'https://example.com') {
//       event.preventDefault()
//     }
//   })
// })



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


// ipcMain.handle('get-secrets', (e) => {
//   if (!validateSender(e.senderFrame)) return null
//   return getSecrets()
// })

// function validateSender (frame) {
//   // Value the host of the URL using an actual URL parser and an allowlist
//   if ((new URL(frame.url)).host === 'electronjs.org') return true
//   return false
// }
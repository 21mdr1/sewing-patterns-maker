// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer, app } = require('electron');

contextBridge.exposeInMainWorld('env', {
    desktop: true,
    isProd: () => ipcRenderer.invoke("isProd"),
});


contextBridge.exposeInMainWorld('exchangeData', {
    writeData: (filePath: string, data: any) => ipcRenderer.send("writeData", filePath, data),
    writeUsingDialog: (data: any) => ipcRenderer.send("writeData", data),
    readData: (filePath: string) => ipcRenderer.invoke("readData", filePath),
    readUsingDialog: () => ipcRenderer.invoke("readUsingDialog"),
})
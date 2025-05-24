// preload.js
// Expose Electron APIs to the renderer process

const { contextBridge, ipcRenderer, shell } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    // whitelist channels
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender` 
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  openExternal: (url) => {
    // Open URLs in the user's default browser
    if (typeof url === 'string' && (url.startsWith('https:') || url.startsWith('http:'))) {
      shell.openExternal(url);
    }
  }
}); 
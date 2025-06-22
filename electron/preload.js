// preload.js
// Expose Electron APIs to the renderer process

const { contextBridge, ipcRenderer, shell, app } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    // whitelist channels
    const validChannels = ['toMain', 'app-update'];
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
  },
  // Window control methods
  ipcRenderer: {
    send: (channel, ...args) => {
      // Whitelist window control channels
      const validChannels = ['window-minimize', 'window-maximize', 'window-close'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, ...args);
      }
    }
  },
  // Expose shell methods
  shell: {
    openExternal: (url) => {
      if (typeof url === 'string' && (url.startsWith('https:') || url.startsWith('http:'))) {
        shell.openExternal(url);
      }
    }
  },
  // Expose application version (for update checks)
  getVersion: () => {
    try {
      return ipcRenderer.sendSync('get-app-version');
    } catch (error) {
      console.error('Failed to retrieve app version from main process:', error);
      return 'unknown';
    }
  }
}); 
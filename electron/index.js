// electron/index.js

const { app, BrowserWindow, net, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Production renderer URL - UPDATE THIS TO YOUR VERCEL URL
const PRODUCTION_RENDERER_URL = 'https://app.acdc.digital'; // Your actual renderer URL

let nextServer = null;
let serverPort = 3002; // Default port for the renderer

// Start Next.js server in production
async function startNextServer() {
  if (isDev) {
    // In development, assume the server is already running
    return;
  }

  return new Promise((resolve, reject) => {
    // Path to the renderer directory in the packaged app
    const rendererPath = path.join(process.resourcesPath, 'app', 'renderer');
    
    // Start the Next.js server
    console.log('Starting Next.js server...');
    
    // Use npx to run next start
    nextServer = spawn('node', [
      path.join(rendererPath, 'node_modules', '.bin', 'next'),
      'start',
      '-p',
      serverPort.toString()
    ], {
      cwd: rendererPath,
      env: { ...process.env, NODE_ENV: 'production' },
      stdio: 'pipe'
    });

    nextServer.stdout.on('data', (data) => {
      console.log(`Next.js: ${data}`);
      if (data.toString().includes('started server on')) {
        console.log('✅ Next.js server started successfully');
        resolve();
      }
    });

    nextServer.stderr.on('data', (data) => {
      console.error(`Next.js Error: ${data}`);
    });

    nextServer.on('error', (error) => {
      console.error('Failed to start Next.js server:', error);
      reject(error);
    });

    // Give the server some time to start
    setTimeout(() => {
      resolve();
    }, 5000);
  });
}

// Check if the renderer server is running on a specific port
function isRendererServerRunning(port, callback) {
  const request = net.request({
    method: 'HEAD',
    url: `http://localhost:${port}`
  });
  
  request.on('response', (response) => {
    callback(response.statusCode === 200);
  });
  
  request.on('error', () => {
    callback(false);
  });
  
  request.end();
}

async function createWindow() {
  // Determine the correct icon path based on platform
  let iconPath;
  if (process.platform === 'darwin') {
    // macOS - use ICNS format for window icon
    iconPath = path.join(__dirname, "build", "icon.icns");
  } else if (process.platform === 'win32') {
    // Windows uses ICO format
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    // Linux uses PNG format
    iconPath = path.join(__dirname, "build", "icon.png");
  }

  // Debug: Log the icon path and check if file exists
  console.log('🖼️ Icon path:', iconPath);
  console.log('🖼️ Icon exists:', fs.existsSync(iconPath));
  console.log('🖼️ Platform:', process.platform);
  console.log('🖼️ __dirname:', __dirname);

  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    frame: false, // Remove the title bar (back to original design)
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    // Development mode: try to connect to dev server
    // Define ports to try (ordered by priority) - renderer should be on 3002
    const ports = [3002, 3000, 3001, 3003];
    
    // Try each port sequentially
    function tryNextPort(index) {
      if (index >= ports.length) {
        // If all ports failed, load the fallback HTML
        loadFallbackHTML(win);
        return;
      }
      
      const port = ports[index];
      isRendererServerRunning(port, (isRunning) => {
        if (isRunning) {
          // Renderer found at this port
          win.loadURL(`http://localhost:${port}`);
          console.log(`✅ Loaded renderer from development server at http://localhost:${port}`);
        } else {
          // Try the next port
          tryNextPort(index + 1);
        }
      });
    }
    
    // Start trying ports
    tryNextPort(0);
  } else {
    // Production mode: load from deployed Vercel URL
    console.log(`Loading renderer from ${PRODUCTION_RENDERER_URL}`);
    win.loadURL(PRODUCTION_RENDERER_URL);
    
    // Handle loading errors
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load renderer:', errorDescription);
      loadFallbackHTML(win);
    });
    
    win.webContents.on('did-finish-load', () => {
      console.log('✅ Successfully loaded renderer from Vercel');
    });
  }
}

function loadFallbackHTML(win) {
  // Create a simple HTML file for testing
  const htmlPath = path.join(__dirname, "index.html");
  if (!fs.existsSync(htmlPath)) {
    fs.writeFileSync(htmlPath, `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Soloist. | Take control of tomorrow, today.</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              margin: 0; 
              padding: 40px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
            }
            h1 { margin-bottom: 20px; font-size: 2.5em; }
            p { margin-bottom: 15px; font-size: 1.1em; }
            code { 
              background: rgba(255,255,255,0.2); 
              padding: 4px 8px; 
              border-radius: 4px; 
              font-family: 'Monaco', 'Menlo', monospace;
            }
          </style>
        </head>
        <body>
          <h1>🎵 Soloist Pro</h1>
          <p>Welcome to Soloist Pro!</p>
          <p>The Next.js renderer is not running yet.</p>
          <p>Start the full development environment with:</p>
          <p><code>pnpm dev</code></p>
          <p>Or start just the renderer with:</p>
          <p><code>pnpm --filter renderer dev</code></p>
        </body>
      </html>
    `);
  }
  win.loadFile(htmlPath);
  console.log("⚠️ Loaded fallback HTML - renderer not found on any port");
}

// IPC handlers for window controls
ipcMain.on('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.minimize();
  }
});

ipcMain.on('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.close();
  }
});

app.whenReady().then(() => {
  // Set dock icon explicitly for macOS - PNG works better than .icns for dock icons
  if (process.platform === 'darwin') {
    const dockIconPath = path.join(__dirname, "dock-icon-padded56.png");
    if (fs.existsSync(dockIconPath)) {
      app.dock.setIcon(dockIconPath);
      console.log('🖼️ Dock icon set to:', dockIconPath);
    } else {
      console.log('❌ Dock icon file not found:', dockIconPath);
    }
  }

  createWindow();
});

app.on("window-all-closed", () => {
  // Stop the Next.js server when closing
  if (nextServer) {
    nextServer.kill();
  }
  
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
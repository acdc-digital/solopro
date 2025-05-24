// electron/index.js

const { app, BrowserWindow, net } = require("electron");
const path = require("path");
const fs = require("fs");

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

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

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
          <title>Soloist Pro</title>
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

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
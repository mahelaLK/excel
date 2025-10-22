const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

const server = express();
const DIST_PATH = path.join(__dirname, '../dist');

server.use(express.static(DIST_PATH));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: false },
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    mainWindow.loadURL(`http://localhost:${PORT}`);
    // mainWindow.webContents.openDevTools();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

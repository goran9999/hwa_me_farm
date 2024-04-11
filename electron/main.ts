import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { spawn } from "child_process";
let mainWindow: BrowserWindow | null;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    width: 1100,
    height: 700,
    backgroundColor: "#191622",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY, {
    extraHeaders:
      "Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' data:;",
  });

  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on("message", (_, message) => {
    console.log(message);
  });
}

app.on("ready", startRustServer);

app
  .on("ready", () => {
    createWindow();
  })
  .whenReady()
  .then(registerListeners)
  .catch((e) => console.error(e));

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

let rustServerProcess: any = null;

function startRustServer() {
  let pathToExecutable;

  if (app.isPackaged) {
    pathToExecutable = path.join(process.resourcesPath, "release", "hwa_bot");
  } else {
    pathToExecutable = path.join(
      app.getAppPath(),
      "resources",
      "release",
      "hwa_bot"
    );
  }
  rustServerProcess = spawn(pathToExecutable);

  rustServerProcess.stdout.on("data", (data: any) => {
    console.log(`Rust server: ${data.toString()}`);
  });

  rustServerProcess.stderr.on("data", (data: any) => {
    console.error(`Rust server error: ${data.toString()}`);
  });

  rustServerProcess.on("close", (code: any) => {
    console.log(`Rust server process exited with code ${code}`);
  });
}

function stopRustServer() {
  console.log(app.getAppPath(), "APP PATH");

  if (rustServerProcess) {
    rustServerProcess.kill();
    console.log("Rust server stopped.");
  }
}

app.on("window-all-closed", () => {
  stopRustServer();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

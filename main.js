//Import core modules to create root / life of the application
const electron = require('electron');
const path = require('path');
const url = require('url');

//Get required modules from electron to create the App, BrowserWindow or any other
const {app, BrowserWindow, Menu, ipcMain, shell} = electron;

let mainWindow;

//Menu Template
const MenuTemplate = [
    {
        label: 'Menu',
        submenu: [
            {label: 'Adjust Notification Value'},
            {
                label: 'Coin Market Cap',
                click() {
                    shell.openExternal('https://coinmarketcap.com/');
                }
            },
            {type: 'separator'},
            {
                role: 'reload',
                accelerator: process.platform === 'darwin' ? 'Command+R' : 'Ctrl+R'
            },
            {
                label: 'Exit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }
];

//Add an empty object to the Menu template for Mac
if (process.platform === 'darwin') MenuTemplate.unshift({});

//Add Dev tools if not in production
if (process.env.NODE_ENV !== 'production') {
    MenuTemplate.push({
        label: 'Developer Options',
        submenu: [
            {
                label: 'Show / Hide tools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label: 'Maximize / Minimize',
                click(item, focusedWindow) {
                    if (focusedWindow.isMaximized()) focusedWindow.minimize();
                    focusedWindow.maximize();
                }
            }
        ]
    })
}

app.on('ready', () => {
    createMainWindow();

    //Quit App when Main Window is closed
    mainWindow.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    mainWindow.on('closed', () => {
        app.quit();
    });

    //Activate Main Window
    mainWindow.on('activate', () => {
        if (mainWindow == null) createMainWindow();
    });

    if (Array.isArray(MenuTemplate)) {
        const mainTemplate = Menu.buildFromTemplate(MenuTemplate);
        Menu.setApplicationMenu(mainTemplate);
    }
});

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        title: app.getName()
    });

    //Load rendering directory / page (index.html)
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }));
}

ipcMain.on('update-notify-value', (event, arg) => {
    mainWindow.webContents.send('targetPriceVal', arg);
});


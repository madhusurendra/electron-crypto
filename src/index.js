const electron = require('electron');
const path = require('path');
const ipc = electron.ipcRenderer;

//Get required modules from electron to create the App, BrowserWindow or any other
const {ipcMain} = electron;
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios');


const notifyBtn = document.getElementById('notifyBtn');
var price = document.querySelector('h1');
var targetPrice = document.getElementById('targetPrice');
var targetPriceVal;

const notification = {
    title: 'BTC Alert!',
    body: 'BTC just crossed your price.'
};


function createAddWindow(path) {
    let win = new BrowserWindow({
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        width: 400,
        height: 200
    });
    win.on('close',() => {
        win = null;
    });
    win.loadURL(path);
    win.show();
}

function getBTC () {
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR')
        .then((response) => {
            const cryptos = response.data.USD;
            price.innerHTML = '$' + cryptos.toLocaleString('en');

            if ((!price.innerHTML || price.innerHTML != '') && targetPriceVal < response.data.USD) {
                const myNotification = new window.Notification(notification.title, notification);
            }
        })
}

getBTC();
setInterval(getBTC, 1000);

notifyBtn.addEventListener('click', (event) => {
    const modalPath = path.join('file://', __dirname, 'add-window.html');
    createAddWindow(modalPath);

});

ipc.on('targetPriceVal', (event, arg) => {
    targetPriceVal = Number(arg);
    targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en');
});
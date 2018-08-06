const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const closeBtn = document.getElementById('closeBtn');
const updateBtn = document.getElementById('updateBtn');

closeBtn.addEventListener('click', (event) => {
   var window = remote.getCurrentWindow();
   window.close();
});

updateBtn.addEventListener('click', event => {
   ipc.send('update-notify-value', document.getElementById('notifyVal').value);

   var window = remote.getCurrentWindow();
   window.close();
});

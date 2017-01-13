const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

var main_window;

function CreateWindow(){
    //Create main window
    main_window = new BrowserWindow({
        width: 1024,
        height: 720,
        resizable: false,
        frame: false,
        icon: url.format({
            pathname: path.join(__dirname, 'images/icon.png')
        })
    });

    //Load index.html web page
    main_window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Setup development tools
    //main_window.webContents.openDevTools();

    //When 'main_window' is closed set it to null
    main_window.on('closed', function(){
        main_window = null;
    });

    console.log(url.format({
            pathname: path.join(__dirname, 'images/icon.png'),
            protocol: 'file:',
            slashes: true
        }));
}

//EVENTS
app.on('ready', CreateWindow);
app.on('window-all-closed', function(){
    if (process.platform != 'darwin'){
        app.quit();
    }
});
app.on('activate', function(){
    if (main_window === null){
        CreateWindow();
    }
});
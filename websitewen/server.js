const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const SerialPort = require('serialport');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;
const path = require('path');


app.use('/pictures', (express.static('./pictures')));
app.use('/websitewen', (express.static('./websitewen')));
app.use(express.static(path.join(__dirname, 'websitewen')));
app.use('/', express.static(path.join(__dirname, 'pictures')));

app.use(express.static(path.join(__dirname, 'public')));



// Set the view engine to ejs
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));

const SERIAL_PORT_AVAILABLE = true;  // Set this to either true or false if you're using a serial port or not
const SERIAL_PORT_PATH_MAC = '/dev/cu.usbserial-230';  // Set the path to your serial port
const SERIAL_PORT_PATH_WINDOWS = 'COM3';  // Set the path to your serial port on Windows

let parser;
if (SERIAL_PORT_AVAILABLE) {
    const { ReadlineParser } = require("@serialport/parser-readline");
    const parser = new ReadlineParser({ delimiter: "\r\n" });


    const portArduino = new SerialPort.SerialPort({
        path: SERIAL_PORT_PATH_MAC,
        baudRate: 9600
    });

    portArduino.on('error', (err) => {
        console.error('Serial port: ', err.message);
    });

    portArduino.pipe(parser);
    console.log(io.sockets.version); // will print the version number of the socket.io client
    parser.on('data', (data) =>{
    
    console.log('Data:', data);

    io.emit('keypadData', {key: data.trim() });

    if(data.trim() === 'accepted'){
        io.emit('accepted');
    }
    if(data.trim() === 'button1'){
        io.emit('button1');
    }

    if(data.trim() === 'button3'){
        io.emit('button3');
    }
    var datarrray = data.split(',');
      
    var key1 = datarrray[0];
    var key2 = datarrray[1];

      //io.emit('data', data);
      io.emit('keypadData', {key1: key1, key2: key2});

      if(data.trim() === 'ZERO'){
        io.emit('erase');
      }
      if(data.trim() === 'enter'){
        io.emit('enter');    
  }
    });

    //temporary JSON
    app.get('/data', (req, res) => {
        res.json(data1);
      })
    const jsonData = fs.readFileSync(path.join(__dirname, 'data.json'));
    const data1 = JSON.parse(jsonData);
    console.log(data1);

    io.on('connection', (socket) => {
        // Example trigger for 'accepted' event
        socket.on('someTrigger', () => {
            console.log('Trigger received, sending accepted event...');
            socket.emit('accepted');  // Make sure this is emitting correctly
        });

    
    });

} else {
    console.log("Serial port is not available, running in mock mode.");
    // Optional: Implement mock data handling or notifications
}

// Serve the MAIN page
app.get('/', (req, res) => {
    // res.render('pages/index');
    res.render('pages/index', {
        title: 'Scanscherm' // Automatically uses layout.ejs and passes this title
    });
});

// Serve the pinscherm
app.get('/pin', (req, res) => {
    res.render('pages/pin', {
        title: 'Pinscherm' // Automatically uses layout.ejs and passes this title
    });
});

// Serve the scanscherm
app.get('/scan', (req, res) => {
    res.render('pages/scan', {
        title: 'Scanscherm' // Automatically uses layout.ejs and passes this title
    });
});

// Serve the keuzescherm
app.get('/keuze', (req, res) => {
    
    res.render('pages/keuze', { 
        title: 'Keuzescherm'
    });

});

// Serve the saldoscherm
app.get('/saldo', (req, res) => {
    res.render('pages/saldo', {
        title: 'Saldoscherm' // Automatically uses layout.ejs and passes this title
    });
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
  });


// //OLD CONTENT
// // Serve the Pin page
// app.get('/landing', (req, res) => {
//     res.sendFile(__dirname + '/landing.html');
// });

// // Serve the Select page
// app.get('/Select', (req, res) => {
//     res.sendFile(__dirname + '/Select.html');
// });




// Handle form submission and API request
app.get('/api/balance/:bankAccount/:pinCode', async (req, res) => {
    const { bankAccount, pinCode } = req.params;

    try {
        const response = await fetch(`http://145.24.223.51:8001/api/balance/${bankAccount}/${pinCode}`);
        const data = await response.json();

        if (response.ok) {
           res.json(data);
        } else {
            // Handle incorrect pin code or bank account number
            res.status(400).json({ error: 'Incorrect pin code or bank account number.' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching balance.' });
    }
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

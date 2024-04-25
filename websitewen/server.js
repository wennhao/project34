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

const SERIAL_PORT_AVAILABLE = false;  // You can set this based on some condition or configuration

let parser;
if (SERIAL_PORT_AVAILABLE) {
    const { ReadlineParser } = require("@serialport/parser-readline");
    const parser = new ReadlineParser({ delimiter: "\r\n" });


    const portArduino = new SerialPort({
        path: "COM8",
        baudRate: 9600
    });

    portArduino.on('error', (err) => {
        console.error('Serial port: ', err.message);
    });

    portArduino.pipe(parser);
    console.log(io.sockets.version); // will print the version number of the socket.io client
    parser.on('data', (data) =>{
    if(data.trim() === 'accepted'){
        io.emit('accepted');
    }
    if(data.trim() === 'button1'){
        io.emit('button1');
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
} else {
    console.log("Serial port is not available, running in mock mode.");
    // Optional: Implement mock data handling or notifications
}

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/landing.html');
});

// Serve the balance inquiry page
app.get('/balance-inquiry', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve the Pin page
app.get('/Pin', (req, res) => {
    res.sendFile(__dirname + '/Pin.html');
});

// Serve the Select page
app.get('/Select', (req, res) => {
    res.sendFile(__dirname + '/Select.html');
});

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

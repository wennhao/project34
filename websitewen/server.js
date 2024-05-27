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
const SERIAL_PORT_PATH_MAC = '/dev/cu.usbmodem2301';  // Set the path to your serial port
const SERIAL_PORT_PATH_WINDOWS = 'COM10';  // Set the path to your serial port on Windows
const SERIAL_PORT_PATH_RASPBERRYPI = '/dev/ttyUSB0';  // Set the path to your serial port on Raspberry Pi

let parser;
if (SERIAL_PORT_AVAILABLE) {
    const { ReadlineParser } = require("@serialport/parser-readline");
    const parser = new ReadlineParser({ delimiter: "\r\n" });

    const portArduino = new SerialPort.SerialPort({
        path: SERIAL_PORT_PATH_WINDOWS,
        baudRate: 9600
    });

    portArduino.on('error', (err) => {
        console.error('Serial port: ', err.message);
    });

// Serialport to Arduino communication
io.on('connection', (socket) => {
    console.log('A user connected');
      
    socket.on('disconnect', () => {
    console.log('User disconnected');
});
      
socket.on('sendData', (amount) => {
    console.log('Received data from client:', amount);
        portArduino.write(amount + '\n', (err) => {
            if (err) {
                console.error('Error writing to serial port:', err);
            } else {
                console.log('Data written to serial port:', amount);
            }
        });
});
socket.on('sendAccountinfo', (data) => {
    console.log('Received data from client:', data);
        portArduino.write(data + '\n', (err) => {
            if (err) {
                console.error('Error writing to serial port:', err);
            } else {
                console.log('Data written to serial port:', data);
            }
        });
});
});

    portArduino.pipe(parser);
    console.log(io.sockets.server.engine.clientsCount); // Will print the number of connected clients
    console.log(io.sockets.version); // will print the version number of the socket.io client
    parser.on('data', (data) =>{
    
        console.log('Data:', data);
        if (data.startsWith('rfid:')) {
            const rfidData = data.slice(5).replace(/\u0000/g, '').trim(); // Remove the 'rfid:' prefix and clean the data
            io.emit('rfidData', rfidData); // Emit the RFID data to all connected clients
        }

        io.emit('keypadData', {key: data.trim() });

    if(data.trim() === 'button1'){
        io.emit('button1');
    }

    if(data.trim() === 'button2'){
        io.emit('button2');
    }

    if(data.trim() === 'button3'){
        io.emit('button3');
    }

    if(data.trim() === 'button4'){
        io.emit('button4');
    }

    if(data.trim() === 'button5'){
        io.emit('button5');
    }

    if(data.trim() === 'button6'){
        io.emit('button6');
    }
    var datarrray = data.split(',');

    var key1 = datarrray[0];
    var key2 = datarrray[1];

      //io.emit('data', data);
    io.emit('keypadData', {key1: key1, key2: key2});

    });


    io.on('connection', (socket) => {
        console.log('Client connected');
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

// Serve the opnemenscherm
app.get('/opnemen', (req, res) => {
    res.render('pages/opnemen', {
        title: 'Opnemenscherm' // Automatically uses layout.ejs and passes this title
    });
});

// Serve the snelopnemenscherm
app.get('/opnemenbedrag', (req, res) => {
    res.render('pages/opnemenbedrag', {
        title: 'Opnemenbedragscherm' // Automatically uses layout.ejs and passes this title
    });
});

// Serve the snelopnemenscherm
app.get('/snelopnemen', (req, res) => {
    res.render('pages/snelopnemen', {
        title: 'snelopnemen' // Automatically uses layout.ejs and passes this title
    });
});

// Serve the snelopnemenscherm
app.get('/bon', (req, res) => {
    res.render('pages/bon', {
        title: 'Bonscherm' // Automatically uses layout.ejs and passes this title
    });
});

// Serve the snelopnemenscherm
app.get('/success', (req, res) => {
    res.render('pages/success', {
        title: 'Successscherm' // Automatically uses layout.ejs and passes this title
    });
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
  });




// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

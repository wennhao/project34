const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const SerialPort = require('serialport');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

app.use('/pictures', express.static('./pictures'));
app.use('/websitewen', express.static('./websitewen'));
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

let portArduino;

if (SERIAL_PORT_AVAILABLE) {
    const { ReadlineParser } = require('@serialport/parser-readline');
    const parser = new ReadlineParser({ delimiter: '\r\n' });

    portArduino = new SerialPort.SerialPort({
        path: SERIAL_PORT_PATH_MAC,
        baudRate: 9600
    });

    portArduino.on('error', (err) => {
        console.error('Serial port error:', err.message);
    });

    portArduino.pipe(parser);

    parser.on('data', (data) => {
        console.log('Data:', data);
        if (data.startsWith('rfid:')) {
            const rfidData = data.slice(5).replace(/\u0000/g, '').trim(); // Remove the 'rfid:' prefix and clean the data
            io.emit('rfidData', rfidData); // Emit the RFID data to all connected clients
        }

        io.emit('keypadData', { key: data.trim() });

        if (data.trim() === 'button1') {
            io.emit('button1');
        } else if (data.trim() === 'button2') {
            io.emit('button2');
        } else if (data.trim() === 'button3') {
            io.emit('button3');
        } else if (data.trim() === 'button4') {
            io.emit('button4');
        } else if (data.trim() === 'button5') {
            io.emit('button5');
        } else if (data.trim() === 'button6') {
            io.emit('button6');
        }
    });
} else {
    console.log("Serial port is not available, running in mock mode.");
    // Optional: Implement mock data handling or notifications
}

// WebSocket communication
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('sendData', (dataString) => {
        console.log('Received data from client:', dataString);
        portArduino.write(dataString + '\n', (err) => {
            if (err) {
                return console.error('Error writing to serial port:', err);
            }
            console.log('Data written to serial port');
        });
    });
});

// Serve the MAIN page
app.get('/', (req, res) => {
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

// Serve the bon scherm
app.get('/bon', (req, res) => {
    res.render('pages/bon', {
        title: 'Bonscherm' // Automatically uses layout.ejs and passes this title
    });
});

// Serve the success scherm
app.get('/success', (req, res) => {
    res.render('pages/success', {
        title: 'Successscherm' // Automatically uses layout.ejs and passes this title
    });
});

// Serve the biljetkeuze scherm
app.get('/biljetkeuze', (req, res) => {
    res.render('pages/biljetkeuze', {
        title: 'Biljetscherm' // Automatically uses layout.ejs and passes this title
    });
});

// about page
app.get('/about', (req, res) => {
    res.render('pages/about');
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

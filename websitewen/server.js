const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const SerialPort = require('serialport');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/landing.html');
});

// Serve the balance inquiry page
app.get('/balance-inquiry', (req, res) => {
    res.sendFile(__dirname + '/index.html');
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

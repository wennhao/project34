// Import the sendPostRequest function from getaccountinfo.js
import { getAccountInfo } from './getaccountinfo.js';

socket.on('connect', function() {
    console.log('Connected to WebSocket server!');
});
let pinCode = '1234';
socket.on('button3', function() {
    // Als de gebruiker zich op de saldo pagina bevindt
    console.log('Redirecting to success page...');
    window.location.replace('/success');
});
  // Add event listener for key press
socket.on('button6', function() {
        // Prompt the user for a PIN code (for demonstration purposes)
        if (window.location.pathname.includes('/bon')) { //nee button
            if (pinCode) {
                getAccountInfo(pinCode, function(success, data) {
                    if (success) {
                        console.log('Data retrieved successfully:', data);
                        socket.emit('sendAccountinfo', data);
                        // Als de gebruiker zich op de saldo pagina bevindt
                        console.log('Redirecting to success page...');
                        window.location.replace('/success');
                    } else {
                        console.log('Failed to retrieve data:', data);
                    }
                });
            }
        }
});

// Combined handler
socket.on('sendDataOrAccountInfo', (data) => {
    let message;
    if (data.type === 'data') {
        console.log('Received data from client:', data.amount);
        message = `SEND_DATA:${data.amount}\n`;
    } else if (data.type === 'accountInfo') {
        console.log('Received account info from client:', data);
        message = `SEND_ACCOUNT_INFO:${data.firstname},${data.balance}\n`;
    }

    if (message) {
        portArduino.write(message, (err) => {
            if (err) {
                console.error('Error writing to serial port:', err);
            } else {
                console.log('Data written to serial port:', message);
            }
        });
    }
});
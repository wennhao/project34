// Import the sendPostRequest function from getaccountinfo.js
import { determineAccountInfo } from './getaccountinfo.js';

socket.on('connect', function() {
    console.log('Connected to WebSocket server!');
});
let pinCode = sessionStorage.getItem('pincode');
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
                determineAccountInfo(pinCode, function(success, data) {
                    if (success) {
                        console.log('Data retrieved successfully:', data);
                        socket.emit('sendData', data);
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
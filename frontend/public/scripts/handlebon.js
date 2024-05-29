
import { determineWithdraw, withdraw } from './withdraw.js';

let pinCode = sessionStorage.getItem("pincode");

// Import the sendPostRequest function from getaccountinfo.js
import { determineAccountInfo } from './getaccountinfo.js';
socket.on('connect', function() {
    console.log('Connected to WebSocket server!');
});

socket.on('button3', function() {
    console.log('Redirecting to success page...');
    window.location.replace('/success');
});

socket.on('button6', function() {
    if (window.location.pathname.includes('/bon')) {
        const amount = parseFloat(sessionStorage.getItem('amount')); // Retrieve the amount from localStorage
        console.log('Retrieved amount from localStorage:', amount);       
        if (amount) {
            // First, withdraw the amount
                    // Next, get account info
                    getAccountInfo(pinCode, function(success, data) {
                        if (success) {
                            determineWithdraw(amount); 
                            console.log('Account info retrieved successfully:', data);
                            // Combine amount and account info and send them in one event
                            socket.emit('sendData', amount, data);
                            // Redirect to success page
                            console.log('Redirecting to success page...');
                            window.location.replace('/success');
                        
                    
                } 
            });
        } else {
            console.log('Amount not found in sessionStorage');
        }
    }
});


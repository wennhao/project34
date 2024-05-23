// Import the sendPostRequest function from getaccountinfo.js
import { getAccountInfo } from './getaccountinfo.js';

  // Add event listener for key press
  document.addEventListener('keypress', function(event) {
    if (event.key === 'k') {
        // Prompt the user for a PIN code (for demonstration purposes)
        let pinCode = sessionStorage.getItem('pincode');
        
        if (pinCode) {
            getAccountInfo(pinCode, function(success, data) {
                if (success) {
                    console.log('Data retrieved successfully:', data);
                    socket.emit('sendData', data);
                } else {
                    console.log('Failed to retrieve data:', data);
                    alert('Failed to retrieve data: ' + JSON.stringify(data));
                }
            });
        } else {
            alert('PIN code is required to retrieve data.');
        }
    }
});
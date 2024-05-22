// Import the sendPostRequest function from getaccountinfo.js
import { getAccountInfo } from './getaccountinfo.js';

   // Add event listener for key press
   document.addEventListener('keypress', function(event) {
    if (event.key === 'k') {
        // Replace '1234' with the actual pin code if needed
        let pinCode = '1234';
        getAccountInfo(pinCode, function(success, data) {
            if (success) {
                console.log('Data retrieved successfully:', data);
            } else {
                console.log('Failed to retrieve data:', data);
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', (event) => {
    // Clear session storage on page load
    sessionStorage.clear();
    console.log('Session storage cleared');
    
    var socket = io();

    socket.on('rfidData', function(data) {
        console.log('RFID Data received:', data);
        handleRFIDData(data);
    });
});

function handleRFIDData(data) {
    // Clean up the data by removing null characters and trimming whitespace
    data = data.replace(/\u0000/g, '').trim();

    // Assuming the data is in the format: "IM01WINB01234567899117E61D"
    if (data && data.length >= 26) { // Ensure the data length is at least 26 characters
        const IBAN = data.slice(0, 18); // Extract the first 18 characters as IBAN
        const UID = data.slice(18);     // Extract the remaining characters as UID

        // Save IBAN and UID into sessionStorage
        sessionStorage.setItem('iban', IBAN);
        sessionStorage.setItem('uid', UID);

        console.log('iban:', IBAN);
        console.log('uid:', UID);

        // Optionally, redirect to another page or perform other actions
        window.location.href = '/pin'; // Redirect to another page if needed
    } else {
        console.error('Invalid RFID data received:', data);
    }
}

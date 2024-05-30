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
    const messageDisplay = document.getElementById('message');
    messageDisplay.textContent = ''; // Clear previous messages
    // Clean up the data by removing null characters and whitespace
    data = data.replace(/\u0000/g, '').replace(/\s+/g, '').trim();

    // Assuming the data is in the format: "IM01WINB01234567899117E61D"
    if (data && data.length >= 26) { // Ensure the data length is at least 26 characters
        const IBAN = data.slice(0, 18); // Extract the first 18 characters as IBAN
        const UID = data.slice(18);     // Extract the remaining characters as UID

        // Validate IBAN format: 2 letters, 2 digits, 4 letters, 10 digits
        const ibanPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{4}[0-9]{10}$/;
        // Validate UID format: 8 hexadecimal characters
        const uidPattern = /^[0-9A-Fa-f]{8}$/;

        if (ibanPattern.test(IBAN) && uidPattern.test(UID)) {
            // Save IBAN and UID into sessionStorage
            sessionStorage.setItem('iban', IBAN);
            sessionStorage.setItem('uid', UID);

            console.log('iban:', IBAN);
            console.log('uid:', UID);

            // Optionally, redirect to another page or perform other actions
            window.location.href = '/pin'; // Redirect to another page if needed
        } else {
            messageDisplay.textContent = 'Het scannen is niet gelukt. Probeer het opnieuw.';
            console.error('Invalid IBAN or UID format:', IBAN, UID);
        }
    } else {
        console.error('Invalid RFID data received:', data);
    }
}

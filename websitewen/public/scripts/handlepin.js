// Import the sendPostRequest function from getaccountinfo.js
import { sendPostRequest } from './getaccountinfo.js';

let actualInput = ""; // This will store the actual typed characters
let remainingAttempts = 3; // Maximum attempts allowed

// Response handler defined in the same module
function responseHandler(success, data) {
    const messageDisplay = document.getElementById('message');
    if (success) {
        console.log("Login Successful:", data);
        window.location.href = '/keuze'; // Redirect on success
        remainingAttempts = 3; // Reset attempts on successful login
    } else {
        remainingAttempts--; // Decrement the attempts on a failed login
        if (remainingAttempts > 0) {
            console.log("Login Failed:", data.message);
            messageDisplay.textContent = `Incorrecte PIN. ${remainingAttempts} pogingen over!`;
        } else {
            console.log("Login Failed: No attempts left");
            messageDisplay.textContent = "Geen pogingen over. Neem contact op met de bank.";
            document.getElementById('password').disabled = true; // Disable input after max attempts reached
        }
        actualInput = ""; // Clear the input after every incorrect attempt
        updateDisplay(); // Update the display to reflect the cleared input
    }
}



function handleInput(key) {
    const messageDisplay = document.getElementById('message');

    if (key === "B" || key === "b") {
        actualInput = actualInput.slice(0, -1);
    } else if (key === "C" || key === "c") {
        actualInput = ""; // Clear the entire input
    } else if (key === "D" || key === "d") {
        if (actualInput.length === 4 && remainingAttempts > 0) {
            sendPostRequest(actualInput, responseHandler);
        }
        // Additional logic is not needed here as the actualInput is handled in responseHandler
    } else if (/^[0-9]$/i.test(key) && actualInput.length < 4) {
        actualInput += key; // Add the key if it's a number and there's space
    }
    updateDisplay(); // This should be called to reflect any changes to actualInput
}



function updateDisplay() {
    var passwordInput = document.getElementById('password');
    passwordInput.value = '*'.repeat(actualInput.length).split('').join('    '); // Show spaced asterisks as the input
}

var socket = io();
socket.on('keypadData', function(data) {
    handleInput(data.key); // Handle each key press from Arduino
});

document.getElementById('password').addEventListener('keydown', function(event) {
    event.preventDefault(); // Prevent typing
});
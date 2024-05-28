// Import the getAccountInfo function from getaccountinfo.js
import { determineAccountInfo } from './getaccountinfo.js';

let actualInput = ""; // This will store the actual typed characters
let remainingAttempts = 3; // Maximum attempts allowed

// Function to block card
async function blockCard(uid) {
    try {
        const response = await fetch('/api/blockcard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid })
        });

        const data = await response.json();
        if (data.success) {
            console.log('Card blocked successfully.');
        } else {
            console.error('Failed to block card:', data.message);
        }
    } catch (error) {
        console.error('Error blocking card:', error);
    }
}

// Response handler defined in the same module
function responseHandler(success, data) {
    const messageDisplay = document.getElementById('message');
    messageDisplay.textContent = ''; // Clear previous messages

    if (success) {
        console.log("Login Successful:", data);
        sessionStorage.setItem('pincode', actualInput);
        window.location.href = '/keuze'; // Redirect on success
        remainingAttempts = 3; // Reset attempts on successful login
    } else {
        remainingAttempts--; // Decrement the attempts on a failed login
        if (remainingAttempts > 0) {
            console.log("Login Failed:", data.message);
            let errorDiv = document.createElement('div');
            errorDiv.textContent = 'Incorrecte PIN.';
            messageDisplay.appendChild(errorDiv);
            
            let attemptsDiv = document.createElement('div');
            attemptsDiv.textContent = `${remainingAttempts} pogingen over!`;
            messageDisplay.appendChild(attemptsDiv);
        } else {
            console.log("Login Failed: No attempts left");
            let contactDiv1 = document.createElement('div');
            contactDiv1.textContent = 'Geen pogingen meer over.';
            messageDisplay.appendChild(contactDiv1);
            let contactDiv2 = document.createElement('div');
            contactDiv2.textContent = 'Neem contact op met de bank';
            messageDisplay.appendChild(contactDiv2);
            document.getElementById('password').disabled = true; // Disable input after max attempts reached
            
        }
        actualInput = ""; // Clear the input after every incorrect attempt
        updateDisplay(); // Update the display to reflect the cleared input
    }
}

function handleInput(key) {
    if (key === "B" || key === "b") {
        actualInput = actualInput.slice(0, -1);
    } else if (key === "C" || key === "c") {
        actualInput = ""; // Clear the entire input
    } else if (key === "D" || key === "d") {
        if (actualInput.length === 4 && remainingAttempts > 0) {
            determineAccountInfo(actualInput, responseHandler);
        }
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

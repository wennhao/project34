// Import the getAccountInfo function from getaccountinfo.js
import { determineWithdraw } from './withdraw.js';


let actualInput = ""; // This will store the actual typed characters
const saldo = sessionStorage.getItem('saldo');
if (saldo) {
    const messageDisplay = document.getElementById('balance');
    let balanceDiv = document.createElement('div');
    balanceDiv.textContent = 'Huidig Saldo: €' + saldo;
    messageDisplay.appendChild(balanceDiv);
}

function handleInput(key) {
    const messageDisplay = document.getElementById('message');
    if (key === "B" || key === "b") {
        actualInput = actualInput.slice(0, -1); // Remove the last character
    } else if (key === "C" || key === "c") {
        actualInput = ""; // Clear the entire input
    } else if (key === "D" || key === "d") {
        if (actualInput.length >= 2) {
            const amount = parseFloat(actualInput);
            // Call the withdraw function
            determineWithdraw(amount, (success, data) => {
                if (success) {
                    console.log("Balance withdrawn successfully:", data.newBalance);
                    localStorage.setItem('saldo', data.newBalance); // Update the new balance in localStorage
                    window.location.href = '/bon'; // Redirect on success
                } else {
                    alert(`Error: ${data.message}`);
                }
            });
        }
    } else if (/^[0-9]$/i.test(key) && actualInput.length < 3) {
        actualInput += key; // Add the key if it's a number and there's space
    }
    updateDisplay(); // This should be called to reflect any changes to actualInput
}

function updateDisplay() {
    var amountInput = document.getElementById('text');
    // Directly use actualInput with € prefix
    amountInput.value = '€' + actualInput;
}

var socket = io();
socket.on('keypadData', function(data) {
    handleInput(data.key); // Handle each key press from Arduino
});

document.getElementById('text').addEventListener('keydown', function(event) {
    event.preventDefault(); // Prevent typing in the field
});

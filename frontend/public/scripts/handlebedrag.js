let actualInput = ""; // This will store the actual typed characters
let pinLimit = 150; // Maximum amount that can be withdrawn
const saldo = sessionStorage.getItem('saldo');
if (saldo) {
    const messageDisplay = document.getElementById('balance');
    let balanceDiv = document.createElement('div');
    balanceDiv.textContent = 'Huidig Saldo: €' + saldo;
    messageDisplay.appendChild(balanceDiv);
}

function handleInput(key) {
    const messageDisplay = document.getElementById('message');
    messageDisplay.textContent = ''; // Clear previous messages
    if (key === "B" || key === "b") {
        actualInput = actualInput.slice(0, -1); // Remove the last character
    } else if (key === "C" || key === "c") {
        actualInput = ""; // Clear the entire input
    } else if (key === "D" || key === "d") {
        if (actualInput.length >= 2) {
            const amount = parseFloat(actualInput);
            if (amount % 5 === 0) {
                // Call the withdraw function
                sessionStorage.setItem('current', amount); // Store the amount in sessionStorage
                console.log("Amount -->", amount);
                sessionStorage.setItem('saldo', saldo - amount); // Update the new balance in localStorage   
                console.log("newBalance -->", saldo - amount);              
                window.location.href = '/bon'; // Redirect on success
            } else if (actualInput > pinLimit) {
                messageDisplay.textContent = 'Het maximale bedrag dat kan worden opgenomen is €500.';
            } else {
                messageDisplay.textContent = 'Voer een bedrag in dat eindigt op 0 of 5.';
            }
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

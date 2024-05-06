import {sendPostRequest}  from './getaccountinfo.js'; // Import the sendPostRequest function from getaccountinfo.js

let actualInput = ""; // This will store the actual typed characters

function handleInput(key) {
  if (key === "B" || key === "b") { //press B to remove the last character
    actualInput = actualInput.slice(0, -1); // Remove the last character
  } else if (key === "C" || key === "c") { //press C to clear the entire input
    actualInput = ""; // Clear the input
  } else if (key === "D" || key === "D") { //press C to clear the entire input
    if (actualInput.length === 4) { // Ensure the PIN is fully entered
      sendPostRequest(actualInput);
    }
  } else if (/^[0-9]$/i.test(key) && actualInput.length < 4) {
    actualInput += key; // Add the key if it's a number and there's space
    console.log(actualInput); //remove on stable version
  }
  updateDisplay();
}

function updateDisplay() {
  var passwordInput = document.getElementById('password');
  passwordInput.value = '*'.repeat(actualInput.length).split('').join('    ');
}



var socket = io();

// Listen for keypad data sent from the server
socket.on('keypadData', function(data) {
  handleInput(data.key); // Handle each key press from Arduino
});

// Adding this to prevent any manual keyboard input
document.getElementById('password').addEventListener('keydown', function(event) {
  event.preventDefault(); // Prevent typing
});
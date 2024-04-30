let actualInput = ""; // This will store the actual typed characters

function handleInput(key) {
  if (key === "enter" || key === "b") {
    actualInput = actualInput.slice(0, -1); // Remove the last character
  } else if (key === "ZERO" || key === "c") {
    actualInput = ""; // Clear the input
  } else if (/^[0-9]$/i.test(key) && actualInput.length < 4) {
    actualInput += key; // Add the key if it's a number and there's space
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
let actualInput = ""; // This will store the actual typed characters

function handleKeyPress(event) {
    var passwordInput = document.getElementById('password');
    if (event.key === "B" || event.key === "b") {
        // Remove the last character when 'B' is pressed
        actualInput = actualInput.slice(0, -1);
        updateDisplay();
        event.preventDefault(); // Prevent the 'B' from being added to the input
    } else if (event.key === "C" || event.key === "c") {
        // Clear the entire input when 'C' is pressed
        actualInput = "";
        updateDisplay();
        event.preventDefault(); // Prevent the 'C' from being added to the input
    } else if (/^[0-9]$/i.test(event.key) && actualInput.length < 4) {
        // Allow numeric input and check for length limit
        actualInput += event.key;
        updateDisplay();
    } else {
        // Prevent any non-numeric input or if input length reaches 4
        event.preventDefault();
    }
}

function updateDisplay() {
    var passwordInput = document.getElementById('password');
    passwordInput.value = '*'.repeat(actualInput.length).split('').join('    '); // Adjust the number of spaces as needed
}

document.getElementById('password').addEventListener('input', updateDisplay);

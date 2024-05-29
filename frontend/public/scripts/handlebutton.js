// Assuming the IBAN and UID are constant or predefined
let iban = sessionStorage.getItem('iban');  // Replace with actual IBAN if needed
let uid = sessionStorage.getItem('uid');                    // Replace with actual UID if needed
let pinCode = sessionStorage.getItem('pincode'); // Assuming the PIN code is also stored in sessionStorage

function withdrawStatic(amount, callback) {
    const apiUrl = `http://145.24.223.51:8001/api/withdraw?target=${iban}`;
    const data = {
        uid: uid,
        pincode: pinCode,
        amount: amount,
    };

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Network response was not ok ' + response.statusText);
        }
    })
    .then(data => {
        sessionStorage.setItem('newBalance', data.newBalance);
        callback(true, data);
    })
    .catch((error) => {
        console.error('Error:', error);
        callback(false, { message: 'Failed to withdraw: ' + error.message });
    });
}

// Function to withdraw money when IBAN does not contain "IMXXWINB"
function withdrawNoobStatic(amount, callback) {
    const apiUrl = `http://145.24.223.51:8001/api/withdraw/noob?target=${iban}`;
    const data = {
        uid: uid,
        pincode: pinCode,
        amount: amount,
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Network response was not ok ' + response.statusText);
        }
    })
    .then(data => {
        callback(true, data);
    })
    .catch((error) => {
        console.error('Error:', error);
        callback(false, { message: 'Failed to process withdrawal: ' + error.message }); // Callback indicating failure with error message
    });
}

// Function to determine which withdraw function to call based on IBAN
function determineWithdrawStatic(amount, callback) {
    // Check if the IBAN starts with "IM" followed by two digits and "WINB"
    const ibanPattern = /^IM\d{2}WINB/;
    if (ibanPattern.test(iban)) {
        withdrawStatic(amount, callback); // Assuming you have a withdraw function for IMXXWINB IBANs
    } else {
        withdrawNoobStatic(amount, callback);
    }
}

var socket = io();

socket.on('connect', function() {
    console.log('Connected to WebSocket server!');
});

socket.on('button1', function() {
    console.log('Received button1 event');
    if (window.location.pathname.includes('/keuze')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to choice screen...');
        window.location.replace('/opnemen');
    } else if (window.location.pathname.includes('/saldo')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to keuze screen...');
        window.location.replace('/saldo');
    }  else if (window.location.pathname.includes('/opnemenbedrag')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/opnemenbedrag');
    } else if (window.location.pathname.includes('/opnemen')) { // 20 euro button
        // €50 button pressed, call withdrawStatic function
        console.log('Attempting to withdraw €20...');
        determineWithdrawStatic(20, (success, data) => {
            if (success) {
                sessionStorage.setItem('current', 20);
                console.log('Withdrawal successful:', data);
                window.location.replace('/bon'); // Redirect to bon page
            } else {
                console.error('Withdrawal failed:', data.message);
            }
        });
    } else if (window.location.pathname.includes('/bon')) { // wilt u een bon invis button
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to bon screen...');
        window.location.replace('/bon');
    } else if (window.location.pathname.includes('/pin')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/pin');
    } else {
        // Default actie als geen van bovenstaande van toepassing is
        console.log('Redirecting to home...');
        window.location.replace('/pin');
    }
});

socket.on('button2', function() {
    console.log('Accepted event received, redirecting...');
    if (window.location.pathname.includes('/keuze')) {
        // €70 button pressed, call withdrawStatic function snel opnemen
        console.log('Attempting to fast withdraw €70...');
        determineWithdrawStatic(70, (success, data) => {
            if (success) {
                sessionStorage.setItem('current', 70);
                console.log('Withdrawal successful:', data);
                window.location.replace('/bon'); // Redirect to bon page
            } else {
                console.error('Withdrawal failed:', data.message);
            }
        });
    }  else if (window.location.pathname.includes('/opnemenbedrag')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/opnemenbedrag');
    } else if (window.location.pathname.includes('/opnemen')) { // 50 euro button
        // €50 button pressed, call withdrawStatic function
        console.log('Attempting to withdraw €50...');
        determineWithdrawStatic(50, (success, data) => {
            if (success) {
                sessionStorage.setItem('current', 50);
                console.log('Withdrawal successful:', data);
                window.location.replace('/bon'); // Redirect to bon page
            } else {
                console.error('Withdrawal failed:', data.message);
            }
        });
    } else if (window.location.pathname.includes('/saldo')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to keuze screen...');
        window.location.replace('/saldo');
    } else if (window.location.pathname.includes('/bon')) { // wilt u een bon invis button
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to bon screen...');
        window.location.replace('/bon');
    } else if (window.location.pathname.includes('/pin')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/pin');
    } else {
        // Default actie als geen van bovenstaande van toepassing is
        console.log('Redirecting to home...');
        window.location.replace('/pin');
    };
});

//meestal de terug button
socket.on('button3', function() {
    console.log('Received button3 event');
    if (window.location.pathname.includes('/keuze')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to saldo screen...');
        window.location.replace('/saldo');
    } else if (window.location.pathname.includes('/opnemenbedrag')) {
        // Als de gebruiker zich op de keuze pagina bevindt
        console.log('Redirecting to keuze screen...');
        window.location.replace('/opnemen');
    } else if (window.location.pathname.includes('/saldo')) {
        // Als de gebruiker zich op de keuze pagina bevindt
        console.log('Redirecting to keuze screen...');
        window.location.replace('/keuze');
    } else if (window.location.pathname.includes('/opnemen')) {
        // Als de gebruiker zich op de keuze pagina bevindt
        console.log('Redirecting to keuze screen...');
        window.location.replace('/keuze');
    } else if (window.location.pathname.includes('/snelopnemen')) {
        // Als de gebruiker zich op de keuze pagina bevindt
        console.log('Redirecting to keuze screen...');
        window.location.replace('/keuze');
    } else if (window.location.pathname.includes('/bon')) {
        // Als de gebruiker zich op de bon pagina bevindt
        console.log('Redirecting to keuze screen...');
        window.location.replace('/success');
    } else if (window.location.pathname.includes('/opnemenbedrag')) {
        // Als de gebruiker zich op de keuze pagina bevindt
        console.log('Redirecting to keuze screen...');
        window.location.replace('/opnemen');
    } else if (window.location.pathname.includes('/pin')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/pin');
    } else {
        // Default actie als geen van bovenstaande van toepassing is
        console.log('Redirecting to home...');
        window.location.replace('/pin');
    }
});

socket.on('button4', function() {
    console.log('Received button4 event');
    if (window.location.pathname.includes('/saldo')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to keuze screen...');
        window.location.replace('/saldo');
    } else if (window.location.pathname.includes('/opnemenbedrag')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/opnemenbedrag');
    } else if (window.location.pathname.includes('/opnemen')) { // 100 euro button
        // €100 button pressed, call withdrawStatic function
        console.log('Attempting to withdraw €100...');
        determineWithdrawStatic(100, (success, data) => {
            if (success) {
                sessionStorage.setItem('current', 100);
                console.log('Withdrawal successful:', data);
                window.location.replace('/bon'); // Redirect to bon page
            } else {
                console.error('Withdrawal failed:', data.message);
            }
        });
    } else if (window.location.pathname.includes('/bon')) { // wilt u een bon invis button
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to bon screen...');
        window.location.replace('/bon');
    } else if (window.location.pathname.includes('/pin')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/pin');
    } else {
        // Default actie als geen van bovenstaande van toepassing is
        console.log('Redirecting to home...');
        window.location.replace('/keuze');
    }
});

socket.on('button5', function() {
    console.log('Received button4 event');
    if (window.location.pathname.includes('/opnemen')) { //aangepaste bedrag button
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to opnemenbedrag screen...');
        window.location.replace('/opnemenbedrag');
    } else if (window.location.pathname.includes('/opnemenbedrag')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/opnemenbedrag');
    } else if (window.location.pathname.includes('/pin')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/pin');
    } else if (window.location.pathname.includes('/saldo')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/saldo');
    } else if (window.location.pathname.includes('/keuze')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/keuze');
    } else if (window.location.pathname.includes('/bon')) { // wilt u een bon invis button
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/bon');
    } else {
        // Default actie als geen van bovenstaande van toepassing is
        console.log('Default button pressed! to keuze...');
        window.location.replace('/keuze');
    }
});

//afbreken button op button 6
socket.on('button6', function() {
    console.log('Received button4 event');
    if (window.location.pathname.includes('/opnemen')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to success page...');
        window.location.replace('/success');
    } else if (window.location.pathname.includes('/saldo')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to success page...');
        window.location.replace('/success');
    } else if (window.location.pathname.includes('/pin')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Sessie afgebroken! Redirecting to main page...');
        window.location.replace('/success');
    } else if (window.location.pathname.includes('/opnemenbedrag')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to success page...');
        window.location.replace('/success');
    } else if (window.location.pathname.includes('/keuze')) {
        // Als de gebruiker zich op de saldo pagina bevindt
        console.log('Redirecting to success page...');
        window.location.replace('/success');
    } else {
        // Default actie als geen van bovenstaande van toepassing is
        console.log('Default pointer to keuze...');
        window.location.replace('/keuze');
    }
});
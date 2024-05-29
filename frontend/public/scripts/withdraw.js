// withdraw.js
let iban = sessionStorage.getItem('iban');  // Replace with actual IBAN if needed
let uid = sessionStorage.getItem('uid');    // Replace with actual UID if needed
let pinCode = sessionStorage.getItem('pincode'); // Assuming the PIN code is also stored in sessionStorage

function withdraw(amount, callback) {
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
        sessionStorage.removeItem('newBalance');
        sessionStorage.removeItem('current');

        sessionStorage.setItem('newBalance', data.newBalance);
        sessionStorage.setItem('current', amount);
        callback(true, data);
    })
    .catch((error) => {
        console.error('Error:', error);
        callback(false, { message: 'Failed to withdraw: ' + error.message });
    });
}

// Function to withdraw money when IBAN does not contain "IMXXWINB"
function withdrawNoob(amount, callback) {
    const apiUrl = `http://145.24.223.51:8001/api/withdraw/noob?target=${iban}`;
    const data = {
        uid: uid,
        pincode: pinCode,
        amount: amount
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
        sessionStorage.removeItem('newBalance');
        sessionStorage.removeItem('current');
        
        sessionStorage.setItem('newBalance', data.newBalance);
        sessionStorage.setItem('current', amount);
        callback(true, data);
    })
    .catch((error) => {
        console.error('Error:', error);
        callback(false, { message: 'Failed to process withdrawal: ' + error.message }); // Callback indicating failure with error message
    });
}

// Function to determine which withdraw function to call based on IBAN
export default function determineWithdraw(amount, callback) {
    // Check if the IBAN starts with "IM" followed by two digits and "WINB"
    const ibanPattern = /^IM\d{2}WINB/;
    if (ibanPattern.test(iban)) {
        withdraw(amount, callback); // Assuming you have a withdraw function for IMXXWINB IBANs
    } else {
        withdrawNoob( amount, callback);
    }
}

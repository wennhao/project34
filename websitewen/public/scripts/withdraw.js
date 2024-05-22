// Assuming the IBAN and UID are constant or predefined
let iban = sessionStorage.getItem('iban');  // Replace with actual IBAN if needed
let uid = sessionStorage.getItem('uid');    // Replace with actual UID if needed
let pinCode = sessionStorage.getItem('pincode'); // Assuming the PIN code is also stored in sessionStorage

export function withdraw(amount, callback) {
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
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.success) {
            sessionStorage.setItem('newBalance', data.newBalance);
            callback(true, data);
        } else {
            callback(false, data);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        callback(false, { message: 'Failed to withdraw: ' + error.message });
    });
}

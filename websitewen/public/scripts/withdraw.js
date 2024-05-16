let iban = "IM03WINB0123456789";  // Replace with actual IBAN if needed
let uid = "DUMMY002";                    // Replace with actual UID if needed


export function withdraw(pinCode, amount, callback) {
    const apiUrl = 'http://145.24.223.51:8001/api/withdraw';
    const data = {
        iban: iban,
        pincode: pinCode,
        uid: uid,
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
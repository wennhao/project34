// Assuming the IBAN and UID are constant or predefined
let iban = sessionStorage.getItem("iban");  // Replace with actual IBAN if needed
let uid = sessionStorage.getItem("uid");  // Replace with actual UID if needed

export function getAccountInfo(pinCode, callback) {
    const apiUrl = `http://145.24.223.51:8001/api/accountinfo?target=${iban}`;
    const data = {
        uid: uid,
        pincode: pinCode
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.firstname) {
            // Clear the old values from sessionStorage
            sessionStorage.removeItem('saldo');
            sessionStorage.removeItem('name');

            sessionStorage.setItem('name', data.firstname);
            sessionStorage.setItem('saldo', data.balance);
            callback(true, data);
        } else if (data && data.attempts_remaining !== undefined) {
            // Handle case where there are remaining attempts
            callback(false, { message: 'Unauthorized: Incorrect PIN', attempts_remaining: data.attempts_remaining });
        } else {
            callback(false, data);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        callback(false, { message: 'Failed to fetch data: ' + error.message }); // Callback indicating failure with error message
    });
}

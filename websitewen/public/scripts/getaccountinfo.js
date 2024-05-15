// Assuming the IBAN and UID are constant or predefined
let iban = "IM03WINB0123456789";  // Replace with actual IBAN if needed
let uid = "3";                    // Replace with actual UID if needed

export function sendPostRequest(pinCode, callback) {
    const apiUrl = 'http://145.24.223.51:8001/api/accountinfo';
    const data = {
        iban: iban,
        pincode: pinCode,
        uid: uid
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
        if (data && data.success) {
            localStorage.setItem('saldo', data.saldo);
            localStorage.setItem('name', data.firstname);
            callback(true, data);
        } else {
            callback(false, data);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        callback(false, { message: 'Failed to fetch data: ' + error.message }); // Callback indicating failure with error message
        //alert('Failed to fetch data: ' + error.message); // Display error message
    });
}
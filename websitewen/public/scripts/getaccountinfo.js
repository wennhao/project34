// Assuming the IBAN and UID are constant or predefined
let iban = "NL03ABNA0303030303";  // Replace with actual IBAN if needed
let uid = "3";                    // Replace with actual UID if needed

export function sendPostRequest(pinCode) {
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
        displayResponse(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to fetch data: ' + error.message); // Display error message
    });
}

function displayResponse(apiResponse) {
    alert(`Hello ${apiResponse.firstname} ${apiResponse.lastname}, your balance is: €${apiResponse.balance}`);
}

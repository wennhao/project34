// Assuming the IBAN and UID are constant or predefined
let iban = "NL04ABNA0404040404";  // Replace with actual IBAN if needed
let uid = "4";                    // Replace with actual UID if needed

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
        if (data && data.firstname) {
            localStorage.setItem('balance', data.balance);
            localStorage.setItem('name', data.firstname);
            // Hier stuur je door naar de keuze pagina
            window.location.href = `/keuze`;
        } else {
            throw new Error('Naam niet ontvangen');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to fetch data: ' + error.message); // Display error message
    });
}

function displayResponse(apiResponse) {
    alert(`Hello ${apiResponse.firstname} ${apiResponse.lastname}, your balance is: €${apiResponse.balance}`);
}

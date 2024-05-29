// Assuming the IBAN and UID are constant or predefined
let iban = sessionStorage.getItem('iban');  // Replace with actual IBAN if needed
let uid = sessionStorage.getItem('uid');                    // Replace with actual UID if needed
let pinCode = sessionStorage.getItem('pincode'); // Assuming the PIN code is also stored in sessionStorage


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
        sessionStorage.setItem('current', 20);
        console.log('Withdrawal successful:', 20);
        window.location.replace('/bon'); // Redirect to bon page
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
        sessionStorage.setItem('current', 70);
        console.log('Withdrawal successful:', 70);
        window.location.replace('/bon'); // Redirect to bon page
    }  else if (window.location.pathname.includes('/opnemenbedrag')) {
        // Als de gebruiker zich op de opnemenbedrag pagina bevindt
        console.log('Deze button heeft geen functie!');
        window.location.replace('/opnemenbedrag');
    } else if (window.location.pathname.includes('/opnemen')) { // 50 euro button
        // €50 button pressed, call withdrawStatic function
        console.log('Attempting to withdraw €50...');
        sessionStorage.setItem('current', 50);
        console.log('Withdrawal successful:', 50);
        window.location.replace('/bon'); // Redirect to bon page
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
        sessionStorage.setItem('current', 100);
        console.log('Withdrawal successful:', 100);
        window.location.replace('/bon'); // Redirect to bon page
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
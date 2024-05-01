window.onload = function() {
    const balance = localStorage.getItem('balance');
    if (balance) {
        document.getElementById('balanceDisplay').innerHTML = 
            `Uw saldo is: <br> €${balance}`;
    } else {
        document.getElementById('balanceDisplay').innerHTML = 
            "Geen balansinformatie beschikbaar.";
    }
};
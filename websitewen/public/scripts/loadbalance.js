window.onload = function() {
    const saldo = localStorage.getItem('saldo');
    if (saldo) {
        document.getElementById('balanceDisplay').innerHTML = 
            `Uw saldo is: <br> €${saldo}`;
    } else {
        document.getElementById('balanceDisplay').innerHTML = 
            "Geen balansinformatie beschikbaar.";
    }
};
var socket = io();
socket.on('connect', function() {
    console.log('Connected to WebSocket server!');
});

socket.on('button1', function() {
    console.log('Accepted event received, redirecting...');
    window.location.replace('/saldo');
});

socket.on('button3', function(data) {
    console.log('Redirecting back to choice screen...');
    window.location.replace('/keuze');
});
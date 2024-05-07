document.addEventListener('DOMContentLoaded', function () {
    var seconds = 5; // Start the countdown from 5
    var progressBar = document.getElementById('progressBar');
    var countdownElement = document.getElementById('countdown');
    countdownElement.textContent = seconds; // Set initial value
    progressBar.style.width = '100%'; // Set initial width

    function updateProgress() {
        if (seconds === 0) {
            clearInterval(interval);
            window.location.href = '/'; // Redirect to the '/scan' page
        } else {
            seconds--;
            countdownElement.textContent = seconds;
            progressBar.style.width = (seconds / 5 * 100) + '%';
        }
    }

    var interval = setInterval(updateProgress, 1000);
});

/* ===============================
   SYMBIHACKATHON PAGE JAVASCRIPT
   =============================== */

// Countdown Timer for SymbiHackathon Page
(function() {
    // Target date: April 24, 2026 at midnight IST
    const target = new Date("2026-04-24T00:00:00+05:30").getTime();
    
    // Helper function to pad numbers with leading zero
    const pad = n => String(n).padStart(2, "0");
    
    // Update countdown every second
    function updateCountdown() {
        const now = Date.now();
        const difference = target - now;
        
        // Check if countdown has ended
        if (difference <= 0) {
            document.getElementById('h-days').textContent = "00";
            document.getElementById('h-hours').textContent = "00";
            document.getElementById('h-minutes').textContent = "00";
            document.getElementById('h-seconds').textContent = "00";
            return;
        }
        
        // Calculate time units
        const days = Math.floor(difference / 86400000);
        const hours = Math.floor((difference % 86400000) / 3600000);
        const minutes = Math.floor((difference % 3600000) / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        
        // Update DOM elements
        document.getElementById('h-days').textContent = pad(days);
        document.getElementById('h-hours').textContent = pad(hours);
        document.getElementById('h-minutes').textContent = pad(minutes);
        document.getElementById('h-seconds').textContent = pad(seconds);
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
})();
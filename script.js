function addLogEntry(action, firstName, lastName) {
            const logEntries = document.getElementById('logEntries');
            const newEntry = document.createElement('div');
            newEntry.classList.add('log-entry');
            newEntry.textContent = `${new Date().toLocaleString()} - ${firstName} ${lastName} ${action}`;

            // Prepend the new entry to the log
            logEntries.insertBefore(newEntry, logEntries.firstChild);

            // Keep only a fixed number of log entries
            const maxEntries = 25; // Change this number to show more or less entries
            while (logEntries.children.length > maxEntries) {
                logEntries.removeChild(logEntries.lastChild);
            }
        }

document.getElementById('clockIn').addEventListener('click', function () {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    // Implement Clock In logic
    addLogEntry('clocked in', firstName, lastName);
});

document.getElementById('clockOut').addEventListener('click', function () {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    // Implement Clock Out logic
    addLogEntry('clocked out', firstName, lastName);
});
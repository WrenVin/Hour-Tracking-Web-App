function addLogEntry(action, firstName, lastName) {
            const logEntries = document.getElementById('logEntries');
            const newEntry = document.createElement('div');
            newEntry.classList.add('log-entry');
    if (action === 'error') {
        newEntry.textContent = 'Error: User not found';
        newEntry.style.color = 'red';
    }
    else {
        newEntry.textContent = `${new Date().toLocaleString()} - ${firstName} ${lastName} ${action}`;
    }

            // Prepend the new entry to the log
            logEntries.insertBefore(newEntry, logEntries.firstChild);

            // Keep only a fixed number of log entries
            const maxEntries = 25; // Change this number to show more or less entries
            while (logEntries.children.length > maxEntries) {
                logEntries.removeChild(logEntries.lastChild);
            }
}
        
function updateEmployeeStatus(firstName, lastName, action) {
    const cards = document.querySelectorAll('.card');
    let userFound = false;

    cards.forEach(card => {
        const name = card.querySelector('h3').textContent;
        if (name === `${firstName} ${lastName}`) {
            userFound = true;
            if (action === 'clocked in') {
                card.classList.add('clocked-in');
                addLogEntry('clocked in', firstName, lastName);
            } else {
                card.classList.remove('clocked-in');
                addLogEntry('clocked out', firstName, lastName);
            }
        }
    });

    if (!userFound) {
        addLogEntry('error', `User not found: ${firstName} ${lastName}`);
    }
}


document.getElementById('clockIn').addEventListener('click', function () {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    updateEmployeeStatus(firstName, lastName, 'clocked in');
    //addLogEntry('clocked in', firstName, lastName);
});

document.getElementById('clockOut').addEventListener('click', function () {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    updateEmployeeStatus(firstName, lastName, 'clocked out');
    //addLogEntry('clocked out', firstName, lastName);
});


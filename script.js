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
            const maxEntries = 500; // Change this number to show more or less entries
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
    //clockInOut(firstName, lastName, 'clock-in');
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    //addLogEntry('clocked in', firstName, lastName);
    updateSheet(firstName, lastName, '1');
});

document.getElementById('clockOut').addEventListener('click', function () {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    updateEmployeeStatus(firstName, lastName, 'clocked out');
    //clockInOut(firstName, lastName, 'clock-out');
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    //addLogEntry('clocked out', firstName, lastName);
    updateSheet(firstName, lastName, '0');
});

fetch('/api/readsheet')
  .then(response => response.json())
  .then(data => {
    console.log(data); // You can see the data in the browser console
      // Now you can manipulate the DOM to display this data
      //console.log(data)
      //displayData(data);
      displayCards(data);
  })
  .catch(error => console.error('Error:', error));

function displayCards(data) {
    // Get the container where cards will be added
    const cardsContainer = document.querySelector('.employee-cards');

    // Clear any existing content
    cardsContainer.innerHTML = '';

    // Iterate through each person in the data
    data.forEach(person => {
        console.log(person);
        // Create card elements
        const card = document.createElement('div');
        card.className = 'card';

        const name = document.createElement('h3');
        name.textContent = `${person.firstName} ${person.lastName}`;

        const status = document.createElement('p');
        if (person.status === '1') {
            card.classList.add('clocked-in');
            status.innerHTML = `<span class="status">Clocked In</span>`;
        }
        else {
            card.classList.remove('clocked-in');
            status.innerHTML = `<span class="status">Clocked Out</span>`;
        }
        //status.innerHTML = `Status: <span class="status">${person.status}</span>`;

        const hours = document.createElement('p');
        hours.innerHTML = `Total Hours: <span class="hours">${person.totalHours}</span>`;

        // Append elements to card
        card.appendChild(name);
        card.appendChild(status);
        card.appendChild(hours);

        // Append card to the container
        cardsContainer.appendChild(card);
    });
}

function updateSheet(firstName, lastName, status) {
    // Using a relative URL
    const url = '/api/writesheet';

    // Data to be sent in the POST request
    const data = { firstname: firstName, lastname: lastName, status: status };

    // Use Fetch API to send the POST request
    fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(text => {
        console.log('Sheet update response:', text);
       //addLogEntry('update', firstName, lastName); // Example log
    })
    .catch(err => {
        console.error('Error updating sheet:', err);
        //addLogEntry('error', firstName, lastName); // Log error
    });
}

const logEntries = document.getElementById('logEntries');
const timeDiv = document.getElementById('time');
const dateElement = document.createElement('h3');
timeDiv.classList.add('date-style');
setInterval(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = now.getFullYear();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    timeDiv.textContent = `${month}/${date}/${year} ${hours}:${minutes} ${ampm}`;
}, 1000);

function addLogEntry(action, firstName, lastName) {
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
    //get sheet to update card
    userFound = false;
    const cards = document.querySelectorAll('.card');
    fetch('/api/readsheet')
        .then(response => response.json())
        .then(data => {
            console.log(data); // You can see the data in the browser console
            // Now you can manipulate the DOM to display this data
            //console.log(data)
            //displayData(data);
            data.forEach(person => {
                if (person.firstName === firstName && person.lastName === lastName) {
                    cards.forEach(card => {
                        const name = card.querySelector('h3').textContent;
                        if (name === `${firstName} ${lastName}`) {
                            userFound = true;
                            if (person.status === '1') {
                                card.classList.add('clocked-in');
                                card.querySelector('.status').textContent = 'Clocked In';
                                addLogEntry('clocked in', firstName, lastName);
                            }
                            else {
                                card.classList.remove('clocked-in');
                                card.querySelector('.status').textContent = 'Clocked Out';
                                addLogEntry('clocked out', firstName, lastName);
                            }
                        }
                    });
                }
                //hours.innerHTML = `Total Hours: <span class="hours">${person.totalHours}</span>`;
            });
            if (!userFound) {
                        addLogEntry('error', `User not found: ${firstName} ${lastName}`);
                    }
        })
        
        .catch(error => console.error('Error:', error));
}


document.getElementById('clockIn').addEventListener('click', function () {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    now = new Date();
    time = now.getHours() + ":" + now.getMinutes();
    //clockInOut(firstName, lastName, 'clock-in');
    updateSheet(firstName, lastName, '1', new Date().toLocaleString(), null);
    //updateEmployeeStatus(firstName, lastName, 'clocked in');
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    //addLogEntry('clocked in', firstName, lastName);
});

document.getElementById('clockOut').addEventListener('click', function () {
    now = new Date();
    time = now.getHours() + ":" + now.getMinutes();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    updateSheet(firstName, lastName, '0', null, new Date().toLocaleString());
    //updateEmployeeStatus(firstName, lastName, 'clocked out');
    //clockInOut(firstName, lastName, 'clock-out');
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    //addLogEntry('clocked out', firstName, lastName);
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

        // Append elements to card
        card.appendChild(name);
        card.appendChild(status);
        //card.appendChild(hours);

        // Append card to the container
        cardsContainer.appendChild(card);
    });
}


function updateSheet(firstName, lastName, status, clockInTime, clockOutTime) {
    // Using a relative URL
    const url = '/api/writesheet';

    // Data to be sent in the POST request
    const data = { firstname: firstName, lastname: lastName, status: status, clockintime: clockInTime, clockouttime: clockOutTime };

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
            console.log(firstName, lastName, status);
            updateEmployeeStatus(firstName, lastName);
    })
    .catch(err => {
        console.error('Error updating sheet:', err);
        //addLogEntry('error', firstName, lastName); // Log error
    });
}



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
    else if (action === 'clocked-in') {
        newEntry.textContent = `Error: ${firstName} ${lastName} already clocked in`;
        newEntry.style.color = 'red';
    }
    else if (action === 'clocked-out') {
        newEntry.textContent = `Error: ${firstName} ${lastName} already clocked out`;
        newEntry.style.color = 'red';
    }
    else {
        newEntry.textContent = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${firstName} ${lastName} ${action}`;
    }

            logEntries.insertBefore(newEntry, logEntries.firstChild);

            const maxEntries = 500; // Change this number to show more or less entries
            while (logEntries.children.length > maxEntries) {
                logEntries.removeChild(logEntries.lastChild);
            }
}


function updateEmployeeStatus(firstName, lastName) {
    userFound = false;
    const cards = document.querySelectorAll('.card');
    fetch('/api/readsheet')
        .then(response => response.json())
        .then(data => {
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
    var hours = document.getElementById('hours').value;
    var minutes = document.getElementById('minutes').value;
    fetch('/clockIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, hours, minutes })
    })
    now = new Date();
    time = now.getHours() + ":" + now.getMinutes();
    updateSheet(firstName, lastName, '1', new Date().toLocaleString(), null);
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('hours').value = '0';
    document.getElementById('minutes').value = '0';
});

document.getElementById('clockOut').addEventListener('click', function () {
    now = new Date();
    time = now.getHours() + ":" + now.getMinutes();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    updateSheet(firstName, lastName, '0', null, new Date().toLocaleString());
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
});

fetch('/api/readsheet')
  .then(response => response.json())
  .then(data => {
    console.log(data);
      displayCards(data);
  })
  .catch(error => console.error('Error:', error));


function displayCards(data) {
    const cardsContainer = document.querySelector('.employee-cards');

    cardsContainer.innerHTML = '';

    data.forEach(person => {
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
        card.classList.add('fade-in');

        card.appendChild(name);
        card.appendChild(status);

        cardsContainer.appendChild(card);

        card.addEventListener('click', () => {
            document.getElementById('firstName').value = person.firstName;
            document.getElementById('lastName').value = person.lastName;
        });
    });
}


async function updateSheet(firstName, lastName, status, clockInTime, clockOutTime) {
    const url = '/api/writesheet';

    const data = { firstname: firstName, lastname: lastName, status: status, clockintime: clockInTime, clockouttime: clockOutTime };
    let repeat = false;
    if (status == '1') {
        try {
            const response = await fetch('/api/readsheet');
            const data = await response.json();
            console.log(data); // You can see the data in the browser console
            for (let person of data) {
                if (person.firstName === firstName && person.lastName === lastName) {
                    if (person.status === '1') {
                        addLogEntry('clocked-in', firstName, lastName);
                        document.getElementById('firstName').value = '';
                        document.getElementById('lastName').value = '';
                        repeat = true;
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
     else if (status == '0') {
        try {
            const response = await fetch('/api/readsheet');
            const data = await response.json();
            console.log(data); // You can see the data in the browser console
            for (let person of data) {
                if (person.firstName === firstName && person.lastName === lastName) {
                    if (person.status === '0') {
                        addLogEntry('clocked-out', firstName, lastName);
                        document.getElementById('firstName').value = '';
                        document.getElementById('lastName').value = '';
                        repeat = true;
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    if (!repeat) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.text())
            .then(text => {
                updateEmployeeStatus(firstName, lastName);
            })
            .catch(err => {
                console.error('Error updating sheet:', err);
            });
    }
}




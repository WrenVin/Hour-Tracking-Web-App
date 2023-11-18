const express = require('express');
require('dotenv').config();
const nodemailer = require('nodemailer');
const cors = require('cors');
const email = process.env.EMAIL;
const spreadsheetId = process.env.SHEET_ID;
const apiKey = require('./key.json');
const app = express();
const port = 3000;
const app_password = process.env.APP_PASSWORD;
const personal_email = process.env.PERSONAL_EMAIL;

app.use(cors());
app.use(express.static('.'));
app.use(express.json());

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
const { google } = require('googleapis');


const client = new google.auth.JWT(
  email,
  null,
  apiKey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);
const sheets = google.sheets({ version: 'v4', auth: client });

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: personal_email, // Your email
      pass: app_password,

    }
});

function sendEmail(to, subject, text) {
    let mailOptions = {
        from: personal_email, // Sender address
        to: to,                        // List of recipients
        subject: subject,              // Subject line
      text: text,
      priority: 'high'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Error sending email: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


app.get('/api/readsheet', async (req, res) => {
  try {
    const range = 'employeeStatus!A:C'; // Update with your range
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const rows = response.data.values;
    if (rows.length) {
      console.log(rows.length);
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        let rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });
      res.send(data);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/clockIn', async (req, res) => {
    const { firstName, lastName, hours, minutes } = req.body;

    // Fetch user's email and status from Google Sheets
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'employeeStatus!A:E', // Assuming emails are in column D and status in column E
    });

    const rows = response.data.values;
    const userRow = rows.find(row => row[0] === firstName && row[1] === lastName);
    if (!userRow) {
        return res.status(404).send({ message: 'User not found' });
    }

    const userEmail = userRow[3]; // Assuming email is in the 4th column
    const userStatus = userRow[2]; // Assuming status is in the 5th column

    // Check if user is already clocked in
    if (userStatus === '1') {
        return res.status(400).send({ message: 'User already clocked in' });
    }

    // Calculate clock-out time
    const clockOutTime = new Date();
    clockOutTime.setHours(clockOutTime.getHours() + parseInt(hours));
    clockOutTime.setMinutes(clockOutTime.getMinutes() + parseInt(minutes));
    const formattedTime = clockOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Send email
    sendEmail(userEmail, 'Your Clock Out Time', `You should clock out at ${formattedTime}`);
    res.send({ message: 'Clock in registered, email sent.' });
});


app.post('/api/writesheet', async (req, res) => {
    try {
        const {firstname, lastname, status, clockintime, clockouttime } = req.body;
        const range = 'employeeStatus!A:D'; // Update with your range
      const logRange = 'log!A:C';
      const nameRange = 'log!A:B';
      const logEntry = [[firstname, lastname, clockintime]];
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });
        
        const rows = response.data.values;
        if (rows.length) {
            const headers = rows[0];
            const data = rows.slice(1).map(row => {
                let rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index];
                });
                return rowData;
            });
            const user = data.find(user => user.firstName === firstname && user.lastName === lastname);
            if (user) {
                const userIndex = data.indexOf(user);
                const range = `employeeStatus!C${userIndex + 2}`;
                const valueInputOption = 'USER_ENTERED';
                const valueRangeBody = {
                    values: [[status]]
                };
                const params = {
                    spreadsheetId: spreadsheetId,
                    range: range,
                    valueInputOption: valueInputOption,
                    resource: valueRangeBody,
                };
                const update = await sheets.spreadsheets.values.update(params);
              res.send(update);
              
                const logParams = {
                  spreadsheetId: spreadsheetId,
                    range: logRange,
                    valueInputOption: valueInputOption,
                    resource: { values: logEntry },
                };
              if (clockouttime == null) {
                const logUpdate = await sheets.spreadsheets.values.append(logParams);
              }
              else {
                const logResponse = await sheets.spreadsheets.values.get({
                  spreadsheetId: spreadsheetId,
                  range: nameRange,
                });
                const logRows = logResponse.data.values;
                if (logRows.length) {
                  const headers = logRows[0];
                  const logData = logRows.slice(1).map(row => {
                    let rowData = {};
                    headers.forEach((header, index) => {
                      rowData[header] = row[index];
                    });
                    return rowData;
                  });
                  const reversedIndex = logData.slice().reverse().findIndex(user => user['FIRST NAME'] === firstname && user['LAST NAME'] === lastname);
                  const userIndex = reversedIndex !== -1 ? logData.length - 1 - reversedIndex : -1;
                  const logRange = `log!D${userIndex+2}`;
                  const logValueInputOption = 'USER_ENTERED';
                  const logValueRangeBody = {
                    values: [[clockouttime]]
                  };
                  const logParams = {
                    spreadsheetId: spreadsheetId,
                    range: logRange,
                    valueInputOption: logValueInputOption,
                    resource: logValueRangeBody,
                  };
                  const logUpdate = await sheets.spreadsheets.values.update(logParams);
                }
              }
                
                
            } else {
                res.status(404).send('User not found');
            }
          
        } else {
            res.send([]);
        }
    } catch (error) {
        console.error('The API returned an error: ' + error);
    }
  });

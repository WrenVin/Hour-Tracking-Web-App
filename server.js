const express = require('express');
require('dotenv').config();

const cors = require('cors');
const email = process.env.EMAIL;
const spreadsheetId = process.env.SHEET_ID;
const apiKey = require('./key.json');
const app = express();
const port = 3000;

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

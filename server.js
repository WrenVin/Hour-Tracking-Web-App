const express = require('express');
require('dotenv').config();

const cors = require('cors');
//onst apiKey = process.env.API_KEY;
const email = process.env.EMAIL;
const spreadsheetId = process.env.SHEET_ID;
const apiKey = require('./key.json');
const app = express();
const port = 3000;
// Serve static files from a specific folder
app.use(cors());
app.use(express.static('.'));

// Add this line to parse JSON request bodies
app.use(express.json());

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
const { google } = require('googleapis');

// Load client secrets from a file
//const credentials = require('path_to_your_credentials_file.json');

const client = new google.auth.JWT(
  email,
  null,
  apiKey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);
const sheets = google.sheets({ version: 'v4', auth: client });
app.get('/api/readsheet', async (req, res) => {
  try {
    const range = 'employeeData!A1:D4'; // Update with your range
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const rows = response.data.values;
    if (rows.length) {
      // Extract headers
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
      console.log('No data found.');
      res.send([]);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
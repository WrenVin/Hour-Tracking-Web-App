const express = require('express');
require('dotenv').config();
const cors = require('cors');
//onst apiKey = process.env.API_KEY;
const email = process.env.EMAIL;
const spreadsheetId = process.env.SHEET_ID;
const apiKey = process.env.API_KEY.replace(/\\n/g, "\n");
const app = express();
const port = 3000;
// Serve static files from a specific folder
app.use(cors());
app.use(express.static('.'));

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
const { google } = require('googleapis');

// Load client secrets from a file
//const credentials = require('path_to_your_credentials_file.json');

const client = new google.auth.JWT(
  email,
  null,
  apiKey,
  ['https://www.googleapis.com/auth/spreadsheets']
);
const sheets = google.sheets({ version: 'v4', auth: client });
app.get('/api/readsheet', async (req, res) => {
  try {
    const range = 'Sheet1!A1:B2'; // Update with your range
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId, // Replace with your spreadsheet ID
      range: range,
    });
    //console.log(response.data.rows);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});


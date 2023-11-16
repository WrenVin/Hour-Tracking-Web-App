const express = require('express');
require('dotenv').config();
const apiKey = process.env.API_KEY;
const app = express();
const port = 3000;
// Serve static files from a specific folder
app.use(express.static('public'));

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

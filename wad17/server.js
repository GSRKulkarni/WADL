const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API route to get employee data
app.get('/api/employees', (req, res) => {
  fs.readFile('./data/employees.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading employee data');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

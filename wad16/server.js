const express = require("express");
const app = express();
const path = require("path");

const PORT = 2000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

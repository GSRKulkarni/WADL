const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/employeeDB')
    .then(() => console.log('Connected to MongoDB - employeeDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/', employeeRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

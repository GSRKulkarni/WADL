const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));
const users = require('./users.json');

app.get('/api/users',(req, res) => res.json(users));
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));
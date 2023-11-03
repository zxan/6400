const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 8888;

// MySQL Connection
const carController = require('./controllers/cars.js');
app.get('/api/getCriterias', carController.getCriterias);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
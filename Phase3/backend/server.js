const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 8888;

// Add the express.json() middleware to parse JSON data
app.use(express.json());

// MySQL Connection
//each controller is a file under the controllers file
const carController = require('./controllers/cars.js');
const vendorController = require('./controllers/vendors.js');
const reportsController = require('./controllers/reports.js');

app.get('/api/getCriterias', carController.getCriterias);//this is an API endpoint that point to the getCriterias function in carController
app.get('/api/getSearchVendors', vendorController.getSearchVendors);
app.post('/api/addVendor', vendorController.addVendor);
app.get('/api/getSellerReports', reportsController.getSellerReports);
app.get('/api/getAverageTime', reportsController.getAverageTime);
app.get('/api/searchCars',carController.searchCars);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);//listening in port 8888, frontend will point to this to talk to this backend
});
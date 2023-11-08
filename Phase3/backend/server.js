const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());
const PORT = 8888;

// Add the express.json() middleware to parse JSON data
app.use(express.json());

// MySQL Connection
//each controller is a file under the controllers file
const carController = require('./controllers/cars.js');
const vendorController = require('./controllers/vendors.js');
const reportsController = require('./controllers/reports.js');
const customerController=require('./controllers/customers.js');

// cars API
app.get('/api/getCriterias', carController.getCriterias);//this is an API endpoint that point to the getCriterias function in carController
app.get('/api/getSearchVendors', vendorController.getSearchVendors);
app.post('/api/addVendor', vendorController.addVendor);
app.get('/api/getSellerReports', reportsController.getSellerReports);
app.get('/api/getAverageTime', reportsController.getAverageTime);
app.get('/api/searchCars',carController.searchCars);

// customer API
app.post('/api/addIndividualCustomer', customerController.addIndividualCustomer);
app.post('/api/addBusinessCustomer', customerController.addBusinessCustomer);

// part API

// report API

// user API


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);//listening in port 8888, frontend will point to this to talk to this backend
});
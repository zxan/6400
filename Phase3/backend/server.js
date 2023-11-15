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
const partController = require('./controllers/parts.js');
const reportsController = require('./controllers/reports.js');
const customerController=require('./controllers/customers.js');
const userController=require('./controllers/user.js');
// cars API

app.get('/api/getCriterias', carController.getCriterias);//this is an API endpoint that point to the getCriterias function in carController
app.get('/api/searchCars',carController.searchCars);

// customer API
app.post('/api/addIndividualCustomer', customerController.addIndividualCustomer);
app.post('/api/addBusinessCustomer', customerController.addBusinessCustomer);
app.get('/api/searchIndividualCustomer', customerController.searchIndividualCustomer);
app.get('/api/searchBusinessCustomer', customerController.searchBusinessCustomer);

// part API
app.get('/api/getSearchVendors', vendorController.getSearchVendors);
app.post('/api/addVendor', vendorController.addVendor);
app.get('/api/getPartOrder', partController.getPartOrder);

// report API
app.get('/api/getSellerReports', reportsController.getSellerReports);
app.get('/api/getAverageTime', reportsController.getAverageTime);
app.get('/api/getPriceReport', reportsController.getPriceReport);
app.get('/api/getPartsStatistics', reportsController.getPartsStatistics);
app.get('/api/getSummaryReport', reportsController.getSummaryReport);
app.get('/api/getSummaryReportDetail/:year/:month', reportsController.getSummaryReportDetail);

// user API
app.get('/api/login',userController.getPassword);
app.get('/api/isManagerOrOwner',userController.isManagerOrOwner);
app.get('/api/isInventoryOrOwner',userController.isInventoryOrOwner);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);//listening in port 8888, frontend will point to this to talk to this backend
});
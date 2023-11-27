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
//const carController1 = require('./controllers/cars1.js');
const vendorController = require('./controllers/vendors.js');
const partController = require('./controllers/parts.js');
const reportsController = require('./controllers/reports.js');
const customerController=require('./controllers/customers.js');
const userController=require('./controllers/user.js');

// cars API
app.get('/api/getCriterias', carController.getCriterias);//this is an API endpoint that point to the getCriterias function in carController
app.get('/api/searchCars',carController.searchCars);
app.get('/api/getCar',carController.getCar);
app.get('/api/getCarForInventoryClerk',carController.getCarForInventoryClerk);
app.get('/api/getCarForManager',carController.getCarForManager);
app.get('/api/getCustomerAndUserForManager',carController.getCustomerAndUserForManager);
app.get('/api/hasBeenSold',carController.hasBeenSold);
app.get('/api/hasNoPendingParts',carController.hasNoPendingParts);
app.post('/api/sale',carController.sale);
app.get('/api/countVehicleForPublic',carController.countVehicleForPublic);
app.post('/api/addCar',carController.addCar);
app.get('/api/countVehicleWithPartsPending',carController.countVehicleWithPartsPending);

//app.post('/api/addCar',carController1.addCar);

// customer API
app.post('/api/addIndividualCustomer', customerController.addIndividualCustomer);
app.post('/api/addBusinessCustomer', customerController.addBusinessCustomer);
app.get('/api/searchIndividualCustomer', customerController.searchIndividualCustomer);
app.get('/api/searchBusinessCustomer', customerController.searchBusinessCustomer);
app.get('/api/searchCustomer', customerController.searchCustomer);

// part API
app.get('/api/getSearchVendors', vendorController.getSearchVendors);
app.post('/api/addVendor', vendorController.addVendor);
app.get('/api/getPartOrder', partController.getPartOrder);
app.put('/api/updatePartOrderStatus/:orderNumber/:partNumber/:vin', partController.updatePartOrderStatus);
app.get('/api/getVendorByName', vendorController.getVendorByName);
app.get('/api/countPartOrdersByVin', partController.countPartOrdersByVin);
app.get('/api/getPartOrderNumbersByVin', partController.getPartOrderNumbersByVin);
app.post('/api/addPartsOrder', partController.addPartsOrder);
app.get('/api/getVendorInfoByPartOrder', vendorController.getVendorInfoByPartOrder);
app.post('/api/updatePartsOrderwithParts', partController.updatePartsOrderwithParts);



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
app.get('/api/isSalespersonOrOwner',userController.isSalespersonOrOwner);
app.get('/api/isSalesperson',userController.isSalesperson);
app.get('/api/isInventoryClerk',userController.isInventoryClerk);
app.get('/api/isAuthorized',userController.isAuthorized);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);//listening in port 8888, frontend will point to this to talk to this backend
});
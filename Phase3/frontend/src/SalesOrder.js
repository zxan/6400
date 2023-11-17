import NavBar from './component/navBar';
import { Card, CardActions, CardContent, Typography, TextField, Button, Container,Box, Grid, Tabs, Tab, MenuItem,  } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { useLocation } from 'react-router-dom';

function SalesOrder() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicleInfo, customerInfo } = location.state;

  //console.log(vehicleInfo);
  //console.log(customerInfo);

  const storedUser = sessionStorage.getItem('user');

  const [salesDate, setSalesDate] = useState({
    year: '',
    month: '',
    day: ''
  });

  const handleSearchCustomer = (e) => {
    navigate('/SearchCustomer', { state: { vehicleInfo: vehicleInfo } });
  };

  const handleYearChange = (event) => {
    setSalesDate((prev) => ({ ...prev, year: event.target.value }));
  };

  const handleMonthChange = (event) => {
    setSalesDate((prev) => ({ ...prev, month: event.target.value }));
  };

  const handleDayChange = (event) => {
    setSalesDate((prev) => ({ ...prev, day: event.target.value }));
  };

  let transactionDate;
  const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

  const displayErrorToast = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: true,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  let response;

  const handleSellVehicle = async (e) => {
    e.preventDefault();
    transactionDate = salesDate.year + '-' + salesDate.month + '-' + salesDate.day;
    //console.log(transactionDate);
    //console.log(dateRegex.test(transactionDate));
    if(!dateRegex.test(transactionDate)){
      displayErrorToast('Please enter a correct date using a two-digit number for month, a two-digit number for day, and a four-digit number for year');
    }
    else {
      try{
        // Send a POST request to add the new individual customer
        response = await axios.post('/api/sale', { 'username': storedUser, 'CustomerID': customerInfo.CustomerID, 'vin': vehicleInfo.vin, 'transactionDate': transactionDate } );
        //setIndividualFormDataWithCustomerID(response.data[0]);
        // Handle success for individual customer
        console.log(response.status);
        //console.log(response);
        console.log('Sale transaction added successfully');
        navigate('/SaleConfirmation', { state: { vehicleInfo: vehicleInfo, customerInfo: customerInfo, transactionDate: transactionDate } });


      }catch(error){
        //console.error('Error inserting the sale:', error);
        if (error.response && error.response.status === 500) {
          toast.error('Error inserting the sale transaction. The vehicle might have been sold. Please check again.', {
            position: 'top-center',
            autoClose: true,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
        else {
          toast.error('Error inserting the sale transaction. The vehicle might have been sold. Please check again.');
        }
        }
        

    }
    //navigate('/SearchCustomer', { state: { vehicleInfo: vehicleInfo } });
  };

  if(customerInfo == null){
    return (
      <Container maxWidth="xl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <NavBar />
        <ToastContainer />
  
        {/* Vehicle Information Card */}
        <Card sx={{ minWidth: 12, width: '60%' }} variant="outlined" style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Vehicle Information
            </Typography>
            <div>
            <Typography variant="body1" color="textSecondary">
              <br />
              Vin: {vehicleInfo.vin}
              <br />
              Model year: {vehicleInfo.modelYear}
              <br />
              Manufacturer: {vehicleInfo.manufacturer}
              <br />
              Vehicle type: {vehicleInfo.type}
              <br />
              Mileage: {vehicleInfo.mileage}
              <br />
              Fuel type: {vehicleInfo.fueltype}
              <br />
              Price: {vehicleInfo.price}
              <br />
              Color(s): {vehicleInfo.colors}
              <br />
              Description: {vehicleInfo.description}
              <br />
              
              {/* Add more vehicle information here */}
            </Typography>
            </div>
          </CardContent>
        </Card>
  
        {/* Customer Information Card */}
        <Card sx={{ minWidth: 12, width: '60%' }} variant="outlined" style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Customer Information
            </Typography>

  
          </CardContent>
          <CardActions>
            <Button size="small" onClick = {handleSearchCustomer}>Search Customer</Button>
          </CardActions>
        </Card>
  
        {/* Sales Information Card */}
        <Card sx={{ minWidth: 12, width: '60%' }} variant="outlined" style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Sales Date
            </Typography>
            <Typography variant="body1" color="textSecondary" >
              <br />
              Please enter the sales date:
            </Typography>
            <TextField
              id="month"
              label="MM"
              variant="outlined"
              style={{ marginTop: '16px', marginBottom: '16px' }}
              value={salesDate.month}
              onChange={handleMonthChange}
            />
            <TextField
              id="day"
              label="DD"
              variant="outlined"
              style={{ marginTop: '16px', marginBottom: '16px' }}
              value={salesDate.day}
              onChange={handleDayChange}
            />
            <TextField
              id="year"
              label="YYYY"
              variant="outlined"
              style={{ marginTop: '16px', marginBottom: '16px' }}
              value={salesDate.year}
              onChange={handleYearChange}
            />
          </CardContent>
        </Card>
  
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <Button variant="contained" 
              color="primary" 
              onClick={handleSellVehicle}
              
              >
                Confirm the sale
              </Button>
            </div>
  
      </Container>
    );
  }
  else {return (
    <Container maxWidth="xl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <NavBar />
      <ToastContainer />

      {/* Vehicle Information Card */}
      <Card sx={{ minWidth: 12, width: '60%' }} variant="outlined" style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Vehicle Information
          </Typography>
          <div>
          <Typography variant="body1" color="textSecondary">
            <br />
            Vin: {vehicleInfo.vin}
            <br />
            Model year: {vehicleInfo.modelYear}
            <br />
            Manufacturer: {vehicleInfo.manufacturer}
            <br />
            Vehicle type: {vehicleInfo.type}
            <br />
            Mileage: {vehicleInfo.mileage}
            <br />
            Fuel type: {vehicleInfo.fueltype}
            <br />
            Price: {vehicleInfo.price}
            <br />
            Color(s): {vehicleInfo.colors}
            <br />
            Description: {vehicleInfo.description}
            <br />
            
            {/* Add more vehicle information here */}
          </Typography>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Card */}
      <Card sx={{ minWidth: 12, width: '60%' }} variant="outlined" style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Customer Information
          </Typography>
            {customerInfo.driverLicense ? (
                  <div>
                    <Typography gutterBottom variant="h6" component="div" color="textSecondary">
                    <br />
                    Individual Customer
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Customer ID: {customerInfo.CustomerID}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Driver's License: {customerInfo.driverLicense}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      First Name: {customerInfo.firstName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Last Name: {customerInfo.lastName}
                    </Typography>                    
                    <Typography variant="body1" color="textSecondary">
                      Email: {customerInfo.email}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Phone number: {customerInfo.phoneNumber}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Street: {customerInfo.street}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      City: {customerInfo.city}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      State: {customerInfo.state}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Postal code: {customerInfo.postalCode}
                    </Typography>

                    
                  </div>
                ) : customerInfo.taxID ? (
                  <div>
                    <Typography gutterBottom variant="h6" component="div" color="textSecondary">
                      <br />
                      Business Customer
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Customer ID: {customerInfo.CustomerID}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Tax ID: {customerInfo.taxID}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Business name: {customerInfo.businessName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Contact person name: {customerInfo.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Contact person title: {customerInfo.title}
                    </Typography>                    
                    <Typography variant="body1" color="textSecondary">
                      Email: {customerInfo.email}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Phone number: {customerInfo.phoneNumber}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Street: {customerInfo.street}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      City: {customerInfo.city}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      State: {customerInfo.state}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Postal code: {customerInfo.postalCode}
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    Customer information not available.
                  </Typography>
                )}

        </CardContent>
        <CardActions>
          <Button size="small" onClick = {handleSearchCustomer}>Search Customer</Button>
        </CardActions>
      </Card>

      {/* Sales Information Card */}
      <Card sx={{ minWidth: 12, width: '60%' }} variant="outlined" style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Sales Date
          </Typography>
          <Typography variant="body1" color="textSecondary" >
            <br />
            Please enter the sales date:
          </Typography>
          <TextField
            id="month"
            label="MM"
            variant="outlined"
            style={{ marginTop: '16px', marginBottom: '16px' }}
            value={salesDate.month}
            onChange={handleMonthChange}
          />
          <TextField
            id="day"
            label="DD"
            variant="outlined"
            style={{ marginTop: '16px', marginBottom: '16px' }}
            value={salesDate.day}
            onChange={handleDayChange}
          />
          <TextField
            id="year"
            label="YYYY"
            variant="outlined"
            style={{ marginTop: '16px', marginBottom: '16px' }}
            value={salesDate.year}
            onChange={handleYearChange}
          />
        </CardContent>
      </Card>

      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <Button variant="contained" 
            color="primary" 
            onClick={handleSellVehicle}
            
            >
              Confirm the sale
            </Button>
          </div>

    </Container>
  );}

  
}


export default SalesOrder;

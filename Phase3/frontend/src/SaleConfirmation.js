import NavBar from './component/navBar';
import { Card, CardActions, CardContent, Typography, TextField, Button, Container,Box, Grid, Tabs, Tab, MenuItem,  } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { useLocation } from 'react-router-dom';

function SaleConfirmation() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicleInfo, customerInfo, transactionDate } = location.state;

  // console.log(vehicleInfo);
  // console.log(customerInfo);
  // console.log(transactionDate);



  return (
    <Container maxWidth="xl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <NavBar />

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
            Price: {(Math.round(vehicleInfo.price * 100) / 100).toFixed(2)}
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

      </Card>

      {/* Sales Information Card */}
      <Card sx={{ minWidth: 12, width: '60%' }} variant="outlined" style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Sales Date
          </Typography>
          <Typography variant="body1" color="textSecondary" >
            <br />
            The sale was completed on {transactionDate}.
          </Typography>
          
        </CardContent>
      </Card>

      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <Button variant="contained" 
            color="primary" 
            onClick={ () =>{ 
              navigate('/');
            }}
            
            >
              Back to home
            </Button>
          </div>

    </Container>
  );
}


export default SaleConfirmation;

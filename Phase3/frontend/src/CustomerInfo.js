import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, Button, CardMedia, Typography, Container, Box } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


function CustomerInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  //const { customerInfo } = location.state;
  //const { vehicleInfo, customerInfo } = location.state;

  const customerInfo = location.state?.customerInfo || {};
  const vehicleInfo = location.state?.vehicleInfo || {};
  const addCar = location.state?.addCar || {};

  const storedUser = sessionStorage.getItem('user');

  // console.log(vehicleInfo);
  // console.log('CustomerInfo.js. addCar: ' + addCar);

  // console.log('In CustomerInfo');
  // console.log(vehicleInfo);
  // console.log(customerInfo);

  const handleLinkCustomer = (e) => {
    //console.log('CustomerInfo.js, vehicleInfo: ' + vehicleInfo);
    if (addCar === true){
      //console.log('CustomerInfo.js, customerInfo: ' + customerInfo);
      navigate('/AddCar', { state: { vehicleInfo: vehicleInfo, customerInfo: customerInfo } });
    }
    else {
      navigate('/SalesOrder', { state: { vehicleInfo: vehicleInfo, customerInfo: customerInfo } });
    }
  };

  if(storedUser == null){
    return (
      <Container maxWidth="xl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <NavBar />
        <Typography variant="h5" component="div">
          <br />Please log in to view this internal page. 
        </Typography>
        
        </Container>
    );
  }
  else {
    return (
      <Container maxWidth="xl">
        <NavBar />
  
  
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
  
                <Box textAlign="center">
                  {customerInfo.driverLicense ? (
                    <div>
                      <Typography gutterBottom variant="h5" component="div">
                        Individual Customer Details
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
                      <Typography gutterBottom variant="h5" component="div">
                        Business Customer Details
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
                </Box>
  
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick ={handleLinkCustomer}
                  fullWidth
                  
                >
                  Link this customer
                </Button>
  
              </CardContent>
  
  
  
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }


}

export default CustomerInfo;


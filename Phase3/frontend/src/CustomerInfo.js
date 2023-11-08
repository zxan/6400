import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, Button, CardMedia, Typography, Container, Box } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 
import { useLocation } from 'react-router-dom';


function CustomerInfo() {
  const location = useLocation();
  const { customerInfo } = location.state;


  console.log(customerInfo); 

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
                //onClick ={handleSubmit}
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

export default CustomerInfo;


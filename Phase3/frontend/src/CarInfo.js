import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, Button, CardMedia, Typography, Container, Box } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages


function CarInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const { CarInfo } = location.state;


  const redirectToHomePage = (e) => {
    navigate('/');
  };

  console.log(CarInfo); 

  return (
    <Container maxWidth="xl">
      <NavBar />


      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>

              <Box textAlign="center">
                {CarInfo.vin ? (
                  <div>
                    <Typography gutterBottom variant="h5" component="div">
                      Car Details
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Customer ID: {CarInfo.customerID}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Vin: {CarInfo.vin}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      type: {CarInfo.type}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    username: {CarInfo.username}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      modelYear: {CarInfo.modelYear}
                    </Typography>                    
                    <Typography variant="body1" color="textSecondary">
                     manufacturer: {CarInfo.manufacturer}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      modelName: {CarInfo.modelName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    fuelType: {CarInfo.fuelType}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    colors: {CarInfo.colors}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                     mileage: {CarInfo.mileage}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    carCondition: {CarInfo.carCondition}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    purchaseDate: {CarInfo.purchaseDate}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    purchasePrice: {CarInfo.purchasePrice}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    description: {CarInfo.description}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    carCondition: {CarInfo.carCondition}
                    </Typography>

                    
                  </div>

                ) : (
                  <Typography variant="body1" color="textSecondary">
                    Car information not available.
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick ={redirectToHomePage}
                fullWidth
                
              >
                Search for other car
              </Button>

            </CardContent>



          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CarInfo;


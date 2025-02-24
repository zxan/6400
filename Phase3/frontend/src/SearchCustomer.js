// import React, { useState, useEffect } from 'react';
// import { ImageList,ImageListItem } from '@mui/material';
// import { Card, CardContent, CardMedia, Typography } from '@mui/material';
// import { Grid } from '@mui/material';
import NavBar from './component/navBar';
// import axios from 'axios'; 

import React, { useState } from 'react';
import { Card, CardContent, Container, Typography, TextField, Button, Grid, Tabs, Tab, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

function SearchCustomer() {
  const [searchFormData, setSearchFormData] = useState({
    searchType: 'individual', // 'individual' or 'business'
    ID: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  const customerInfo = location.state?.customerInfo || {};
  const vehicleInfo = location.state?.vehicleInfo || {};
  const addCar = location.state?.addCar || {};

  // console.log(vehicleInfo);
  // console.log('SearchCustomer.js. addCar: ' + addCar);

  const storedUser = sessionStorage.getItem('user');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFormData({ ...searchFormData, [name]: value});
    console.log(searchFormData.ID);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      let response;

      // Validate search value
      if (searchFormData.ID === '') {
        toast.error("Please enter a driver's license number or a Tax ID", {
          position: 'top-center',
          autoClose: true,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        return;
      }

      // Send a GET request to search for the customer

      response = await axios.get(`/api/searchCustomer?ID=${searchFormData.ID}`);

      // Handle success, navigate to customer info page
      console.log('Search successful:', response.data);
      // Navigate to a customer info page
      navigate('/CustomerInfo', { state: { customerInfo: response.data[0], vehicleInfo: vehicleInfo, addCar:addCar } });

    } catch (error) {
      // Handle errors, show an error message
      
      if (error.response && error.response.status === 404) {
        toast.error('No customer found. Redirecting to add customer page...', {
          position: 'top-center',
          autoClose: true,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          onClose: () => navigate('/AddCustomer',{ state: { vehicleInfo: vehicleInfo, addCar:addCar } }),
        });
        //navigate('/AddCustomer');

      }

      console.error('Error searching for customer:', error);
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
      <div>
        <NavBar />
        <ToastContainer />
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Search Customer
                </Typography>
                <form onSubmit={handleSearch}>
                  <TextField
                    label={"Please enter a driver's license number or a Tax ID"}
                    name="ID"
                    value={searchFormData.ID}
                    onChange={handleInputChange}
                    margin='normal'
                    fullWidth
                  />
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }

}

export default SearchCustomer;

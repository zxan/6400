// import React, { useState, useEffect } from 'react';
// import { ImageList,ImageListItem } from '@mui/material';
// import { Card, CardContent, CardMedia, Typography } from '@mui/material';
// import { Grid } from '@mui/material';
import NavBar from './component/navBar';
// import axios from 'axios'; 

import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages

function AddCustomer() {
  const [individualFormData, setIndividualFormData] = useState({
    firstName: '',
    lastName: '',
    driverLicense:'',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [businessFormData, setBusinessFormData] = useState({
    taxID: '',
    businessName: '',
    name: '',
    title: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // const [individualFormDataWithCustomerID, setIndividualFormDataWithCustomerID] = useState({
  //   customerID:'',
  //   firstName: '',
  //   lastName: '',
  //   driverLicense:'',
  //   email: '',
  //   phoneNumber: '',
  //   street: '',
  //   city: '',
  //   state: '',
  //   postalCode: '',
  // });

  // const [businessFormDataWithCustomerID, setBusinessFormDataWithCustomerID] = useState({
  //   customerID: '',
  //   taxID: '',
  //   businessName: '',
  //   name: '',
  //   title: '',
  //   email: '',
  //   phoneNumber: '',
  //   street: '',
  //   city: '',
  //   state: '',
  //   postalCode: '',
  // });
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (currentTab === 0) {
      setIndividualFormData({ ...individualFormData, [name]: value });
    } else {
      setBusinessFormData({ ...businessFormData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (currentTab === 0) {
        // Send a POST request to add the new individual customer
        console.log(individualFormData);
        response = await axios.post('/api/addIndividualCustomer', individualFormData);
        //setIndividualFormDataWithCustomerID(response.data[0]);
        // Handle success for individual customer
        console.log('Individual customer added successfully');
      } else {
        // Send a POST request to add the new business customer
        response = await axios.post('/api/addBusinessCustomer', businessFormData);
        //setBusinessFormDataWithCustomerID(response.data[0]);
        // Handle success for business customer
        console.log('Business customer added successfully');
      }

      navigate('/CustomerInfo', { state: { customerInfo: response.data[0] } });
      
    } catch (error) {
      // Handle errors, show an error message, or redirect as needed
      console.error('Error adding customer:', error);
    }
  };
//   const handleSubmit = (event) => {
//     console.log("submission occurs");
//     console.log(individualFormData);
//     event.preventDefault();
//     axios.post('/api/addIndividualCustomer',individualFormData)
//         .then(response => {
//           console.log(response.data);
//         })
//         .catch(error => {
//           console.error("Error fetching cars:", error);
//         });
    
// }

  return (
    <div>
      <NavBar />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Add New Customer
              </Typography>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                variant="fullWidth"
              >
                <Tab label="Individual Customer" />
                <Tab label="Business Customer" />
              </Tabs>
              {currentTab === 0 ? (
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={individualFormData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={individualFormData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Driver's license number"
                    name="driverLicense"
                    value={individualFormData.driverLicense}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={individualFormData.email}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Phone number"
                    name="phoneNumber"
                    value={individualFormData.phoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Street"
                    name="street"
                    value={individualFormData.street}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="City"
                    name="city"
                    value={individualFormData.city}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="State"
                    name="state"
                    value={individualFormData.state}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Postal code"
                    name="postalCode"
                    value={individualFormData.postalCode}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  {/* Add more input fields for other individual customer data as needed */}
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Tax ID"
                    name="taxID"
                    value={businessFormData.taxID}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Business name"
                    name="businessName"
                    value={businessFormData.businessName}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Contact person name"
                    name="name"
                    value={businessFormData.name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Contact person title"
                    name="title"
                    value={businessFormData.title}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={businessFormData.email}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Phone number"
                    name="phoneNumber"
                    value={businessFormData.phoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Street"
                    name="street"
                    value={businessFormData.street}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="City"
                    name="city"
                    value={businessFormData.city}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="State"
                    name="state"
                    value={businessFormData.state}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Postal code"
                    name="postalCode"
                    value={businessFormData.postalCode}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  {/* Add more input fields for other business customer data as needed */}
                </form>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick ={handleSubmit}
                fullWidth
              >
                Add Customer
              </Button>


            







            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>










  );
}

export default AddCustomer;

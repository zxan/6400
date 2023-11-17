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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

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

  const navigate = useNavigate();
  const location = useLocation();
  const { vehicleInfo} = location.state;

  const [currentTab, setCurrentTab] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (currentTab === 0) {
      setIndividualFormData({ ...individualFormData, [name]: value });
    } else {
      setBusinessFormData({ ...businessFormData, [name]: value });
    }
  };

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateIndividualForm = () => {
    // Validation logic for individual form
    const { firstName, lastName, driverLicense, email, phoneNumber, street, city, state, postalCode } = individualFormData;
    if (firstName === '') {
      displayErrorToast('Please enter the first name');
      return false;
    }
    if (lastName === '') {
      displayErrorToast('Please enter the last name');
      return false;
    }
    if (driverLicense === '') {
      displayErrorToast('Please enter the driver license number');
      return false;
    }
    if (email === '') {
      displayErrorToast('Please enter the email');
      return false;
    }
    if (!emailRegex.test(email)){
      displayErrorToast('Please enter a valid email');
      return false;
    }
    if (phoneNumber === '') {
      displayErrorToast('Please enter the phone number');
      return false;
    }
    if (street === '') {
      displayErrorToast('Please enter the street information');
      return false;
    }
    if (city === '') {
      displayErrorToast('Please enter the city');
      return false;
    }
    if (state === '') {
      displayErrorToast('Please enter the state');
      return false;
    }
    if (postalCode === '') {
      displayErrorToast('Please enter the postal code');
      return false;
    }
    
    return true;
  };

  const validateBusinessForm = () => {
    // Validation logic for business form
    const { taxID, businessName, name, title, email, phoneNumber, street, city, state, postalCode } = businessFormData;
    if (taxID === '') {
      displayErrorToast('Please enter the tax ID');
      return false;
    }
    if (businessName === '') {
      displayErrorToast('Please enter the business name');
      return false;
    }
    if (name === '') {
      displayErrorToast('Please enter the name of the contact person');
      return false;
    }
    if (title === '') {
      displayErrorToast('Please enter the title of the contact person');
      return false;
    }
    if (email === '') {
      displayErrorToast('Please enter the email');
      return false;
    }
    if (!emailRegex.test(email)){
      displayErrorToast('Please enter a valid email');
      return false;
    }
    if (phoneNumber === '') {
      displayErrorToast('Please enter the phone number');
      return false;
    }
    if (street === '') {
      displayErrorToast('Please enter the street information');
      return false;
    }
    if (city === '') {
      displayErrorToast('Please enter the city');
      return false;
    }
    if (state === '') {
      displayErrorToast('Please enter the state');
      return false;
    }
    if (postalCode === '') {
      displayErrorToast('Please enter the postal code');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    

    try {
      let response;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (currentTab === 0) {
        if (!validateIndividualForm()) {
          return;
        }

        // Send a POST request to add the new individual customer
        console.log(individualFormData);
        response = await axios.post('/api/addIndividualCustomer', individualFormData);
        //setIndividualFormDataWithCustomerID(response.data[0]);
        // Handle success for individual customer
        console.log('Individual customer added successfully');
      } else {
        if (!validateBusinessForm()) {
          return;
        }


        // Send a POST request to add the new business customer
        response = await axios.post('/api/addBusinessCustomer', businessFormData);
        //setBusinessFormDataWithCustomerID(response.data[0]);
        // Handle success for business customer
        console.log('Business customer added successfully');
      }

      navigate('/CustomerInfo', { state: { customerInfo: response.data[0], vehicleInfo: vehicleInfo } });
      
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
      <ToastContainer />
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

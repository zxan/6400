import React, { useState, useEffect  } from 'react';
import {
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';//This is a very useful library for utilizing pre-built stuff for React
import axios from 'axios';
import NavBar from './component/navBar';
import { Card, CardActions, CardContent, Typography, TextField, Button, Grid, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddCar() {
    const [individualFormData, setIndividualFormData] = useState({
      customerID: '',
      vin: '',
      type:'',
      modelYear: '',
      company: '',
      modelName: '',
      fuelType: '',
      color: [],
      mileage: '',
      description: '',
      username:'',
      purchaseDate:'',
      purchasePrice: '',
      carCondition: '',
    }); 

    const navigate = useNavigate();

    const storedUser = sessionStorage.getItem('user');

    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
    const [fuelTypeOptions, setFuelTypeOptions] = useState([]);
    const [carConditionOptions, setcarConditionOptions] = useState([]);
    // const [error, setError] = useState(null);


    const location = useLocation();


    const customerInfo = location.state?.customerInfo || {};
    const vehicleInfo = location.state?.vehicleInfo || {};

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setIndividualFormData({ ...individualFormData, [name]: value });
    };

    const handleSearchCustomer = async (e) => {
        e.preventDefault();
  
      try {
        let response;
        // if (currentTab === 0) {
        // if (!validateVehiclelForm()) {
        //     return;
        // }
        navigate('/SearchCustomer', { state: { vehicleInfo: vehicleInfo, addCar: true } });
      } catch (error) {
        // Handle errors, show an error message, or redirect as needed
        console.error('Error adding car:', error);
      }
    };

    useEffect(() => {
        axios.get('/api/getCriterias')
            .then(response => {
                //process the response
                setVehicleTypeOptions(response.data['Vehicle Type']);
                setFuelTypeOptions(response.data['Fuel Type']);
                setcarConditionOptions(response.data['Car Condition']);
                setColorOptions(response.data['Color']);
                setYearOptions(response.data['Model Year']);
                setManufacturerOptions(response.data['Manufacturer']);
            })
            .catch(error => {
                console.error(error);
                // if (error.response && error.response.data && error.response.data.error) {
                //     setError(error.response.data.error);
                // } else {
                //     setError('Error fetching criteria data');
                // }
            });
    }, []);

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
    
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    const validateVehiclelForm = () => {
        // Validation logic for vehicle form
        const {customerID,
            vin,
            type,
            username,
            modelYear,
            company,
            modelName,
            fuelType,
            color,
            mileage,
            carCondition,
            purchaseDate,
            purchasePrice,
            description } = individualFormData;
        
        if (customerID === '') {
          displayErrorToast('Please enter customerID');
          return false;
        }
        if (vin === '') {
          displayErrorToast('Please enter vin');
          return false;
        }
        if (type === '') {
          displayErrorToast('Please select vehicle type');
          return false;
        }
        if (username === '') {
          displayErrorToast('Please enter username');
          return false;
        }
        if (modelYear === '') {
          displayErrorToast('Please select model Year');
          return false;
        }
        if (company === '') {
          displayErrorToast('Please select company');
          return false;
        }
        if (modelName === '') {
          displayErrorToast('Please enter model name');
          return false;
        }
        if (fuelType === '') {
          displayErrorToast('Please select fuel type');
          return false;
        }
        if (carCondition === '') {
            displayErrorToast('Please select car condition');
            return false;
          }
        if (color === []) {
          displayErrorToast('Please select color');
          return false;
        }
        if (mileage === '' || isNaN(mileage)) {
            displayErrorToast('Please enter valid mileage');
            return false;
          }

        if (purchaseDate === '' || !dateFormatRegex.test(purchaseDate) || Date.parse(purchaseDate) > Date.now()) {
            displayErrorToast('Please enter valid purchase date');
          return false;
        }

        if (purchasePrice === '' || isNaN(purchasePrice)) {
            displayErrorToast('Please enter valid purchase price');
            return false;
          }

        return true;
    };

      

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        let response;
        if (!validateVehiclelForm()) {
            return;
        }
        console.log(individualFormData);
        response = await axios.post('/api/addCar', individualFormData);
        displayErrorToast('Error adding car 1:', response);
        if(response.data.error)
        {
            displayErrorToast('Error adding car 1:', response.data.error);
        }

        navigate('/CarInfo', { state: { CarInfo: response.data[0] } });
      } catch (error) {
        // Handle errors, show an error message, or redirect as needed
        displayErrorToast('Invalid Input. Please double check');
        displayErrorToast(error);
        console.error('Error adding car:', error);
      }
    };

    if (!location.state || !customerInfo) {
      return (
        <div>
          <NavBar />
          <ToastContainer />
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={6}>
            <Typography variant="h4" component="div" position="center">
              Add New Car
            </Typography>
            <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                  Customer Information
                  </Typography>

                  <CardActions>
            <Button
                type="submit" 
                size="small" 
                onClick = {handleSearchCustomer}>
                Search Customer
            </Button>
          </CardActions>

                </CardContent>
            </Card>

              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Add vehicle form
                  </Typography>

                  

                    <form onSubmit={handleSubmit}>
                      <TextField
                        style={styles.formControl}
                        label="Customer ID*"
                        name="customerID"
                        value={individualFormData.customerID}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <TextField
                        style={styles.formControl}
                        label="Vin*"
                        name="vin"
                        value={individualFormData.vin}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Vehicle Type*</InputLabel>
                                <Select
                                    value={individualFormData.type}
                                    onChange={handleInputChange}
                                    name="type"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {vehicleTypeOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <TextField
                        style={styles.formControl}
                        label="Username*"
                        name="username"
                        value={individualFormData.username}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Model Year*</InputLabel>
                                <Select
                                    value={individualFormData.modelYear}
                                    onChange={handleInputChange}
                                    name="modelYear"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {yearOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Company*</InputLabel>
                                <Select
                                    value={individualFormData.company}
                                    onChange={handleInputChange}
                                    name="company"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {manufacturerOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <TextField
                        style={styles.formControl}
                        label="Model Name*"
                        name="modelName"
                        value={individualFormData.modelName}
                        onChange={handleInputChange}
                        fullWidth
                      />                                       
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Fuel Type*</InputLabel>
                                <Select
                                    value={individualFormData.fuelType}
                                    onChange={handleInputChange}
                                    name="fuelType"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {fuelTypeOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Car Condition*</InputLabel>
                                <Select
                                    value={individualFormData.carCondition}
                                    onChange={handleInputChange}
                                    name="carCondition"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {carConditionOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Colors*</InputLabel>
                                <Select
                                    value={individualFormData.color}
                                    onChange={handleInputChange}
                                    name="color"
                                    multiple
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                
                                    {colorOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <TextField
                        style={styles.formControl}
                        label="Mileage*"
                        name="mileage"
                        value={individualFormData.mileage}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      {/* <TextField
                        style={styles.formControl}
                        label="Car Condition*"
                        name="carCondition"
                        value={individualFormData.carCondition}
                        onChange={handleInputChange}
                        fullWidth
                      /> */}
                      <TextField
                        style={styles.formControl}
                        label="Purchase Date(YYYY-MM-DD)*"
                        name="purchaseDate"
                        value={individualFormData.purchaseDate}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <TextField
                        style={styles.formControl}
                        label="Purchase Price*"
                        name="purchasePrice"
                        value={individualFormData.purchasePrice}
                        onChange={handleInputChange}
                        fullWidth
                      />  
                      <TextField
                        style={styles.formControl}
                        label="Description"
                        name="description"
                        value={individualFormData.description}
                        onChange={handleInputChange}
                        fullWidth
                      />        
                      {/* Add more input fields for other individual customer data as needed */}
                    </form>
            
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick ={handleSubmit}
                    fullWidth
                  >
                    Add Car
                  </Button>
    
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
    
    );
    }
    else {
        individualFormData.customerID = customerInfo.CustomerID;
      return (
        <div>
          <ToastContainer />
          <NavBar />
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={6}>
            <Typography variant="h4" component="div" position="center">
              Add New Car
            </Typography>
            <Card>
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
                  <Button
                type="submit" 
                size="small" 
                onClick = {handleSearchCustomer}>
                Search Customer
            </Button>
          </CardActions>
            </Card>

              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                  Add vehicle form
                  </Typography>

                  

                    <form onSubmit={handleSubmit}>
                      {/* <TextField
                        style={styles.formControl}
                        label="Customer ID*"
                        name="customerID"
                        value={individualFormData.customerID}
                        onChange={handleInputChange}
                        fullWidth
                      /> */}
                      <Typography variant="body1" color="textSecondary">
                        Customer ID: {individualFormData.customerID}
                      </Typography>
                      <TextField
                        style={styles.formControl}
                        label="Vin*"
                        name="vin"
                        value={individualFormData.vin}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Vehicle Type*</InputLabel>
                                <Select
                                    value={individualFormData.type}
                                    onChange={handleInputChange}
                                    name="type"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {vehicleTypeOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <TextField
                        style={styles.formControl}
                        label="Username*"
                        name="username"
                        value={individualFormData.username}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Model Year*</InputLabel>
                                <Select
                                    value={individualFormData.modelYear}
                                    onChange={handleInputChange}
                                    name="modelYear"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {yearOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Company*</InputLabel>
                                <Select
                                    value={individualFormData.company}
                                    onChange={handleInputChange}
                                    name="company"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {manufacturerOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <TextField
                        style={styles.formControl}
                        label="Model Name*"
                        name="modelName"
                        value={individualFormData.modelName}
                        onChange={handleInputChange}
                        fullWidth
                      />                                       
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Fuel Type*</InputLabel>
                                <Select
                                    value={individualFormData.fuelType}
                                    onChange={handleInputChange}
                                    name="fuelType"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {fuelTypeOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Car Condition*</InputLabel>
                                <Select
                                    value={individualFormData.carCondition}
                                    onChange={handleInputChange}
                                    name="carCondition"
                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
                                    {carConditionOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Colors*</InputLabel>
                                <Select
                                    value={individualFormData.color}
                                    onChange={handleInputChange}
                                    name="color"
                                    multiple
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                
                                    {colorOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                      </FormControl>
                      <TextField
                        style={styles.formControl}
                        label="Mileage*"
                        name="mileage"
                        value={individualFormData.mileage}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      {/* <TextField
                        style={styles.formControl}
                        label="Car Condition*"
                        name="carCondition"
                        value={individualFormData.carCondition}
                        onChange={handleInputChange}
                        fullWidth
                      /> */}
                      <TextField
                        style={styles.formControl}
                        label="Purchase Date(YYYY-MM-DD)*"
                        name="purchaseDate"
                        value={individualFormData.purchaseDate}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <TextField
                        style={styles.formControl}
                        label="Purchase Price*"
                        name="purchasePrice"
                        value={individualFormData.purchasePrice}
                        onChange={handleInputChange}
                        fullWidth
                      />  
                      <TextField
                        style={styles.formControl}
                        label="Description"
                        name="description"
                        value={individualFormData.description}
                        onChange={handleInputChange}
                        fullWidth
                      />        
                      {/* Add more input fields for other individual customer data as needed */}
                    </form>
            
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick ={handleSubmit}
                    fullWidth
                  >
                    Add Car
                  </Button>
    
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
    
    );
    }


}

const styles = {
    container: {
        height: '60rem',
        display: 'flex',
        background: '#f4f4f4',
        alignItems: 'center',
        width: "60%"
    },
    header: {
        marginBottom: '8%',
    },
    search: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '70%',
    },
    input: {
        flex: 1,
        padding: '10px'
    },
    imgContainer: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',

    },
    img: {
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '10px',  // Or any value you find visually appealing
    },
    formControl: {
        margin: '0% 2% 1% 0',
        minWidth: 120,
        width: '100%',
    },

};
export default AddCar;

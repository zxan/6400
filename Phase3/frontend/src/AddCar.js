import React, { useState, useEffect  } from 'react';
import {
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';//This is a very useful library for utilizing pre-built stuff for React
import axios from 'axios';
import NavBar from './component/navBar';
import { Card, CardContent, Typography, TextField, Button, Grid, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages

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

    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
    const [fuelTypeOptions, setFuelTypeOptions] = useState([]);
  
    const [currentTab, setCurrentTab] = useState(0);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setIndividualFormData({ ...individualFormData, [name]: value });
    };

    useEffect(() => {
        axios.get('/api/getCriterias')
            .then(response => {
                //process the response
                setVehicleTypeOptions(response.data['Vehicle Type']);
                setFuelTypeOptions(response.data['Fuel Type']);
                setColorOptions(response.data['Color']);
                setYearOptions(response.data['Model Year']);
                setManufacturerOptions(response.data['Manufacturer']);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        let response;
        console.log('Car added successfully');
        console.log(individualFormData);
        response = await axios.post('/api/addCar', individualFormData);

        console.log('Car added successfully');
        navigate('/CarInfo', { state: { CarInfo: response.data[0] } });
      } catch (error) {
        // Handle errors, show an error message, or redirect as needed
        console.error('Error adding customer:', error);
      }
    };
    return (
        <div>
          <NavBar />
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Add New Car
                  </Typography>
                  <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                    variant="fullWidth"
                  >
                  <Tab label="Add Vehicle Form" />
                  </Tabs>
                  {currentTab === 0 ? (
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
                      <TextField
                        style={styles.formControl}
                        label="Car Condition*"
                        name="carCondition"
                        value={individualFormData.carCondition}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <TextField
                        style={styles.formControl}
                        label="Purchase Date*"
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
                  )
                  : (
                    <form onSubmit={handleSubmit}>
                      
                      {/* Add more input fields for other individual customer data as needed */}
                    </form>
                  )}
                
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
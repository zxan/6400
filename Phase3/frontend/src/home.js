import React, { useState, useEffect } from 'react';
import {
    Container, Paper, InputBase, IconButton, Typography,
    FormControl, InputLabel, Select, MenuItem,Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Navbar from './component/navBar';
import axios from 'axios'; 
import CircularProgress from '@mui/material/CircularProgress';

const styles = {
    container: {
      height: '60rem',
      display: 'flex',
      background: '#f4f4f4',
      alignItems: 'center',
      width:"60%"
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
        margin: '2% 2% 5% 0',
        minWidth: 120,
        width: '30%',
    },

  };



function Home() {
    const navigate = useNavigate();
    const [manufacturer, setManufacturer] = useState('');
    const [year, setYear] = useState('');
    const [color,setColor]=useState([]);
    const [vehicleType,setVehicleType]=useState('');
    const [fuelType,setFuelType]=useState('');
    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [colorOptions,setColorOptions]=useState([]);
    const [vehicleTypeOptions,setVehicleTypeOptions]=useState([]);
    const [fuelTypeOptions,setFuelTypeOptions]=useState([]);
    const onSubmit = (event) => {
        event.preventDefault(); 
        navigate('/DisplayCar'); 
    }

    useEffect(() => {
        axios.get('/api/getCriterias')
            .then(response => {
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
    if (manufacturerOptions && yearOptions  && colorOptions && vehicleTypeOptions && fuelTypeOptions) {
console.log(year);
 return (
    <div>
   <Navbar styles={{width:"70%"}}></Navbar>
    <Container maxWidth={false} style={styles.container}>
 
     <Grid container spacing={3}>
                {/* Left Grid for Content */}
                <Grid item xs={6}>
                    <Typography variant="h1" component="h1" style={styles.header}>
                        BuzzCar
                    </Typography>
                    <FormControl variant="outlined" style={styles.formControl}>
                <InputLabel >Year</InputLabel>
                <Select
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                >
    {yearOptions.map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
        ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" style={styles.formControl}>
                <InputLabel>Manufacturer</InputLabel>
                <Select
                    value={manufacturer}
                    onChange={(event) => setManufacturer(event.target.value)}
                
                >
       {manufacturerOptions.map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
        ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" style={styles.formControl}>
                <InputLabel >Vehicle Type</InputLabel>
                <Select
                    value={vehicleType}
                    onChange={(event) => setVehicleType(event.target.value)}
                
                >
   
   {vehicleTypeOptions.map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
        ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" style={styles.formControl}>
                <InputLabel >Fuel Type</InputLabel>
                <Select
                    value={fuelType}
                    onChange={(event) => setFuelType(event.target.value)}
                >
        
        {fuelTypeOptions.map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
        ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" style={styles.formControl}>
                <InputLabel >Colors</InputLabel>
                <Select
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    multiple
                    renderValue={(selected) => selected.join(', ')}
                >
   {colorOptions.map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
        ))}
                </Select>
            </FormControl>
                    <Paper component="form" style={styles.search}>
                        <InputBase
                            style={styles.input}
                            placeholder="Search By keyword"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                        <IconButton onClick={onSubmit} type="submit" aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Grid>
                {/* Right Grid for Image */}
                <Grid item xs={6} style={styles.imgContainer}>
                    <img
                        style={styles.img}
                        src="https://source.unsplash.com/1600x900/?cars"
                        alt="Car Image"
                    />
                </Grid>
            </Grid>
    </Container>
            
    </div>
  );
 }
 else{
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </div>
    );
 }
}

export default Home;
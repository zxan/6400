import React, { useState, useEffect } from 'react';
import {
    Container, Paper, InputBase, IconButton, Typography,
    FormControl, InputLabel, Select, MenuItem, Grid
} from '@mui/material';//This is a very useful library for utilizing pre-built stuff for React
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages
import Navbar from './component/navBar';//imported from a reusable component 
import axios from 'axios'; //plugin for backend communication
import CircularProgress from '@mui/material/CircularProgress';
import Slider from '@mui/material/Slider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Home() {
    const navigate = useNavigate();
    //in React.js, you have to set your variable a bit differently becasue it is dynamic
    //you will have to use const[something,setSomething]=useState('')
    //use the 'setSomething' to change the value of 'something'
    const [manufacturer, setManufacturer] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState([]);
    const [vehicleType, setVehicleType] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
    const [fuelTypeOptions, setFuelTypeOptions] = useState([]);
    const [price, setPrice] = useState(null);
    const [mileage, setMileage] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [loggedInUser,setLoggedInUser]=useState(null);
    const [vin,setVin]=useState('');
   
    const onSearchVin = (event) => {
        event.preventDefault();
        if (!vin) {
                toast.error('Please enter a valid VIN to search vehicle by VIN.', {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            return; 
          }
        const queryParams = new URLSearchParams();
        queryParams.set('vin', vin);
        navigate(`/DisplayCar?${queryParams}`);
    }
    const onSubmit = (event) => {
        event.preventDefault();
        if (!vehicleType && !manufacturer && !year && !fuelType && color.length === 0 && !keyword && !price && !mileage) {

                toast.error('Please enter some keywords or choose at least one filtering criteria.', {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            return; 
          }
        const queryParams = new URLSearchParams();
        if (vehicleType) queryParams.set('vehicleType', vehicleType);
        if (manufacturer) queryParams.set('manufacturer', manufacturer);
        if (year) queryParams.set('modelYear', year);
        if (fuelType) queryParams.set('fuelType', fuelType);
        if (color && Array.isArray(color)) {
            color.forEach(c => queryParams.append('color', c));
        } else if (color) {
            queryParams.set('color', color);
        }
        if (keyword) queryParams.set('keyword', keyword);
        if (price) queryParams.set('price', price);
        if (mileage) queryParams.set('mileage', mileage);
        navigate(`/DisplayCar?${queryParams}`);
    }
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        setLoggedInUser(storedUser);
    }
    }, []);
    useEffect(() => {
        //This is important!!!!! Axios is how you communicate with backend
        //if you go to our backend server.js, you will see this get API endpoint
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
    if (manufacturerOptions&& yearOptions && colorOptions && vehicleTypeOptions && fuelTypeOptions) {//only render the page when these variables are not empty
        return (
            <div >
            
                <Navbar styles={{ width: "70%" }}></Navbar>
                <ToastContainer />
                <Container maxWidth={false} style={styles.container}>

                    <Grid container spacing={3}>
                        {/* Left Grid for Content */}
                        <Grid item md={6}>
                            <Typography variant="h1" component="h1" style={styles.header}>
                                BuzzCar
                            </Typography>
                            {loggedInUser&&
                                <Paper component="form" style={styles.search}>
                                <InputBase
                                    style={styles.input}
                                    value={vin}
                                    placeholder="Search By VIN"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={(event) => setVin(event.target.value)}
                                />
                                <IconButton onClick={onSearchVin} type="submit" aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                            }
                           
                            <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Year</InputLabel>
                                <Select
                                    value={year}
                                    onChange={(event) => setYear(event.target.value)}
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
                                <InputLabel>Manufacturer</InputLabel>
                                <Select
                                    value={manufacturer}
                                    onChange={(event) => setManufacturer(event.target.value)}

                                >
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
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
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
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
                                    <MenuItem value={null}>
                                        <em>Clear</em>
                                    </MenuItem>
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
                            <br></br>
                            <FormControl style={styles.formControl}>
                                <Typography id="price-range-slider" gutterBottom>
                                    Price Range
                                </Typography>
                                <Slider
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="price-range-slider"
                                    min={5000}
                                    max={100000}
                                />
                            </FormControl>
                            <br></br>
                            <FormControl style={styles.formControl}>
                                <Typography id="mileage-range-slider" gutterBottom>
                                    Mileage Range
                                </Typography>
                                <Slider
                                    value={mileage}
                                    onChange={(event) => setMileage(event.target.value)}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="mileage-range-slider"
                                    min={0}
                                    max={100000}
                                />
                            </FormControl>
                            <Paper component="form" style={styles.search}>
                                <InputBase
                                    style={styles.input}
                                    value={keyword}
                                    placeholder="Search By keyword"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={(event) => setKeyword(event.target.value)}
                                />
                                <IconButton onClick={onSubmit} type="submit" aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                          
                        </Grid>
                        {/* Right Grid for Image */}
                        <Grid item md={6} style={styles.imgContainer}>
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
    else {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }
}
//Following is for styling
const styles = {
    container: {
        height: '55rem',
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
        marginBottom:'3%'
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

export default Home;
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
    const [color, setColor] = useState('');
    const [soldFilter,setSoldFilter]=useState('all');
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
    const [vin,setVin]=useState('');
    const [isManagerOrOwner, setIsManagerorOwner] = React.useState(false);
    const [isInventoryClerk, setIsInventoryClerk] = React.useState(false);
    const [publicCount,setPublicCount]=useState(0);
    const[pendingCount,setPendingCount]=useState(0);
    const storedUser = sessionStorage.getItem('user');
    const onSubmit = (event) => {
        event.preventDefault();
        // if (!vin&&!vehicleType && !manufacturer && !year && !fuelType && color.length === 0 && !keyword && !price && !mileage&&soldFilter=='all') {

        //         toast.error('Please enter some keywords or choose at least one filtering criteria.', {
        //             position: "top-center",
        //             autoClose: false,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             draggable: true,
        //             progress: undefined,
        //             theme: "light",
        //             });
        //     return; 
        //   }
        const queryParams = new URLSearchParams();
        if (vehicleType) queryParams.set('vehicleType', vehicleType);
        if (manufacturer) queryParams.set('manufacturer', manufacturer);
        if (year) queryParams.set('modelYear', year);
        if (fuelType) queryParams.set('fuelType', fuelType);
        if (color) {
            queryParams.set('color', color);
        }
        if (keyword) queryParams.set('keyword', keyword);
        if (price) queryParams.set('price', price);
        if (mileage) queryParams.set('mileage', mileage);
        if (vin) queryParams.set('vin', vin);
        queryParams.set('soldStatus',soldFilter);
        navigate(`/DisplayCar?${queryParams}`);
    }


    useEffect(() => {
        axios.get("/api/countVehicleForPublic", { params: { 'username': storedUser } }).then((response) => {
          setPublicCount(response.data[0].countVehicleForPublic);
        }).catch((error) => {
            console.log(error);
        });
        axios.get("/api/countVehicleWithPartsPending", { params: { 'username': storedUser } }).then((response) => {
          
            setPendingCount(response.data[0].countVehicleWithPartsPending);
        }).catch((error) => {
            console.log(error);
        });

        axios.get("/api/isManagerOrOwner", { params: { 'username': storedUser } }).then((response) => {
          
            if (response.data == true) {
                setIsManagerorOwner(true);
            }
            ;
        }).catch((error) => {
            console.log(error);
        });

        axios.get("/api/isInventoryClerk", { params: { 'username': storedUser } }).then((response) => {
          
            if (response.data == true) {
                setIsInventoryClerk(true);
            }
            ;
        }).catch((error) => {
            console.log(error);
        });

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
                            {storedUser&&
                                <Paper style={styles.search}>
                                <InputBase
                                    style={styles.input}
                                    value={vin}
                                    placeholder="Search By VIN"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={(event) => setVin(event.target.value)}
                                />
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
                                <InputLabel >Color</InputLabel>
                                <Select
                                    value={color}
                                    onChange={(event) => setColor(event.target.value)}
                                    // multiple
                                    // renderValue={(selected) => selected.join(', ')}
                                >
                                
                                    {colorOptions.map(y => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {isManagerOrOwner&&
                                <FormControl variant="outlined" style={styles.formControl}>
                                <InputLabel >Sold Status</InputLabel>
                                <Select
                                    value={soldFilter}
                                    onChange={(event) => setSoldFilter(event.target.value)}
                                 
                                >
                                    <MenuItem value='all'>
                                        <em>All</em>
                                    </MenuItem>
                                    <MenuItem value='sold'>
                                        <em>Only Sold</em>
                                    </MenuItem>
                                    <MenuItem value='unsold'>
                                        <em>Only Unsold</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            }
                           
                            {/* <br></br>
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
                                    max={250000}
                                />
                            </FormControl> */}
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
                        {isInventoryClerk&&isManagerOrOwner &&  <div style={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" style={{ color: 'blue' }}>
            Number of Cars available for Sales: {publicCount}
            </Typography>
            <br></br>
            <Typography variant="h6" style={{ color: 'red' }}>
              Number of Cars with Pending Parts: {pendingCount}
            </Typography>
          </div>}
          <br></br>
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
        // display: 'flex',
        // alignItems: 'center',

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
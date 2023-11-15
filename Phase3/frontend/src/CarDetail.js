import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 
import { useLocation } from 'react-router-dom';
import CarIcon from '@mui/icons-material/DirectionsCar';


function CarDetail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const vin = queryParams.get('vin');
    const [car, setCar] = useState({});
    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    // const vehicleType = queryParams.get('vehicleType');
    // const manufacturer = queryParams.get('manufacturer');
    // const modelYear = queryParams.get('modelYear');
    // const fuelType = queryParams.get('fuelType');
    // const keyword = queryParams.get('keyword');
    // const price = queryParams.get('price');
    // const mileage = queryParams.get('mileage');
    // const color = queryParams.getAll('color');

    useEffect(() => {
    //   const params = {
    //     vehicleType, 
    //     manufacturer,
    //     modelYear,
    //     fuelType,
    //     color,
    //     keyword,
    //     price,
    //     mileage
    //   };
  

      axios.get('/api/getCar',{params:{'vin':vin}})
        .then(response => {
          setCar(response.data);
         
        })
        .catch(error => {
          console.error("Error fetching cars:", error);
        });
    }, []); 

    return(
        <div>
<NavBar/>
        <Card style={styles.carComponent}>
        <CardContent>
          {/* Using CarIcon instead of CardMedia for an image */}
          <CarIcon style={{ fontSize: 140 }} />
  
          <Typography variant="h1" component="div">
           {car.manufacturer} -- {car.modelYear}
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Manufacturer: {car.manufacturer}
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Vehicle Type: {car.type}
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Mileage: {car.mileage}
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Fuel Type: {car.fuelType}
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Price: ${car.price}
          </Typography>
        
          <Typography variant="h4" color="text.secondary">
            Colors: {car.colors}
          </Typography>
          <Typography variant="h4" color="text.secondary">
            Description: {car.description}
          </Typography>
        </CardContent>
      </Card>
      </div>
    );
  }
  
  const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: "5%"
    },
    carList: {
        width:'60%',
    },
    carComponent:{
        margin:"4%",
        display: 'flex',
        justifyContent: 'center',

    }
};
  export default CarDetail;
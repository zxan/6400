import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, CardMedia, Typography ,Link} from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 
import { useLocation } from 'react-router-dom';
import CarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages

function CarComponent(props){

  const navigate = useNavigate();
  function handleClick(){
    const queryParams = new URLSearchParams();
    queryParams.set('vin',props.vin);
    navigate(`/CarDetail?${queryParams}`);
  }
  return(
   
      <Card style={styles.carComponent}>
         <button 
    onClick={handleClick} 
    style={{ all: 'unset', cursor: 'pointer', padding: 0, margin: 0 }}
  >
      <CardContent>
        {/* Using CarIcon instead of CardMedia for an image */}
        <CarIcon style={{ fontSize: 140 }} />

        <Typography variant="h5" component="div">
          {props.model} -- {props.year}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manufacturer: {props.manufacturer}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vehicle Type: {props.type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mileage: {props.mileage} miles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fuel Type: {props.fuelType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${props.price}
        </Typography>
      
        <Typography variant="body2" color="text.secondary">
          Colors: {props.colors}
        </Typography>
      </CardContent>
      </button>
    </Card>

  );
}

function DisplayCar() {

    const [cars, setCars] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const vehicleType = queryParams.get('vehicleType');
    const manufacturer = queryParams.get('manufacturer');
    const modelYear = queryParams.get('modelYear');
    const fuelType = queryParams.get('fuelType');
    const keyword = queryParams.get('keyword');
    const price = queryParams.get('price');
    const mileage = queryParams.get('mileage');
    const color = queryParams.getAll('color');

    useEffect(() => {
      const params = {
        vehicleType, 
        manufacturer,
        modelYear,
        fuelType,
        color,
        keyword,
        price,
        mileage,
      };
      axios.get('/api/searchCars',{params})
        .then(response => {

          setCars(response.data);
        })
        .catch(error => {
          console.error("Error fetching cars:", error);
        });
    }, []); 
  
    return (
      <div>
      <NavBar></NavBar>
        <div style={styles.container}>

        <Grid style={styles.carList} container spacing={2} >
        {cars.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
                <CarComponent vin={item.vin} type={item.type} year={item.modelYear} manufacturer={item.manufacturer} fuelType={item.fuelType} price={item.price} colors={item.colors} model={item.modelName} mileage={item.mileage} />
            </Grid>
        ))}
    </Grid>
    </div>
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
        margin:"3%"
    }
};
  export default DisplayCar;
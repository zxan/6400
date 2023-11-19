import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 
import { useLocation } from 'react-router-dom';
import CarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';


function CarDetail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const vin = queryParams.get('vin');
    const [car, setCar] = useState({});
    const navigate = useNavigate();

    // check if the user is eligible to sell a vehicle
    const [isSalesperson, setIsSalesPerson] = React.useState(false);
    const storedUser = sessionStorage.getItem('user');
    axios.get("/api/isSalesperson", { params: { 'username': storedUser } }).then((response) => {
      if (response.data == true) {
          setIsSalesPerson(true);
      }
      ;
      }).catch((error) => {
          console.log(error);
      });
    //console.log('Is salesPerson?' + isSalesperson);

    // check if the vehicle has been sold

    const handleAddPartOrder = () => {
      navigate('/AddPartsOrder', { state: { vin: car.vin } });
    };

    const [hasBeenSold, setHasBeenSold] = React.useState(false);
    axios.get("/api/hasBeenSold", { params: { 'vin': vin } }).then((response) => {
      if (response.data == true) {
        setHasBeenSold(true);
      }
      ;
      }).catch((error) => {
          console.log(error);
      });
    //console.log('Has the car been sold?' + hasBeenSold);

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

    const handleSellVehicle = (e) => {
      // const { name, value } = e.target;
      // setSearchFormData({ ...searchFormData, [name]: value });
      navigate('/SalesOrder', { state: { vehicleInfo: car } });
    };

    

    return(
        <div>
        <NavBar/>
        <Card style={styles.carComponent}>
        <CardContent>
          {/* Using CarIcon instead of CardMedia for an image */}
          <CarIcon style={{ fontSize: 140 }} />
          <Typography variant="h2" component="div">
           {car.vin}
          </Typography>
          <Typography variant="h4" component="text.secondary">
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

          {hasBeenSold && (
            <div style={{ marginTop: '16px' }}>
              <Typography variant="h4" color="red">
              This vehicle has been sold.
              </Typography>

            </div>
          )

          }


          {isSalesperson && !hasBeenSold && (

          <div style={{ marginTop: '16px' }}>
          <Button variant="contained" 
            color="primary" 
            onClick={handleSellVehicle}
            
            >
                Sell this vehicle
            </Button>
          </div>
                        
                    )}

{!hasBeenSold && (
            <div style={{ marginTop: '16px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPartOrder}
              >
                Add Part Order
              </Button>
            </div>
          )}
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
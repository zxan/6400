import React, { useState, useEffect } from 'react';
import { ImageList, ImageListItem } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Link } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import CarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';//This is to navigate to differnt pages
import { CircularProgress } from '@mui/material';

function CarComponent(props) {

  const navigate = useNavigate();
  function handleClick() {
    const queryParams = new URLSearchParams();
    queryParams.set('vin', props.vin);
    navigate(`/CarDetail?${queryParams}`);
  }
  return (

    <Card style={styles.carComponent}>
      <button
        onClick={handleClick}
        style={{ all: 'unset', cursor: 'pointer', padding: 0, margin: 0 }}
      >
        <CardContent>
          {/* Using CarIcon instead of CardMedia for an image */}
          <CarIcon style={{ fontSize: 140 }} />
          <Typography variant="body1" component="div">
            {props.vin} 
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
            Price: ${props.price?props.price:0}
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
  // const price = queryParams.get('price');
  // const mileage = queryParams.get('mileage');
  const [publicCount,setPublicCount]=useState(0);
  const[pendingCount,setPendingCount]=useState(0);
  const color = queryParams.get('color');
  const vin = queryParams.get('vin');
  const soldStatus=queryParams.get('soldStatus');
  const [loading, setLoading] = useState(true);
  const [isAuthorized,setisAuthorized]=useState(false);
  const isUserInventoryClerk = (username) => {
    return axios.get('/api/isInventoryClerk', { params: { username } })
      .then(response => {
        return response.data;

      })
      .catch(error => {
        console.error("Error checking user role:", error);
        return false;
      });
  }
  const isUserManagerOrOwner = (username) => {
    return axios.get('/api/isManagerOrOwner', { params: { username } })
      .then(response => {
  
        return response.data;

      })
      .catch(error => {
        console.error("Error checking user role:", error);
        return false;
      });
  }
  const countVehicleForPublic = () => {
    return axios.get('/api/countVehicleForPublic')
      .then(response => {
        return response.data;

      })
      .catch(error => {
        console.error("Error counting vehicle for public:", error);
        return false;
      });
  }
  const countVehicleWithPartsPending = () => {
    return axios.get('/api/countVehicleWithPartsPending')
      .then(response => {
        return response.data;

      })
      .catch(error => {
        console.error("Error counting vehicle for public:", error);
        return false;
      });
  }
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    async function fetchCar() {
      try {
        
        // const pc=12;
        const isManagerOrOwner = await isUserManagerOrOwner(storedUser);
        const isInventoryClerk = await isUserInventoryClerk(storedUser);
        const pc=await countVehicleForPublic();
        const pendingC=await countVehicleWithPartsPending();
        const params = {
          vin,
          vehicleType,
          manufacturer,
          modelYear,
          fuelType,
          color,
          keyword,
          isManagerOrOwner: isManagerOrOwner,
          isInventoryClerk: isInventoryClerk,
          soldStatus
        };
        const response = await axios.get('/api/searchCars', { params });
        setCars(response.data);
        setPublicCount(pc[0].countVehicleForPublic);
        setPendingCount(pendingC[0].countVehicleWithPartsPending);
        setisAuthorized(isManagerOrOwner || isInventoryClerk);
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    }
    fetchCar().finally(() => setLoading(false));;
  }, []);

  return (
    <div>
      <NavBar></NavBar>
      {isAuthorized &&  <div style={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" style={{ color: 'blue' }}>
            Number of Cars available for Sales: {publicCount}
            </Typography>
            <br></br>
            <Typography variant="h6" style={{ color: 'red' }}>
              Number of Cars with Pending Parts: {pendingCount}
            </Typography>
          </div>}
     
      <div style={styles.container}>
        {loading ? (
          <CircularProgress style={{ alignSelf: 'center', margin: '20px' }} />
        ) : (
          <>
        
      <br></br>
          <Grid style={styles.carList} container spacing={2}>
         
          {
            cars.length > 0 ? (
              cars.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <CarComponent
                    vin={item.vin}
                    type={item.type}
                    year={item.modelYear}
                    manufacturer={item.manufacturer}
                    fuelType={item.fuelType}
                    price={item.price}
                    colors={item.colors}
                    model={item.modelName}
                    mileage={item.mileage}
                  />
                </Grid>
              
              ))
         
            ) : (
              <div style={{ textAlign: 'center'}}>
                <Typography variant="h4" style={{ color: 'red', textAlign: 'center', margin: '20px' }}>
                  Sorry, it looks like we don’t have that in stock!
                </Typography>
              </div>

            )}

          </Grid>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: "1%"
  },
  carList: {
    width: '60%',
  },
  carComponent: {
    margin: "3%"
  }
};
export default DisplayCar;
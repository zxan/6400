import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 

function CarComponent(props){
    return(
    <Card style={styles.carComponent}>
    <CardMedia
      component="img"
      height="140"
      image="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=500&q=60"
    />
    <CardContent>
      <Typography variant="h5" component="div">
        {props.model}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {props.mileage}
      </Typography>
    </CardContent>
  </Card>);
}

function DisplayCar() {

    const [cars, setCars] = useState([]);
    useEffect(() => {//will be replaced by whatever is in the backend
      const featchedCars = [
        { model: 'BMW', mileage: '100000' },
        {model:"Benz",mileage:'20000'},
        { model: 'BMW', mileage: '100000' },
        {model:"Benz",mileage:'20000'},
        { model: 'BMW', mileage: '100000' },
        {model:"Benz",mileage:'20000'},
        { model: 'BMW', mileage: '100000' },
        {model:"Benz",mileage:'20000'},
        { model: 'BMW', mileage: '100000' }
      ];
      setCars(featchedCars);
    }, []);
  
    return (
      <div>
      <NavBar></NavBar>
        <div style={styles.container}>

        <Grid style={styles.carList} container spacing={2} >
        {cars.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
                <CarComponent model={item.model} mileage={item.mileage} />
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
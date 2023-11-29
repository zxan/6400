import React, { useState, useEffect } from 'react';
import { ImageList, ImageListItem } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import CarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';
import PartOrderStatus from './PartOrderStatus';

function CarDetail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const vin = queryParams.get('vin');
    const [car, setCar] = useState({});
    const navigate = useNavigate();
    const [transactionUser, setTransactionUser] = useState({});//inventory clerk, customer info
    // check if the user is eligible to sell a vehicle
    const [isSalespersonOrOwner, setIsSalesPersonOrOwner] = React.useState(false);
    const [isInventoryClerk, setisInventoryClerk] = React.useState(false);
    const [isInventoryClerkOrOwner, setisInventoryClerkOrOwner] = React.useState(false);
    const storedUser = sessionStorage.getItem('user');
    axios.get("/api/isSalespersonOrOwner", { params: { 'username': storedUser } }).then((response) => {
      if (response.data == true) {
          setIsSalesPersonOrOwner(true);
      }
      ;
      }).catch((error) => {
          console.log(error);
      });
    // check if the vehicle has been sold
    const [hasBeenSold, setHasBeenSold] = React.useState(false);
  axios.get("/api/hasBeenSold", { params: { 'vin': vin } }).then((response) => {
    if (response.data == true) {
      setHasBeenSold(true);
    }
    ;
  }).catch((error) => {
    console.log(error);
  });

  // check if the vehicle has no pending parts. true if no parts pending.
  const [hasNoPendingParts, setHasNoPendingParts] = React.useState(false);
  axios.get("/api/hasNoPendingParts", { params: { 'vin': vin } }).then((response) => {
    if (response.data == true) {
      setHasNoPendingParts(true);
    }
    ;
  }).catch((error) => {
    console.log(error);
  });

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
  useEffect(() => {

    async function fetchCarDetail() {
      try {

        axios.get("/api/isInventoryOrOwner", { params: { 'username': storedUser } }).then((response) => {
          if (response.data == true) {
            setisInventoryClerkOrOwner(true);
          } 
          ;
          }).catch((error) => {
              console.log(error);
          });

        const isManagerOrOwner = await isUserManagerOrOwner(storedUser);
        const isIC = await isUserInventoryClerk(storedUser)
        const params = {
          vin
        };
        if (isManagerOrOwner) {
          const response = await axios.get('/api/getCarForManager', { params });
          const response2 = await axios.get('/api/getCustomerAndUserForManager', { params });
          setTransactionUser(response2.data);
          setCar(response.data);
          console.log(response.data);
  
        }
        else if (isIC) {
          const response = await axios.get('/api/getCarForInventoryClerk', { params });
          setisInventoryClerk(true);
          setCar(response.data);
        }
        else {
          const response = await axios.get('/api/getCar', { params });
          setCar(response.data);

        }
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    }
    fetchCarDetail();
  }, []);

  const handleSellVehicle = (e) => {
    // const { name, value } = e.target;
    // setSearchFormData({ ...searchFormData, [name]: value });
    navigate('/SalesOrder', { state: { vehicleInfo: car } });
  };

  // for add part order button
  const handleAddPartOrder = () => {
    navigate('/AddPartsOrder', { state: { vehicleInfo: car } });
  };

  
    return (
      <div>
        <NavBar />
        <Card style={styles.carComponent}>
  
          <Grid container spacing={3}> {/* Grid container with spacing */}
          <Grid item xs={12} md={3}>
            {transactionUser.inventoryClerkFirstName &&
              <div>
                <CardContent>
                  <Typography variant="h5">Inventory Clerk Info</Typography>
                  <Typography variant="body1">Name: {transactionUser.inventoryClerkFirstName} {transactionUser.InventoryClerkLastName} </Typography>
                  {/* <Typography variant="body1">Purchase Date: {transactionUser.purchaseDate}</Typography> */}
                  {/* <Typography variant="body1">Purchase Price: {car.purchasePrice}</Typography>
          <Typography variant="body1">Total Part Cost: {car.totalPartsCost}</Typography> */}
                </CardContent>
  
  
                {transactionUser.sellerBusinessName ?
                  <CardContent>
                    <Typography variant="h5">Seller Info</Typography>
                    <Typography variant="body1">Company Name: {transactionUser.sellerBusinessName} </Typography>
                    <Typography variant="body1">Seller Name: {transactionUser.sellerName} </Typography>
                    <Typography variant="body1">Title: {transactionUser.sellerTitle} </Typography>
                    <Typography variant="body1">Email: {transactionUser.sellerEmail}</Typography>
                    <Typography variant="body1">Phone: {transactionUser.sellerPhoneNumber}</Typography>
                    <Typography variant="body1">Address: {transactionUser.sellerStreet}, {transactionUser.sellerCity}, {transactionUser.sellerState} {transactionUser.sellerPostalCode}</Typography>
                  </CardContent>
                  :
                  <CardContent>
                    <Typography variant="h5">Seller Info</Typography>
                    <Typography variant="body1">Name: {transactionUser.sellerFirstName} {transactionUser.sellerLastName} </Typography>
                    <Typography variant="body1">Email: {transactionUser.sellerEmail}</Typography>
                    <Typography variant="body1">Phone: {transactionUser.sellerPhoneNumber}</Typography>
                    <Typography variant="body1">Address: {transactionUser.sellerStreet}, {transactionUser.sellerCity}, {transactionUser.sellerState} {transactionUser.sellerPostalCode}</Typography>
                  </CardContent>
                }
              </div>
            }
            </Grid>
  
            {/* Seller Information Column */}
            <Grid item xs={12} md={6}>
  
              <CardContent style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Using CarIcon instead of CardMedia for an image */}
                <CarIcon style={{ fontSize: 140 }} />
                <Typography variant="h4" component="div">
                  {car.vin}
                </Typography>
                <Typography variant="h6" component="text.secondary">
                  {car.manufacturer} -- {car.modelYear}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Manufacturer: {car.manufacturer}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Vehicle Type: {car.type}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Mileage: {car.mileage}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Fuel Type: {car.fuelType}
                </Typography>
                {(transactionUser.inventoryClerkFirstName || isInventoryClerk) &&
                <>
                  <Typography variant="h6" color="text.secondary">
                  Purchase Price: ${car.purchasePrice}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Parts Cost: ${car.totalPartsCost}
                </Typography>
                </>
                }
             
                <Typography variant="h6" color="text.secondary">
                  Sale Price: ${car.price?car.price:0}
                </Typography>
                
  
                <Typography variant="h6" color="text.secondary">
                  Colors: {car.colors}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Description: {car.description}
                </Typography>
  
                {/* {hasBeenSold && (
                  <div style={{ marginTop: '16px' }}>
                    <Typography variant="h4" color="red">
                      This vehicle has been sold.
                    </Typography>
  
                  </div>
                )
  
                }

                {!hasNoPendingParts && (
                  <div style={{ marginTop: '16px' }}>
                    <Typography variant="h4" color="red">
                      This vehicle has pending parts.
                    </Typography>
  
                  </div>
                )
  
                } */}
  
  
                {isSalespersonOrOwner && !hasBeenSold && hasNoPendingParts && (
  
                  <div style={{ marginTop: '16px' }}>
                    <Button variant="contained"
                      color="primary"
                      onClick={handleSellVehicle}
  
                    >
                      Sell this vehicle
                    </Button>
                  </div>
  
                )}
  
      
      

      {!hasBeenSold && isInventoryClerkOrOwner && (
              <div style={{ marginTop: '16px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPartOrder}
                >
                  Add Parts Order
                </Button>
              </div>
            )}
              </CardContent>
  
  
            </Grid>
            {hasBeenSold && transactionUser.salespersonFirstName &&
              <Grid item xs={12} md={3}>
                <CardContent>
                  <Typography variant="h5">Sales Person Info</Typography>
                  <Typography variant="body1">Name: {transactionUser.salespersonFirstName} {transactionUser.salesPersonLastName}</Typography>
                </CardContent>
  
                {transactionUser.buyerBusinessName ?
                  <CardContent>
                    <Typography variant="h5">Buyer Info</Typography>
                    <Typography variant="body1">Company Name: {transactionUser.buyerBusinessName} </Typography>
                    <Typography variant="body1">Seller Name: {transactionUser.buyerName} </Typography>
                    <Typography variant="body1">Title: {transactionUser.buyerTitle} </Typography>
                    <Typography variant="body1">Email: {transactionUser.buyerEmail}</Typography>
                    <Typography variant="body1">Phone: {transactionUser.buyerPhoneNumber}</Typography>
                    <Typography variant="body1">Address: {transactionUser.buyerEmail}, {transactionUser.buyerCity}, {transactionUser.buyerState} {transactionUser.buyerPostalCode}</Typography>
                  </CardContent>
                  :
  
                  <CardContent>
                    <Typography variant="h5">Buyer Info</Typography>
                    <Typography variant="body1">Name: {transactionUser.buyerFirstName} {transactionUser.buyerLastName}</Typography>
                    <Typography variant="body1">Email: {transactionUser.buyerEmail}</Typography>
                    <Typography variant="body1">Phone: {transactionUser.buyerPhoneNumber}</Typography>
                    <Typography variant="body1">Address: {transactionUser.buyerStreet}, {transactionUser.buyerCity}, {transactionUser.buyerState} {transactionUser.buyerPostalCode}</Typography>
                  </CardContent>
                }
  

              </Grid>
            }
          </Grid>
        </Card>
        {(transactionUser.inventoryClerkFirstName || isInventoryClerk)&&<PartOrderStatus></PartOrderStatus>}
      </div>
    );
  }
  
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: "5%",
    },
    carList: {
      width: '60%',
    },
    carComponent: {
      margin: "4% 20% 2% 20%",
      display: 'flex',
      justifyContent: 'center',
  
    }
  };
  export default CarDetail;
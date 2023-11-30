import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 
import { CircularProgress } from '@mui/material';

const SellerDataRow = ({ seller }) => {
  const {
    sellerName,
    totalNumberOfVehiclesSold,
    averageSoldPrice,
    averageNumberOfPartsOrderedPerVehicle,
    averageCostOfPartsPerVehicle,
    redHighlighted,
  } = seller;

  const rowStyles = {
    backgroundColor: redHighlighted ? 'red' : 'inherit',
  };

  return (
    <tr style={rowStyles}>
      <td>{sellerName}</td>
      <td>{totalNumberOfVehiclesSold}</td>
      <td>{averageSoldPrice}</td>
      <td>{averageNumberOfPartsOrderedPerVehicle}</td>
      <td>{averageCostOfPartsPerVehicle}</td>
    </tr>
  );
};

const SellerHistory = () => {
  const [sellerData, setSellerData] = useState([]);
  const [isManagerOrOwner, setIsManagerOrOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user role information when the component mounts
    const storedUser = sessionStorage.getItem('user');

    axios.get("/api/isManagerOrOwner", { params: { 'username': storedUser } })
      .then((response) => {
        if (response.data === true) {
          setIsManagerOrOwner(true);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // Set loading to false when authorization check is complete
        setLoading(false);
      });

    // Fetch seller history data
    axios.get('/api/getSellerReports')
      .then(response => {
        console.log(response.data)
        setSellerData(response.data);
      })
      .catch(error => {
        console.error('Error fetching seller history:', error);
        // Set loading to false if there's an error fetching the data
        setLoading(false);
      });
  }, []);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '1%',
    },
    table: {
      width: '60%',
      borderCollapse: 'collapse',
      border: '1px solid #000',
    },
    columnHeader: {
      backgroundColor: '#f2f2f2',
      border: '1px solid #000',
      padding: '8px',
      textAlign: 'left',
    },
    notAuthorizedMessage: {
      textAlign: 'center',
      color: 'red',
      marginTop: '20px',
    },
    title: {
      textAlign: 'center',
      marginTop: '5%',
      marginBottom: '20px',
    },
  };


  return (
    <div>
      <NavBar />
      <h1 style={styles.title}>Seller History</h1>
      <div style={styles.container}>
        {loading ? (
          // Show a loading indicator while the data is being fetched
          <CircularProgress style={{ margin: '20px auto', display: 'block' }} />
        ) : (
          <>
            {isManagerOrOwner ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.columnHeader}>Seller Name</th>
                    <th style={styles.columnHeader}>Total Number of Vehicles Sold to BuzzCars</th>
                    <th style={styles.columnHeader}>Average Vehicle Price ($)</th>
                    <th style={styles.columnHeader}>Average Number of Parts per Vehicle</th>
                    <th style={styles.columnHeader}>Average Cost of Parts per Vehicle ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerData.map((seller, index) => (
                    <SellerDataRow key={index} seller={seller} />
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.notAuthorizedMessage}>
                <p>You are not authorized to view this data.</p>
              </div>
            )}
          </>
        )}
      </div>
      <br></br>
    </div>
  );
};

export default SellerHistory;

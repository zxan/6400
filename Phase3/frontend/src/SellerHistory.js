import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 


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

  useEffect(() => {
    axios.get('/api/getSellerReports') // Adjust this endpoint as per your backend
      .then(response => {
        console.log(response.data)
        setSellerData(response.data);
      })
      .catch(error => {
        console.error('Error fetching seller history:', error);
      });
  }, []);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '5%',
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
  };

  return (
    <div>
      <NavBar />
      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.columnHeader}>Seller Name</th>
              <th style={styles.columnHeader}>Total Vehicles Sold</th>
              <th style={styles.columnHeader}>Average Sold Price</th>
              <th style={styles.columnHeader}>Average Parts per Vehicle</th>
              <th style={styles.columnHeader}>Average Cost of Parts</th>
            </tr>
          </thead>
          <tbody>
            {sellerData.map((seller, index) => (
              <SellerDataRow key={index} seller={seller} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerHistory;

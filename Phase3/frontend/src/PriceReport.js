import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar';
import { TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { CircularProgress } from '@mui/material';


function PriceReport() {
  const [priceData, setPriceData] = useState([]);
  const [isManagerOrOwner, setIsManagerOrOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user role information when the component mounts
    const storedUser = sessionStorage.getItem('user');
    console.log('Stored User:', storedUser);
    

    axios.get("/api/isManagerOrOwner", { params: { 'username': storedUser } })
      .then((response) => {
        console.log('Authorization Response:', response.data);
        if (response.data === true) {
          setIsManagerOrOwner(true);
        }
      })
      .catch((error) => {
        console.log('Authorization Error:', error);
      })
      .finally(() => {
        // Set loading to false when authorization check is complete
        setLoading(false);
      });

    // Fetch price report data
    axios.get('/api/getPriceReport') // Adjust this endpoint as per your backend
    .then(response => {
      setPriceData(response.data);
      console.log("PriceReport from backend:" + response.data);
    })
    .catch(error => {
      console.error('Error fetching price report:', error);
      // Set loading to false if there's an error fetching the report
      setLoading(false);
    });
}, []);


// Pivot the data to make VehicleType the row name and Condition the column name
const pivotedData = {};

priceData.forEach((entry) => {
  const vehicleType = entry.VehicleType;
  const condition = entry.CarCondition; 

  if (!pivotedData[vehicleType]) {
    pivotedData[vehicleType] = {};
  }

  pivotedData[vehicleType][condition] = entry.AveragePrice;
});

// Extract unique conditions to build table headers
const conditions = Array.from(
  new Set(priceData.map((entry) => entry.CarCondition))
);

const styles = {
  table: {
    width: '60%',
    borderCollapse: 'collapse',
    border: '1px solid #000',
    margin: 'auto', // Centering the table
    marginTop: '20px',
  },
  columnHeader: {
    backgroundColor: '#f2f2f2',
    border: '1px solid #000',
    padding: '8px',
    textAlign: 'left',
  },
  title: {
    textAlign: 'center', // Centering the title
    marginTop: '5%',
    marginBottom: '20px', // Adding space between the title and table
  },
  notAuthorizedMessage: {
    textAlign: 'center',
    color: 'red',
    marginTop: '20px',
  },
};


  return (
    <div>
      <NavBar />
      <h1 style={styles.title}>Price ($) per Condition</h1>
  
      {loading ? (
        // Show a loading indicator while the data is being fetched
        <CircularProgress style={{ margin: '20px auto', display: 'block' }} />
      ) : (
        <>
          {isManagerOrOwner ? (
            // <table style={styles.table}>
            //   <thead>
            //     <tr>
            //       <th style={styles.columnHeader}>Vehicle Type</th>
            //       <th style={styles.columnHeader}>Condition</th>
            //       <th style={styles.columnHeader}>Average Price</th>
            //     </tr>
            //   </thead>
            //   <tbody>
            //     {priceData.map((entry) => (
            //       <tr key={entry.VehicleType + entry.Condition}>
            //         <td>{entry.VehicleType}</td>
            //         <td>{entry.CarCondition}</td> {/* Assuming CarCondition is the name of the condition column */}
            //         <td>${entry.AveragePrice}</td>
            //       </tr>
            //     ))}
            //   </tbody>
            // </table>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.columnHeader}>Vehicle Type</th>
                  {conditions.map((condition) => (
                    <th key={condition} style={styles.columnHeader}>
                      {condition}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(pivotedData).map((vehicleType) => (
                  <tr key={vehicleType}>
                    <td>{vehicleType}</td>
                    {conditions.map((condition) => (
                      <td key={condition}>
                        {'$'+pivotedData[vehicleType][condition] || '$0'}
                      </td>
                    ))}
                  </tr>
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
  );
}

export default PriceReport;
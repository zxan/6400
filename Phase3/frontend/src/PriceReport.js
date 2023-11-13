import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar';
import axios from 'axios';

function PriceReport() {
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    axios.get('/api/getPriceReport') // Adjust this endpoint as per your backend
      .then(response => {
        setPriceData(response.data);
      })
      .catch(error => {
        console.error('Error fetching price report:', error);
      });
  }, []);

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
  };

  return (
    <div>
      <NavBar />
      <h1 style={styles.title}>Price per Condition</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.columnHeader}>Vehicle Type</th>
            <th style={styles.columnHeader}>Condition</th>
            <th style={styles.columnHeader}>Average Price</th>
          </tr>
        </thead>
        <tbody>
          {priceData.map((entry) => (
            <tr key={entry.VehicleType + entry.Condition}>
              <td>{entry.VehicleType}</td>
              <td>{entry.CarCondition}</td> {/* Assuming CarCondition is the name of the condition column */}
              <td>${entry.AveragePrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PriceReport;

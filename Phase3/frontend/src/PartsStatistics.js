import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar'; // Make sure to adjust the path if needed
import axios from 'axios';

function PartsStatistics() {
  const [partsData, setPartsData] = useState([]);

  useEffect(() => {
    // You may need to adjust the endpoint based on your backend
    axios.get('/api/getPartsStatistics')
      .then(response => {
        setPartsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching parts statistics:', error);
      });
  }, []);

  const styles = {
    table: {
      width: '60%',
      borderCollapse: 'collapse',
      border: '1px solid #000',
      margin: 'auto',
      marginTop: '20px',
    },
    columnHeader: {
      backgroundColor: '#f2f2f2',
      border: '1px solid #000',
      padding: '8px',
      textAlign: 'left',
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
      <h1 style={styles.title}>Parts Statistics</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.columnHeader}>Vendor Name</th>
            <th style={styles.columnHeader}>Total Parts Supplied</th>
            <th style={styles.columnHeader}>Total Parts Quantity</th>
            <th style={styles.columnHeader}>Total Dollar Amount</th>
          </tr>
        </thead>
        <tbody>
          {partsData.map((entry) => (
            <tr key={entry.VendorName}>
              <td>{entry.VendorName}</td>
              <td>{entry.TotalPartsSupplied}</td>
              <td>{entry.TotalPartsQuantity}</td>
              <td>${entry.TotalDollarAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PartsStatistics;

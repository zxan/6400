import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar'; // Make sure to adjust the path if needed
import axios from 'axios';

function SummaryReport() {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    // You may need to adjust the endpoint based on your backend
    axios.get('/api/getSummaryReport')
      .then(response => {
        setSummaryData(response.data);
      })
      .catch(error => {
        console.error('Error fetching summary report:', error);
      });
  }, []);

  const styles = {
    table: {
      width: '80%',
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
      <h1 style={styles.title}>Monthly/Yearly Summary Report</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.columnHeader}>Year</th>
            <th style={styles.columnHeader}>Month</th>
            <th style={styles.columnHeader}>Total Vehicles Sold</th>
            <th style={styles.columnHeader}>Total Sales Income</th>
            <th style={styles.columnHeader}>Total Net Income</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((entry) => (
            <tr key={`${entry.SaleYear}-${entry.SaleMonth}`}>
              <td>{entry.SaleYear}</td>
              <td>{entry.SaleMonth}</td>
              <td>{entry.TotalVehiclesSold}</td>
              <td>${entry.TotalSalesIncome}</td>
              <td>${entry.TotalNetIncome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SummaryReport;

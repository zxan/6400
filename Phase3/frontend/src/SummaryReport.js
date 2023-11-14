import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SummaryReport() {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    // Adjust the endpoint based on your backend
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
      fontWeight: 'bold',
    },
    cell: {
      border: '1px solid #000',
      padding: '8px',
      textAlign: 'right', // Align numbers to the right
    },
    title: {
      textAlign: 'center',
      marginTop: '5%',
      marginBottom: '20px',
    },
    evenRow: {
      backgroundColor: '#f9f9f9',
    },
    link: {
      textDecoration: 'underline',
      color: 'blue',
      cursor: 'pointer',
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
          {summaryData.map((entry, index) => (
            <tr key={`${entry.SaleYear}-${entry.SaleMonth}`} style={index % 2 === 0 ? styles.evenRow : null}>
              <td style={styles.cell}>
                <Link to={`/SummaryReportDetail/${entry.SaleYear}/${entry.SaleMonth}`} style={styles.link}>
                  {entry.SaleYear}
                </Link>
              </td>
              <td style={styles.cell}>
                <Link to={`/SummaryReportDetail/${entry.SaleYear}/${entry.SaleMonth}`} style={styles.link}>
                  {getMonthName(entry.SaleMonth)}
                </Link>
              </td>
              <td style={styles.cell}>{entry.TotalVehiclesSold}</td>
              <td style={styles.cell}>${formatNumber(entry.TotalSalesIncome)}</td>
              <td style={styles.cell}>${formatNumber(entry.TotalNetIncome)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper function to format numbers with commas
function formatNumber(number) {
  return number.toLocaleString();
}

// Helper function to get month name from month number
function getMonthName(monthNumber) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || '';
}

export default SummaryReport;

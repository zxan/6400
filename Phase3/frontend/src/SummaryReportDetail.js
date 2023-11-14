import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SummaryReportDetail() {
  const [detailData, setDetailData] = useState([]);
  const { year, month } = useParams();

  useEffect(() => {
    // Adjust the endpoint based on your backend
    axios.get(`/api/getSummaryReportDetail/${year}/${month}`)
      .then(response => {
        setDetailData(response.data);
      })
      .catch(error => {
        console.error('Error fetching summary report detail:', error);
      });
  }, [year, month]);

  const styles = {
    container: {
      padding: '20px',
    },
    title: {
      textAlign: 'center',
      marginTop: '20px',
      marginBottom: '20px',
      fontSize: '24px',
    },
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
      padding: '10px',
      textAlign: 'left',
      fontWeight: 'bold',
    },
    cell: {
      border: '1px solid #000',
      padding: '10px',
      textAlign: 'right',
    },
    evenRow: {
      backgroundColor: '#f9f9f9',
    },
  };

  return (
    <div>
      <NavBar />
      <h1 style={styles.title}>{`Summary Report Detail for ${getMonthName(parseInt(month))} ${year}`}</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.columnHeader}>Salesperson</th>
            <th style={styles.columnHeader}>Total Vehicles Sold</th>
            <th style={styles.columnHeader}>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {detailData.map((entry, index) => (
            <tr key={index} style={index % 2 === 0 ? styles.evenRow : null}>
              <td style={styles.cell}>{`${entry.FirstName} ${entry.LastName}`}</td>
              <td style={styles.cell}>{entry.TotalVehiclesSold}</td>
              <td style={styles.cell}>${formatNumber(entry.TotalSales)}</td>
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

export default SummaryReportDetail;

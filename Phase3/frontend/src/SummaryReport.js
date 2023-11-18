import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

function SummaryReport() {
  const [summaryData, setSummaryData] = useState([]);
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

    // Fetch summary report data
    axios.get('/api/getSummaryReport')
      .then(response => {
        setSummaryData(response.data);
      })
      .catch(error => {
        console.error('Error fetching summary report:', error);
        // Set loading to false if there's an error fetching the data
        setLoading(false);
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
    notAuthorizedMessage: {
      textAlign: 'center',
      color: 'red',
      marginTop: '20px',
    },
  };

  return (
    <div>
      <NavBar />
      <h1 style={styles.title}>Monthly/Yearly Summary Report</h1>

      {loading ? (
        // Show a loading indicator while the data is being fetched
        <CircularProgress style={{ margin: '20px auto', display: 'block' }} />
      ) : (
        <>
          {isManagerOrOwner ? (
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
                      <Link to={`/SummaryReportDetail/${entry.SaleYear}/0`} style={styles.link}>
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

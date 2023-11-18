import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

function PartsStatistics() {
  const [partsData, setPartsData] = useState([]);
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

    // Fetch parts statistics data
    axios.get('/api/getPartsStatistics')
      .then(response => {
        setPartsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching parts statistics:', error);
        // Set loading to false if there's an error fetching the data
        setLoading(false);
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
    notAuthorizedMessage: {
      textAlign: 'center',
      color: 'red',
      marginTop: '20px',
    },
  };

  return (
    <div>
      <NavBar />
      <h1 style={styles.title}>Parts Statistics</h1>

      {loading ? (
        // Show a loading indicator while the data is being fetched
        <CircularProgress style={{ margin: '20px auto', display: 'block' }} />
      ) : (
        <>
          {isManagerOrOwner ? (
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

export default PartsStatistics;

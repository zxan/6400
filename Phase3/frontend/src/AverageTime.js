import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

function AverageTime() {
  const [averageTimes, setAverageTimes] = useState([]);
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

    // Fetch average time data
    axios.get('/api/getAverageTime') // Adjust this endpoint as per your backend
      .then(response => {
        setAverageTimes(response.data);
      })
      .catch(error => {
        console.error('Error fetching average times:', error);
        // Set loading to false if there's an error fetching the data
        setLoading(false);
      });
  }, []);

  const styles = {
    table: {
      width: '60%',
      borderCollapse: 'collapse',
      border: '1px solid #000',
      margin: 'auto', // Centering the table
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
      <h1 style={styles.title}>Average Time in Inventory</h1>

      {loading ? (
        // Show a loading indicator while the data is being fetched
        <CircularProgress style={{ margin: '20px auto', display: 'block' }} />
      ) : (
        <>
          {isManagerOrOwner ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.columnHeader}>Vehicle Type</th>
                  <th style={styles.columnHeader}>Average Time (Days)</th>
                </tr>
              </thead>
              <tbody>
                {averageTimes.map((averageTime, index) => (
                  <tr key={index}>
                    <td>{averageTime.type}</td>
                    <td>{averageTime.averageTime}</td>
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

export default AverageTime;

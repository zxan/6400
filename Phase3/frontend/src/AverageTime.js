import React, { useState, useEffect } from 'react';
import NavBar from './component/navBar';
import axios from 'axios';

function AverageTime() {
  const [averageTimes, setAverageTimes] = useState([]);

  useEffect(() => {
    axios.get('/api/getAverageTime') // Adjust this endpoint as per your backend
      .then(response => {
        setAverageTimes(response.data);
      })
      .catch(error => {
        console.error('Error fetching average times:', error);
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
  };

  return (
    <div>
      <NavBar />
      <h1 style={styles.title}>Average Time in Inventory</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.columnHeader}>Vehicle Type</th>
            <th style={styles.columnHeader}>Average Time</th>
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
    </div>
  );
}

export default AverageTime;

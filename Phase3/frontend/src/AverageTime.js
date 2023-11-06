import React, { useState, useEffect } from 'react';
import { ImageList,ImageListItem } from '@mui/material';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import NavBar from './component/navBar';
import axios from 'axios'; 

function AverageTime() {
    return (
      <div>
        <NavBar /> {/* Assuming NavBar is used here */}
        <h1 style={styles.title}>Average Time</h1>
      </div>
    );
  }
  
  const styles = {
    title: {
      textAlign: 'center',
      marginTop: '5%',
      // Other title styling as needed
    },
  };
  
  export default AverageTime;
import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Card, CardContent, Typography, TextField, Button, Grid, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import NavBar from './component/navBar';

function AddPartsOrder() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const handleSearch = () => {
    // Make an HTTP request to search for vendors based on the searchText
    axios.get(`/api/getSearchVendors?searchstring=${searchText}`)
      .then((response) => {
        console.log('Search results:', response.data);
        setSearchResults(response.data);
        setShowTable(true);
      })
      .catch((error) => {
        console.error('Error searching for vendors:', error);
      });
  };

  const handleAddVendor = () => {
    // Validate phone number format
    const phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneNumberRegex.test(newVendor.phoneNumber)) {
      // Display an error message (you can customize this part based on your UI framework)
      alert('Invalid phone number format. Please use xxx-xxx-xxxx format.');
      return; // Don't proceed with adding the vendor
    }

    // Validate postal code format
    const postalCodeRegex = /^\d{5}$/;
    if (!postalCodeRegex.test(newVendor.postalCode)) {
      alert('Invalid postal code format. Please use a 5-digit code.');
      return; // Don't proceed with adding the vendor
    }
  
    // Define headers with 'Content-Type' set to 'application/json'
    const headers = {
      'Content-Type': 'application/json',
    };
  
    // Make an HTTP request to add a new vendor with the specified headers
    axios.post('/api/addVendor', newVendor, { headers })
      .then((response) => {
        console.log('Vendor added:', response.data);
        // Optionally, you can clear the form or update the results table
        // Clear the form:
        setNewVendor({
          name: '',
          phoneNumber: '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
        });
        // Refresh the results:
        handleSearch();
      })
      .catch((error) => {
        console.error('Error adding a vendor:', error);
      });
  };
  
  

  return (
    <div>
      <NavBar />
      <div style={{ textAlign: 'center' }}>
        <h1>Search for Vendors</h1>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Search Vendors"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
        {showTable && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vendor Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Street</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Postal Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((vendor, index) => (
                  <TableRow key={index}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.phoneNumber}</TableCell>
                    <TableCell>{vendor.street}</TableCell>
                    <TableCell>{vendor.city}</TableCell>
                    <TableCell>{vendor.state}</TableCell>
                    <TableCell>{vendor.postalCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <h1>Add New Vendor</h1>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              variant="outlined"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              value={newVendor.phoneNumber}
              onChange={(e) => setNewVendor({ ...newVendor, phoneNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Street"
              variant="outlined"
              value={newVendor.street}
              onChange={(e) => setNewVendor({ ...newVendor, street: e.target.value })}
              fullWidth
            />
            <TextField
              label="City"
              variant="outlined"
              value={newVendor.city}
              onChange={(e) => setNewVendor({ ...newVendor, city: e.target.value })}
              fullWidth
            />
            <TextField
              label="State"
              variant="outlined"
              value={newVendor.state}
              onChange={(e) => setNewVendor({ ...newVendor, state: e.target.value })}
              fullWidth
            />
            <TextField
              label="Postal Code"
              variant="outlined"
              value={newVendor.postalCode}
              onChange={(e) => setNewVendor({ ...newVendor, postalCode: e.target.value })}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleAddVendor}>
              Add Vendor
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default AddPartsOrder;
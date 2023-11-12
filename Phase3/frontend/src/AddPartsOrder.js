import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
        <TextField
          label="Search Vendors"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
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
        <div>
          <TextField
            label="Name"
            variant="outlined"
            value={newVendor.name}
            onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            value={newVendor.phoneNumber}
            onChange={(e) => setNewVendor({ ...newVendor, phoneNumber: e.target.value })}
          />
          <TextField
            label="Street"
            variant="outlined"
            value={newVendor.street}
            onChange={(e) => setNewVendor({ ...newVendor, street: e.target.value })}
          />
          <TextField
            label="City"
            variant="outlined"
            value={newVendor.city}
            onChange={(e) => setNewVendor({ ...newVendor, city: e.target.value })}
          />
          <TextField
            label="State"
            variant="outlined"
            value={newVendor.state}
            onChange={(e) => setNewVendor({ ...newVendor, state: e.target.value })}
          />
          <TextField
            label="Postal Code"
            variant="outlined"
            value={newVendor.postalCode}
            onChange={(e) => setNewVendor({ ...newVendor, postalCode: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleAddVendor}>
            Add Vendor
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddPartsOrder;

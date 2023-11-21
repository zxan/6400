import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import NavBar from './component/navBar';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function SearchVendor() {
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const vehicleInfo = location.state?.vehicleInfo || {};
  const navigate = useNavigate(); // React Router's useNavigate hook

  console.log('vehicleInfo on load:', vehicleInfo);

  const handleSearch = () => {
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

  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor);
    console.log('Selected Vendor in SearchVendor:', vendor);
    toast.success(`Vendor "${vendor.name}" selected!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: () => {
        // This will be executed after the toast is closed
        console.log('Navigating to AddPartsOrder with state:', { selectedVendor });
        console.log('vehicleInfo data:', vehicleInfo);
        navigate('/AddPartsOrder', { state: { selectedVendor: vendor, vehicleInfo: vehicleInfo} });
      },
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
                  <TableCell>Action</TableCell>
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
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSelectVendor(vendor)}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}


        <Button
          variant="contained" color="primary"
          component={Link}
          to="/AddVendor"  // Make sure the path matches the one in your Route component
          style={{ marginTop: '20px' }}
        >
          Add New Vendor
        </Button>
        {selectedVendor && (
          <div>
            <h2>Selected Vendor Information</h2>
            <p>Name: {selectedVendor.name}</p>
            <p>Phone Number: {selectedVendor.phoneNumber}</p>
            {/* Add more vendor information as needed */}
          </div>
        )}
      </div>
      
      <ToastContainer />
      
    </div>
  );
}

export default SearchVendor;

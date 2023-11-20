import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';

function AddVendor() {
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

  const navigate = useNavigate();

  const handleAddVendor = () => {
    // Check if any of the fields is empty
    for (const key in newVendor) {
      if (newVendor[key].trim() === '') {
        toast.error(`Please fill in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`, {
          position: "top-center",
          autoClose: true,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return; // Don't proceed with adding the vendor
      }
    }
  
    const headers = {
      'Content-Type': 'application/json',
    };
  
    axios.post('/api/addVendor', newVendor, { headers })
      .then((response) => {
        console.log('Vendor added:', response.data);
        setNewVendor({
          name: '',
          phoneNumber: '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
        });
  
        // Show a success toast and redirect to AddPartsOrder after it's closed
        const addedVendor = response.data.vendor;
        toast.success(`Vendor "${addedVendor.name}" added!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => {
            navigate('/addpartsorder', { state: { selectedVendor: addedVendor } });
          },
        });
      })
      .catch((error) => {
        console.error('Error adding a vendor:', error);
      });
  };

  return (
    <div>
      <NavBar />
      <div style={{ textAlign: 'center' }}>

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
      <ToastContainer />
    </div>
  );
}

export default AddVendor;
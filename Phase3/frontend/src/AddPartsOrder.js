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
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function AddPartsOrder() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const location = useLocation();
  const selectedVendor = location.state?.selectedVendor || null;
  const [newPartsOrder, setNewPartsOrder] = useState({
    partName: '',
    quantity: '',
    description: '',
    cost: '',
  });

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Selected vendor:', selectedVendor);
  }, [location.state, selectedVendor]);

  const handleAddPartsOrder = () => {
    // Check if any of the fields is empty
    for (const key in newPartsOrder) {
      if (newPartsOrder[key].trim() === '') {
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
        return; // Don't proceed with adding the parts order
      }
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    axios.post('/api/addPartsOrder', newPartsOrder, { headers })
      .then((response) => {
        console.log('Parts order added:', response.data);
        setNewPartsOrder({
          partName: '',
          quantity: '',
          description: '',
          cost: '',
        });
      })
      .catch((error) => {
        console.error('Error adding a parts order:', error);
      });
  };

  return (
    <div>
      <NavBar />
      <div style={{ textAlign: 'center' }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Link to="/searchVendor">Search Vendor</Link>
          </Grid>
        </Grid>
        {selectedVendor ? (
        <div>
          <h2>Selected Vendor:</h2>
          <p>Name: {selectedVendor.name}</p>
          <p>Phone Number: {selectedVendor.phoneNumber}</p>
          <p>Street: {selectedVendor.street}</p>
          <p>City: {selectedVendor.city}</p>
          <p>State: {selectedVendor.state}</p>
          <p>Postal Code: {selectedVendor.postalCode}</p>
          {/* Add more vendor details as needed */}
        </div>
      ) : (
        <p>No selected vendor.</p>
      )}
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
        <h1>Add New Parts Order</h1>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Part Name"
              variant="outlined"
              value={newPartsOrder.partName}
              onChange={(e) => setNewPartsOrder({ ...newPartsOrder, partName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Quantity"
              variant="outlined"
              value={newPartsOrder.quantity}
              onChange={(e) => setNewPartsOrder({ ...newPartsOrder, quantity: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              variant="outlined"
              value={newPartsOrder.description}
              onChange={(e) => setNewPartsOrder({ ...newPartsOrder, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Cost"
              variant="outlined"
              value={newPartsOrder.cost}
              onChange={(e) => setNewPartsOrder({ ...newPartsOrder, cost: e.target.value })}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleAddPartsOrder}>
              Add Parts Order
            </Button>
          </Grid>
        </Grid>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddPartsOrder;

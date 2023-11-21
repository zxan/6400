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
import { useNavigate } from 'react-router-dom';

function AddPartsOrder() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const location = useLocation();
  const vehicleInfo = location.state?.vehicleInfo || {};
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem('user');
  const [partOrderNumbers, setPartOrderNumbers] = useState([]);
  const selectedVendor = location.state?.selectedVendor || null;
  const [newPartsOrder, setNewPartsOrder] = useState({
    partNumber: '',
    quantity: '',
    description: '',
    cost: '',
  });

  const [partOrdersCount, setPartOrdersCount] = useState(null); // State to store part orders count

  // Fetch the count of part orders and part order numbers for the VIN on page load
  useEffect(() => {
    // Fetch count of part orders
    axios.get(`/api/countPartOrdersByVin?vin=${vehicleInfo.vin}`)
      .then((response) => {
        const count = response.data.partOrdersCount;
        setPartOrdersCount(count);
        console.log(`Number of part orders for VIN ${vehicleInfo.vin}: ${count}`);

        // Fetch part order numbers
        axios.get(`/api/getPartOrderNumbersByVin?vin=${vehicleInfo.vin}`)
          .then((response) => {
            const numbers = response.data.partOrderNumbers;
            setPartOrderNumbers(numbers);
          })
          .catch((error) => {
            console.error('Error fetching part order numbers:', error);
          });
      })
      .catch((error) => {
        console.error('Error counting part orders:', error);
      });
  }, [vehicleInfo.vin]);


  console.log("VehicleInfo: ", vehicleInfo.vin);
  console.log("storedUser: ", storedUser);
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

    

    const partsOrderData = {
      ...newPartsOrder,
      vin: vehicleInfo.vin,
      storedUser: storedUser,
      vendorInfo: {
        name: selectedVendor.name,
        phoneNumber: selectedVendor.phoneNumber,
        street: selectedVendor.street,
        city: selectedVendor.city,
        state: selectedVendor.state,
        postalCode: selectedVendor.postalCode,
      },
    };
  

    
    axios.post('/api/addPartsOrder', partsOrderData, { headers })
      .then((response) => {
        console.log('Parts order added:', response.data);
        console.log('vehicleInfo data:', vehicleInfo);
        console.log('storedUser data:', storedUser);
        setNewPartsOrder({
          partNumber: '',
          quantity: '',
          description: '',
          cost: '',
        });
      })
      .catch((error) => {
        console.error('Error adding a parts order:', error);
      });
  };

  const handleSearchVendor = () => {
    navigate('/searchVendor', { state: { vehicleInfo: vehicleInfo } });
  };

  const handleSelectPartOrder = (selectedOrderNumber) => {
    // Add your logic for handling the selected part order number
    console.log(`Selected part order: ${selectedOrderNumber}`);
  };

  return (
    <div>
      <NavBar />
      <div style={{ textAlign: 'center' }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" onClick={handleSearchVendor}>
              Search Vendor
            </Button>
          </Grid>
        </Grid>
        {selectedVendor ? (
          <div>
            <h2>Selected Vendor:</h2>
            <p>Name: {selectedVendor.name}</p>
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
              label="Part Number"
              variant="outlined"
              value={newPartsOrder.partNumber}
              onChange={(e) => setNewPartsOrder({ ...newPartsOrder, partNumber: e.target.value })}
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
  
            {partOrderNumbers.length > 0 && (
              <div>
                <h2>Part Order Numbers:</h2>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order Number</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {partOrderNumbers.map((orderNumber, index) => (
                        <TableRow key={index} onClick={() => handleSelectPartOrder(orderNumber)}>
                          <TableCell>{orderNumber}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
      <ToastContainer />
    </div>
  );
  
}

export default AddPartsOrder;

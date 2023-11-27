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

import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AddPartsOrder() {
  //const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const location = useLocation();
  const vehicleInfo = location.state?.vehicleInfo || {};
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem('user');
  const [partOrderNumbers, setPartOrderNumbers] = useState([]);
  const selectedVendor = location.state?.selectedVendor || null;
  const [isAddingToExistingOrder, setIsAddingToExistingOrder] = useState(false);
  
  const [vendorInfo, setVendorInfo] = useState(null);
  const [newPartsOrder, setNewPartsOrder] = useState({
    partNumber: '',
    quantity: '',
    description: '',
    cost: '',
  });

  const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);



  const [partOrdersCount, setPartOrdersCount] = useState(null); // State to store part orders count

  // Fetch the count of part orders and part order numbers for the VIN on page load
  useEffect(() => {

    //to set condition about if it is for an existing part order back to false
    setIsAddingToExistingOrder(false);

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

    if (!selectedVendor) {
      toast.error('Please select a vendor before adding or updating a part order', {
        position: "top-center",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return; // Don't proceed with adding or updating the parts order
    }

    // if this is for a new order
    if (!isAddingToExistingOrder) {
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
    
      let orderNumber = '';
    
      // Append "-" followed by the count of partOrderNumbers.length
      orderNumber += `${String(partOrderNumbers.length + 1).padStart(3, '0')}`;
    
      const headers = {
        'Content-Type': 'application/json',
      };
    
      const partsOrderData = {
        ...newPartsOrder,
        vin: vehicleInfo.vin,
        storedUser: storedUser,
        orderNumber: orderNumber,
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
          const toastMessage = `Part order updated successfully:
        `;
    
          toast.success(toastMessage, {
            position: "top-center",
            autoClose: true,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => {
              const updatedLocation = { ...location, state: { ...location.state, vehicleInfo } };

          // Refresh the page with the updated state
          navigate(location.pathname, updatedLocation);

          // Reload the page
          window.location.reload();
      },
    });
  })
  .catch((error) => {
    console.error('Error adding a parts order:', error);
    // Handle the error, you can use toast.error or another method to notify the user
  });
     } else {
      // Handle the case where isAddingToExistingOrder is true
      // Logic for updating an existing part order

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
  
      // Construct the updated part information object
      const updatedPartInfo = {
        vin: vehicleInfo.vin,
        partNumber: newPartsOrder.partNumber,
        quantity: newPartsOrder.quantity,
        description: newPartsOrder.description,
        cost: newPartsOrder.cost,
        orderNumber: selectedOrderNumber, // Pass the selected order number for the update
        vendorInfo: {
          name: selectedVendor.name,
          // Add other vendor information if needed
        },
      };
  
      // Make a request to update the existing part order
      axios.post('/api/updatePartsOrderwithParts', updatedPartInfo)
        .then((response) => {
          console.log('Part order updated:', response.data);
  
          // Reset the state after updating the part order
          setIsAddingToExistingOrder(false);
  
          const toastMessage = `Part order updated successfully:
        `;
    
          toast.success(toastMessage, {
            position: "top-center",
            autoClose: true,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => {
              const updatedLocation = { ...location, state: { ...location.state, vehicleInfo } };

          // Refresh the page with the updated state
          navigate(location.pathname, updatedLocation);

          // Reload the page
          window.location.reload();
      },
    });
        })
        .catch((error) => {
          console.error('Error updating part order:', error);
          // Handle the error, you can use toast.error or another method to notify the user
        });
    }
  };
  

  const handleSearchVendor = () => {
    navigate('/searchVendor', { state: { vehicleInfo: vehicleInfo } });
  };

  const handleSelectPartOrder = (clickedOrderNumber) => {
    if (clickedOrderNumber === selectedOrderNumber) {
      // If the same order number is clicked again, switch back to adding a new order
      setIsAddingToExistingOrder(false);
      setSelectedOrderNumber(null);
      setVendorInfo(null); // Reset vendor info if needed
    } else {
      // If a different order number is clicked, set it as the selected order
      setIsAddingToExistingOrder(true);
      console.log(isAddingToExistingOrder);
      setSelectedOrderNumber(clickedOrderNumber);
      console.log(`Selected part order: ${clickedOrderNumber}`);
      // Fetch vendor information based on the selected part order number
      axios.get(`/api/getVendorInfoByPartOrder?orderNumber=${clickedOrderNumber}`)
        .then((response) => {
          const vendorInfo = response.data;
  
          //this need to be commented because when adding a part to an existing part order i need to be able to choose a different vendor
          //setVendorInfo(vendorInfo);
  
          console.log(`Selected part order: ${clickedOrderNumber}`);
        })
        .catch((error) => {
          console.error('Error fetching vendor information:', error);
        });
    }
  };
  

  return (
    <div>
      <NavBar />
      <div style={{ textAlign: 'center' }}>

        <h2>VIN: {vehicleInfo.vin}</h2>

        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" onClick={handleSearchVendor}>
              Search Vendor
            </Button>
          </Grid>
        </Grid>
        {vendorInfo ? (
  // Render details of the selected vendor using selectedVendorInfo
  <div>
    <h2>Selected Vendor:</h2>
    <p>Name: {vendorInfo.name}</p>
    <p>Phone Number: {vendorInfo.phoneNumber}</p>
    <p>Street: {vendorInfo.street}</p>
    <p>City: {vendorInfo.city}</p>
    <p>State: {vendorInfo.state}</p>
    <p>Postal Code: {vendorInfo.postalCode}</p>
  </div>
) : selectedVendor ? (
  // Render details of the selected vendor using selectedVendor
  <div>
    <h2>Selected Vendor:</h2>
    <p>Name: {selectedVendor.name}</p>
    <p>Phone Number: {selectedVendor.phoneNumber}</p>
    <p>Street: {selectedVendor.street}</p>
    <p>City: {selectedVendor.city}</p>
    <p>State: {selectedVendor.state}</p>
    <p>Postal Code: {selectedVendor.postalCode}</p>
  </div>
) : (
  // Render this if no vendor is selected
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
                        <TableRow key={index} onClick={() => handleSelectPartOrder(orderNumber)}
                        style={{
                          backgroundColor: selectedOrderNumber === orderNumber ? '#a6a6a6' : 'inherit',
                          cursor: 'pointer',
                        }}
                      >
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

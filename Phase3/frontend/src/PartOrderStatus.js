import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import NavBar from './component/navBar';
import BasicTable from './component/basicTable';
import Checkbox from '@mui/material/Checkbox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PartOrderStatus() {
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchVendorName, setSearchVendorName] = useState('');
  const [searchVin, setSearchVin] = useState('');
  const [searchPartNumber, setSearchPartNumber] = useState('');
  const [searchQuantity, setSearchQuantity] = useState('');
  const [searchCost, setSearchCost] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const orderNumber = selectedOrder.orderNumber;
  const partNumber = selectedOrder.partNumber;
  const vin = selectedOrder.vin;

  const columns = [
    { Header: 'Order Number', accessor: 'orderNumber' },
    { Header: 'Vendor Name', accessor: 'vendorName' },
    { Header: 'VIN', accessor: 'vin' },
    { Header: 'Part Number', accessor: 'partNumber' },
    { Header: 'Quantity', accessor: 'quantity' },
    { Header: 'Cost', accessor: 'cost' },
    { Header: 'Status', accessor: 'status' },
  ];

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    // Check if at least one status is selected
    if (searchStatus.length === 0) {
      // Show a toast message and return from the function
      toast.error('A Status must be selected', {
        position: "top-center",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    // Make an HTTP request to search for part orders based on the search criteria
    console.log('Search status:', searchStatus);
    axios.get(`/api/getPartOrder`, {
      params: {
        orderNumber: searchOrderNumber,
        vendorName: searchVendorName,
        vin: searchVin,
        partNumber: searchPartNumber,
        quantity: searchQuantity,
        cost: searchCost,
        status: searchStatus,
      },
    })
    .then((response) => {
      console.log('Search results:', response.data);
      setSearchResults(response.data);
    })
    .catch((error) => {
      console.error('Error searching for part orders:', error);
    });
  };
  

  const handleStatusChange = (value) => {
    // Update the searchStatus array based on checkbox changes
    if (searchStatus.includes(value)) {
      // Remove the value if already present
      setSearchStatus(searchStatus.filter((status) => status !== value));
    } else {
      // Add the value if not present
      setSearchStatus([...searchStatus, value]);
    }
  };

  
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    if (order.status === 'installed') {
      // Show a toast message indicating that the status cannot be changed
      toast.error('Order status cannot be changed because it is already installed', {
        position: "top-center",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      // Open the dialog for other status updates
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleStatusUpdate = () => {
    // Make an HTTP request to update the order status
    axios
      .put(`/api/updatePartOrderStatus/${selectedOrder?.orderNumber}/${selectedOrder?.partNumber}/${selectedOrder?.vin}`, { status: newStatus })
      .then((response) => {
        console.log('Order status updated:', response.data);
        // Refresh the part orders after updating status
        handleSearch();
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
    });
  };

  return (
    <div>
      <NavBar />
      <ToastContainer />
      <div style={{ textAlign: 'center' }}>
        <h1>Part Order Status</h1>
        <h2>Search, View Part Order</h2>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Order Number"
              variant="outlined"
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
              fullWidth
            />
            <TextField
              label="Vendor Name"
              variant="outlined"
              value={searchVendorName}
              onChange={(e) => setSearchVendorName(e.target.value)}
              fullWidth
            />
            <TextField
              label="VIN"
              variant="outlined"
              value={searchVin}
              onChange={(e) => setSearchVin(e.target.value)}
              fullWidth
            />
            <TextField
              label="Part Number"
              variant="outlined"
              value={searchPartNumber}
              onChange={(e) => setSearchPartNumber(e.target.value)}
              fullWidth
            />
            <TextField
              label="Quantity"
              variant="outlined"
              type="number"
              value={searchQuantity}
              onChange={(e) => setSearchQuantity(e.target.value)}
              fullWidth
            />
            <TextField
              label="Cost"
              variant="outlined"
              type="number"
              value={searchCost}
              onChange={(e) => setSearchCost(e.target.value)}
              fullWidth
            />
            <div>
              <label>Order Status:</label>
              <Checkbox
                checked={searchStatus.includes('ordered')}
                onChange={() => handleStatusChange('ordered')}
              />
              <label>Ordered</label>

              <Checkbox
                checked={searchStatus.includes('received')}
                onChange={() => handleStatusChange('received')}
              />
              <label>Received</label>

              <Checkbox
                checked={searchStatus.includes('installed')}
                onChange={() => handleStatusChange('installed')}
              />
              <label>Installed</label>
            </div>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search Part Order
            </Button>
          </Grid>
        </Grid>
        {searchResults.length > 0 && (
        <Paper elevation={3} style={{ marginTop: '20px' }}>
          <BasicTable
            columns={columns}
            data={searchResults}
            onRowClick={(row) => handleOrderClick(row)}
          />
        </Paper>
      )}

        {/* Dialog for updating order status */}
        {selectedOrder && (
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {selectedOrder.status === 'received' ? (
                    <MenuItem value="installed">Installed</MenuItem>
                  ) : (
                    [
                      <MenuItem key="received" value="received">Received</MenuItem>,
                      <MenuItem key="installed" value="installed">Installed</MenuItem>,
                    ]
                  )}
                </Select>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleStatusUpdate} color="primary">
        Update Status
      </Button>
      <Button onClick={handleDialogClose} color="primary">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
)}

      </div>
    </div>
  );
}

export default PartOrderStatus;

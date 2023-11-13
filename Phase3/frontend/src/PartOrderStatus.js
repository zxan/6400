import React, { useState } from 'react';
import { TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import NavBar from './component/navBar';
import BasicTable from './component/basicTable';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

function PartOrderStatus() {
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchVendorName, setSearchVendorName] = useState('');
  const [searchVin, setSearchVin] = useState('');
  const [searchPartNumber, setSearchPartNumber] = useState('');
  const [searchQuantity, setSearchQuantity] = useState('');
  const [searchCost, setSearchCost] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

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

  return (
    <div>
      <NavBar />
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
            <RadioGroup
              aria-label="status"
              name="status"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              style={{ flexDirection: 'row' }} // Align radio buttons horizontally
            >
              <FormControlLabel value="ordered" control={<Radio />} label="Ordered" />
              <FormControlLabel value="received" control={<Radio />} label="Received" />
              <FormControlLabel value="installed" control={<Radio />} label="Installed" />
            </RadioGroup>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search Part Order
            </Button>
          </Grid>
        </Grid>
        {searchResults.length > 0 && (
          <Paper elevation={3} style={{ marginTop: '20px' }}>
            <BasicTable columns={columns} data={searchResults} />
          </Paper>
        )}
      </div>
    </div>
  );
}

export default PartOrderStatus;

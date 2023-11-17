// basicTable.js

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function BasicTable({ columns, data , onRowClick}) {
const styles = {
  table: {
    width: '100%', // Adjust the width to your preference
    borderCollapse: 'collapse', // Add this property
    border: '1px solid #000',
    margin: 'auto', // Centering the table
  },
  columnHeader: {
    backgroundColor: '#f2f2f2',
    border: '1px solid #000',
    padding: '8px',
    textAlign: 'left',
  },
  highlightedRow: {
    backgroundColor: 'red',
  },
};


return (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.Header}>{column.Header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.orderNumber} onClick={() => onRowClick(row)} style={{ cursor: 'pointer' }}>
            {columns.map((column) => (
              <TableCell key={column.Header}>{row[column.accessor]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
};

export default BasicTable;
// basicTable.js

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function BasicTable({ columns, data }) {
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
      <Table style={styles.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} style={styles.columnHeader}>{column.Header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} style={item.redHighlighted ? styles.highlightedRow : null}>
              {columns.map((column, columnIndex) => (
                <TableCell key={columnIndex}>{item[column.accessor]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasicTable;

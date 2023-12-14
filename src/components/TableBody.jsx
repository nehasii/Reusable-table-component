import React from 'react';
import { TableCell, TableRow } from '@mui/material';

const TableBody = ({ columns, data, page, rowsPerPage }) => {
  return (
    <>
      {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((column) => (
            <TableCell key={column.id}>{row[column.id]}</TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableBody;

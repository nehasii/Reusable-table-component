
import React from 'react';
import { TableCell, TableRow, TableSortLabel, TextField } from '@mui/material';

const TableHeader = ({ columns, onRequestSort, order, orderBy, onFilterChange, filters, onSearch }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(property);
  };

  const handleFilterInputChange = (columnId, event) => {
    const { value } = event.target;
    onFilterChange(columnId, value);
  };

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    onSearch(value);
  };

  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
          {column.sortable ? (
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
            </TableSortLabel>
          ) : (
            column.label
          )}
          {column.filterable && (
            <TextField
              label={`Filter ${column.label}`}
              value={filters[column.id] || ''}
              onChange={(event) => handleFilterInputChange(column.id, event)}
            />
          )}
        </TableCell>
      ))}
      <TableCell>
        <TextField
          label="Search"
          onChange={handleSearchInputChange}
        />
      </TableCell>
    </TableRow>
  );
};

export default TableHeader;

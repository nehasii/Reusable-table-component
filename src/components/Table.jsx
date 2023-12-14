import React, { useState } from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableSortLabel,
  TableBody,
  TablePagination,
  Select,
  MenuItem,
  Checkbox,
  InputAdornment,
  Input,
  IconButton,
  TableHead,
  Typography,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import data from './UserData.json';

const ItemTypes = {
  COLUMN: 'column',
};

const Column = ({ id, label, onDrop, index }) => {
  const [, drag] = useDrag({
    type: ItemTypes.COLUMN,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onDrop(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <Resizable
      width={150}
      height={0}
      onResize={(event, { size }) => {
      }}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <TableCell ref={(node) => drag(drop(node))}>
        {label}
      </TableCell>
    </Resizable>
  );
};

const MyTable = () => {
  const [columns, setColumns] = useState(() => {
    const sampleRow = data[0];
    return Object.keys(sampleRow).map((key) => ({
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      minWidth: 100,
      sortable: true,
      filterable: true,
      resizable: true,
      order: 'asc',
      width: 150,
      isVisible: true,
    }));
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [showHiddenColumns, setShowHiddenColumns] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [columnFilters, setColumnFilters] = useState(() => {
    const initialFilters = {};
    columns.forEach((column) => {
      initialFilters[column.id] = '';
    });
    return initialFilters;
  });

  const [openFilters, setOpenFilters] = useState(false);

  const handleToggleFilters = () => {
    setOpenFilters(!openFilters);
  };

  const handleRequestSort = (columnId) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const clickedColumn = newColumns.find((column) => column.id === columnId);

      clickedColumn.order = clickedColumn.order === 'asc' ? 'desc' : 'asc';

      newColumns.forEach((column) => {
        if (column.id !== columnId) {
          column.order = 'asc';
        }
      });

      setOrderBy(columnId);
      setOrder(clickedColumn.order);

      setSortedData((prevData) => {
        return [...prevData].sort((a, b) => {
          const aValue = a[columnId];
          const bValue = b[columnId];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return clickedColumn.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return clickedColumn.order === 'asc' ? aValue - bValue : bValue - aValue;
          } else {
            return 0;
          }
        });
      });

      return newColumns;
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleResize = (index) => (event, { size }) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      newColumns[index].width = size.width;
      return newColumns;
    });
  };

  const handleToggleVisibility = (columnId) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const column = newColumns.find((column) => column.id === columnId);

      if (column) {
        column.isVisible = !column.isVisible;
      }

      return newColumns;
    });
  };

  const handleShowHiddenColumns = () => {
    setShowHiddenColumns((prevShowHiddenColumns) => !prevShowHiddenColumns);
  };

  const handleSearch = (searchTerm, columnFilters) => {
    const filteredData = data.filter((row) => {
      return visibleColumns.some((column) => {
        const cellValue = row[column.id];
        const lowercaseCellValue = cellValue ? cellValue.toString().toLowerCase() : '';
        const lowercaseSearchTerm = searchTerm.toLowerCase();
        const columnFilterValue = columnFilters[column.id].toLowerCase();

        return (
          (searchTerm === '' || lowercaseCellValue.includes(lowercaseSearchTerm)) &&
          (columnFilterValue === '' || lowercaseCellValue.includes(columnFilterValue))
        );
      });
    });

    setSortedData(filteredData);
  };

  const handleSearchTermChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    setTimeout(() => {
      handleSearch(newSearchTerm, columnFilters);
    }, 300);
  };

  const handleColumnFilterChange = (columnId, filterValue) => {
    setColumnFilters((prevFilters) => ({
      ...prevFilters,
      [columnId]: filterValue,
    }));

    handleSearch(searchTerm, { ...columnFilters, [columnId]: filterValue });
  };

  const handleColumnDrop = (startIndex, endIndex) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const [removed] = newColumns.splice(startIndex, 1);
      newColumns.splice(endIndex, 0, removed);
      return newColumns;
    });
  };

  const visibleColumns = showHiddenColumns
    ? columns
    : columns.filter((column) => column.isVisible);

  return (
    <DndProvider backend={HTML5Backend}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          My Table
        </Typography>
        <Box mb={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="search-input">Search</InputLabel>
            <OutlinedInput
              id="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchTermChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearch(searchTerm, columnFilters)}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
              label="Search"
            />
          </FormControl>
        </Box>
        <Box mb={2}>
          <Select
            value={''}
            displayEmpty
            renderValue={() => 'Select Columns'}
            fullWidth
          >
            <MenuItem key="all" value="">
              <Checkbox
                checked={showHiddenColumns}
                onChange={handleShowHiddenColumns}
              />
              Show Hidden Columns
            </MenuItem>
            {columns.map((column) => (
              <MenuItem key={column.id} value={column.id}>
                <Checkbox
                  checked={column.isVisible}
                  onChange={() => handleToggleVisibility(column.id)}
                />
                {column.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box mb={2} display="flex" alignItems="center" flexWrap="wrap">
          {visibleColumns.map((column, index) => (
            <React.Fragment key={column.id}>
              <Box position="relative" marginRight="8px">
                <IconButton onClick={handleToggleFilters}>
                  <FilterListIcon />
                </IconButton>
                {openFilters && (
                  <Box position="absolute" top="100%" left="0" zIndex="1">
                    <FormControl fullWidth>
                      <InputLabel htmlFor={`filter-input-${column.id}`}>{`Filter ${column.label}`}</InputLabel>
                      <OutlinedInput
                        id={`filter-input-${column.id}`}
                        placeholder={`Filter ${column.label}...`}
                        value={columnFilters[column.id]}
                        onChange={(e) => handleColumnFilterChange(column.id, e.target.value)}
                        label={`Filter ${column.label}`}
                      />
                    </FormControl>
                  </Box>
                )}
              </Box>
              <Column id={column.id} label={column.label} onDrop={handleColumnDrop} index={index} />
            </React.Fragment>
          ))}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {visibleColumns.map((column, index) => (
                  <Resizable
                    key={column.id}
                    width={column.width}
                    height={0}
                    onResize={handleResize(index)}
                    draggableOpts={{ enableUserSelectHack: false }}
                  >
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth, width: column.width }}
                      onClick={() => column.sortable && handleRequestSort(column.id)}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => column.sortable && handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  </Resizable>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {visibleColumns.map((column) => (
                    column.isVisible && (
                      <TableCell key={column.id}>{row[column.id]}</TableCell>
                    )
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </DndProvider>
  );
};

export default MyTable;


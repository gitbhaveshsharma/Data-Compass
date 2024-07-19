import React, { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const DataTable = ({ columns, data, title, baseURL }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const filteredRows = data.filter(row =>
        columns.some(column =>
            String(row[column.id]).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const rows = Array.isArray(filteredRows) ? filteredRows.map((row) => ({
        ...row,
        address: row.address || 'empty',
        orderItems: row.products && row.products.length > 0
            ? row.products.map(product => `${product.productName} (Quantity: ${product.quantity})`).join(', ')
            : 'empty',
    })) : [];

    return (
        <div style={{ flex: '1 0 21%', padding: '20px' }}>
                <h3>{title}</h3>
            <p>Data Count: {rows.length}</p>
            <Button variant="outlined" onClick={handleOpen}>
                View {title}
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px' }}>
                    <DialogTitle style={{ margin: 0 }}>{title}</DialogTitle>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ width: '300px', maxWidth: '100%' }}
                    />
                </div>
                <DialogContent>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 395 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row._id}
                                                component={Link}
                                                to={`${baseURL}/${row._id}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DataTable;

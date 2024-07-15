import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedData } from '../../redux/dataActions';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { columns } from '../../constants/orderColumns';

const FreshLeadCard = ({ employeeId }) => {
    const dispatch = useDispatch();
    const assignedData = useSelector((state) => state.data.assignedData.assignedData || []);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchAssignedData(employeeId));
        }
    }, [dispatch, employeeId]);

    useEffect(() => {
        console.log("Assigned Data:", assignedData);
    }, [assignedData]);

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

    const filteredRows = assignedData.filter(row =>
        columns.some(column =>
            String(row[column.id]).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const rows = Array.isArray(filteredRows) ? filteredRows
        .filter(data => data.status === 'assigned')
        .map((data) => ({
            ...data,
            address: data.address || 'empty',
        })) : [];

    return (
        <div style={{ flex: '1 0 21%', border: '1px solid #ccc', padding: '20px' }}>
            <h3>Fresh Lead</h3>
            <p>Assigned Data: {rows.length}</p>
            <Button variant="outlined" onClick={handleOpen}>
                View Assigned Data
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                    <DialogTitle style={{ margin: 0 }}>Assigned Data</DialogTitle>
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
                        <TableContainer sx={{ maxHeight: 440 }}>
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
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row._id} component={Link} to={`/data/${row._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default FreshLeadCard;

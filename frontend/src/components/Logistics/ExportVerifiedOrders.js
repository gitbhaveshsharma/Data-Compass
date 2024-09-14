import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVerifiedOrders } from '../../redux/dataActions';
import {
    Button, Checkbox, TextField, FormControlLabel, Snackbar, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow
} from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { exportColumns as columns } from '../../constants/orderColumns'; // Import the columns

dayjs.extend(utc);
dayjs.extend(timezone);

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const formatProduct = (product) => {
    return `Product: ${product.productName}`;
};

const formatDate = (date) => {
    return dayjs(date).tz(dayjs.tz.guess()).format('YYYY-MM-DD HH:mm:ss');
};

const ExportVerifiedOrders = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.data.orderData.verifiedOrders);
    const [fileName, setFileName] = useState('Orders');
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [exportDialogOpen, setExportDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchVerifiedOrders());
    }, [dispatch]);

    const handleColumnChange = (event) => {
        const { name, checked } = event.target;
        if (checked) {
            setSelectedColumns((prev) => [...prev, name]);
        } else {
            setSelectedColumns((prev) => prev.filter((col) => col !== name));
        }
    };

    const handleSelectAll = () => {
        if (selectedColumns.length === columns.length) {
            setSelectedColumns([]);
        } else {
            setSelectedColumns(columns.map(col => col.id));
        }
    };

    const handleExport = () => {
        const filteredOrders = orders.filter(order => {
            const createdAt = dayjs(order.createdAt);
            const matchesSearch = Object.values(order).some(value =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            );
            return matchesSearch && (!startDate || createdAt.isAfter(startDate)) && (!endDate || createdAt.isBefore(endDate));
        }).map((order) => {
            const filteredOrder = {};
            selectedColumns.forEach((col) => {
                if (col === 'products' && order[col].length > 0) {
                    filteredOrder[col] = order[col].map(product => formatProduct(product)).join(', ');
                } else if (col === 'discountType' || col === 'discountValue' || col === 'gstPercentage' || col === 'totalPrice' || col === 'paymentMethod' || col === 'transactionId') {
                    filteredOrder[col] = order.billDetails ? order.billDetails.map(bill => bill[col]).join(', ') : '';
                } else if (col === 'createdAt' || col === 'expectedDeliveryDate') {
                    filteredOrder[col] = formatDate(order[col]);
                } else if (col === 'fleadEmployeeIds' || col === 'verifyEmployeeIds' || col === 'reworkEmployeeIds' || col === 'rtoEmployeeIds') {
                    filteredOrder[col] = order[col].join(', ');
                }
                else {
                    filteredOrder[col] = order[col];
                }
            });
            return filteredOrder;
        });

        const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
        saveAs(data, `${fileName}.xlsx`);
        setOpenSnackbar(true);
        setExportDialogOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleExportDialogOpen = () => {
        setExportDialogOpen(true);
    };

    const handleExportDialogClose = () => {
        setExportDialogOpen(false);
    };

    const filteredOrders = orders.filter(order => {
        const createdAt = dayjs(order.createdAt);
        const matchesSearch = Object.values(order).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesSearch && (!startDate || createdAt.isAfter(startDate)) && (!endDate || createdAt.isBefore(endDate));
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ flex: '1 0 21%', padding: '20px' }}>
                <h3>Verified Orders</h3>
                <p>Data Count: {orders.length}</p>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleExportDialogOpen}
                >
                    Export Data
                </Button>
                <Dialog open={exportDialogOpen} onClose={handleExportDialogClose} fullWidth maxWidth="lg">
                    <DialogTitle>Export Orders</DialogTitle>
                    <DialogContent>
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <Button variant="contained" color="primary" onClick={handleSelectAll}>
                                    {selectedColumns.length === columns.length ? "Deselect All" : "Select All"}
                                </Button>
                                {columns.map((col) => (
                                    <FormControlLabel
                                        key={col.id}
                                        control={<Checkbox name={col.id} checked={selectedColumns.includes(col.id)} onChange={handleColumnChange} />}
                                        label={col.label}
                                    />
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <TextField
                                    label="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <TextField
                                    type="text"
                                    label="File Name"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                />
                            </div>
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                {columns.filter(col => selectedColumns.includes(col.id)).map((column) => (
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
                                            {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={order.orderId}>
                                                    {columns.filter(col => selectedColumns.includes(col.id)).map((column) => {
                                                        const value = column.id === 'products' && order[column.id].length > 0
                                                            ? order[column.id].map(product => formatProduct(product)).join(', ')
                                                            : column.id === 'discountType' || column.id === 'discountValue' || column.id === 'gstPercentage' || column.id === 'totalPrice' || column.id === 'paymentMethod' || column.id === 'transactionId'
                                                                ? order.billDetails ? order.billDetails.map(bill => bill[column.id]).join(', ') : ''
                                                                : column.id === 'createdAt'
                                                                    ? formatDate(order[column.id])
                                                                    : order[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {value}
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
                                    count={filteredOrders.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleExportDialogClose} color="secondary">Cancel</Button>
                        <Button onClick={handleExport} color="primary">Export</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Orders exported successfully!
                    </Alert>
                </Snackbar>
            </div>
        </LocalizationProvider>
    );
};

export default ExportVerifiedOrders;

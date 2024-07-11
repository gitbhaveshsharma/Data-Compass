import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVerifiedOrders } from '../../redux/dataActions';
import { Button, Checkbox, TextField, FormControlLabel, Snackbar, Alert, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const formatProduct = (product) => {
    return `Product: ${product.productName}, Quantity: ${product.quantity}, Price: ${product.price}`;
};

const formatDate = (date) => {
    return dayjs(date).tz(dayjs.tz.guess()).format('YYYY-MM-DD HH:mm:ss');
};

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'number', label: 'Number', minWidth: 100 },
    { id: 'products', label: 'Products', minWidth: 170 },
    { id: 'discountType', label: 'Discount Type', minWidth: 170 },
    { id: 'discountValue', label: 'Discount Value', minWidth: 170 },
    { id: 'gstPercentage', label: 'GST Percentage', minWidth: 170 },
    { id: 'totalPrice', label: 'Total Price', minWidth: 170 },
    { id: 'address', label: 'Address', minWidth: 170 },
    { id: 'city', label: 'City', minWidth: 170 },
    { id: 'state', label: 'State', minWidth: 170 },
    { id: 'zip', label: 'Zip', minWidth: 170 },
    { id: 'nearBy', label: 'Near By', minWidth: 170 },
    { id: 'area', label: 'Area', minWidth: 170 },
    { id: 'altNumber', label: 'Alt Number', minWidth: 170 },
    { id: 'createdAt', label: 'Created At', minWidth: 170 },
];

const ExportVerifiedOrders = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.data.orderData.data);
    const [selectedColumns, setSelectedColumns] = useState(columns.map(col => col.id));
    const [fileName, setFileName] = useState('Orders');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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

    const handleExport = () => {
        const filteredOrders = orders.filter(order => {
            const createdAt = dayjs(order.createdAt);
            return (!startDate || createdAt.isAfter(startDate)) && (!endDate || createdAt.isBefore(endDate));
        }).map((order) => {
            const filteredOrder = {};
            selectedColumns.forEach((col) => {
                if (col === 'products' && order[col].length > 0) {
                    filteredOrder[col] = order[col].map(product => formatProduct(product)).join(', ');
                } else if (col === 'discountType' || col === 'discountValue' || col === 'gstPercentage' || col === 'totalPrice') {
                    filteredOrder[col] = order.billDetails ? order.billDetails.map(bill => bill[col]).join(', ') : '';
                } else if (col === 'createdAt') {
                    filteredOrder[col] = formatDate(order[col]);
                } else {
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

    return (
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                <div style={{ marginBottom: '20px' }}>
                    <Typography variant="h5" gutterBottom>Export Orders</Typography>
                    {columns.map((col) => (
                        <FormControlLabel
                            key={col.id}
                            control={<Checkbox name={col.id} checked={selectedColumns.includes(col.id)} onChange={handleColumnChange} />}
                            label={col.label}
                        />
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleExport}
                        style={{ alignSelf: 'center', height: 'fit-content' }}
                    >
                        Export Orders
                    </Button>
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
                                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={order._id}>
                                        {selectedColumns.map((col) => {
                                            const value = order[col];
                                            return (
                                                <TableCell key={col} align={columns.find(c => c.id === col).align}>
                                                    {col === 'products' && order[col].length > 0
                                                        ? order[col].map(product => formatProduct(product)).join(', ')
                                                        : col === 'discountType'
                                                            ? order.billDetails.map(bill => bill.discountType).join(', ')
                                                            : col === 'discountValue'
                                                                ? order.billDetails.map(bill => bill.discountValue).join(', ')
                                                                : col === 'gstPercentage'
                                                                    ? order.billDetails.map(bill => bill.gstPercentage).join(', ')
                                                                    : col === 'totalPrice'
                                                                        ? order.billDetails.map(bill => bill.totalPrice).join(', ')
                                                                        : col === 'createdAt'
                                                                            ? formatDate(order[col])
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
                        count={orders.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Data exported successfully!
                    </Alert>
                </Snackbar>
            </div>
        </LocalizationProvider>
    );
};

export default ExportVerifiedOrders;

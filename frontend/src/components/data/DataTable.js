import React, { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Snackbar,
    Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';

const DataTable = ({ columns, data, title, baseURL }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('csv');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const user = useSelector((state) => state.auth.user);
    const department = user ? user.department : '';

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDownloadDialogOpen = () => {
        if (department === 'admin' || department === 'logistics') {
            setDownloadDialogOpen(true);
        } else {
            setSnackbarMessage('Export access authentication denied');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDownloadDialogClose = () => setDownloadDialogOpen(false);

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleExportData = () => {
        const filteredData = data.filter((row) => {
            const rowDate = new Date(row.createdAt); // Assuming your data has a 'createdAt' field
            return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
        });

        if (filteredData.length === 0) {
            setSnackbarMessage('No data found within the selected date range.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (fileType === 'csv') {
            const csvData = convertToCSV(filteredData);
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `${fileName}.csv`);
        } else if (fileType === 'excel') {
            const ws = utils.json_to_sheet(filteredData);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, 'Sheet1');
            const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            saveAs(blob, `${fileName}.xlsx`);
        }

        setSnackbarMessage('Data exported successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        handleDownloadDialogClose();
    };

    const convertToCSV = (array) => {
        const keys = Object.keys(array[0]);
        const csv = [
            keys.join(','), // header row first
            ...array.map(row => keys.map(k => row[k]).join(',')) // data rows
        ].join('\n');
        return csv;
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{title}</h3>
            </div>
            <p>Data Count: {rows.length}</p>
            <Button variant="outlined" onClick={handleOpen}>
                View {title}
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px' }}>
                    <DialogTitle style={{ margin: 0 }}>{title}
                        <IconButton onClick={handleDownloadDialogOpen}>
                            <DownloadIcon />
                        </IconButton>
                    </DialogTitle>
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

            {/* Download Dialog */}
            <Dialog open={downloadDialogOpen} onClose={handleDownloadDialogClose}>
                <DialogTitle>Export Data</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '5px' }}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ flex: 1 }}
                        />
                    </div>
                    <TextField
                        label="File Name"
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        fullWidth
                        sx={{ marginTop: '16px', marginBottom: '16px' }}
                    />
                    <FormControl component="fieldset">
                        <RadioGroup
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value)}
                            row
                        >
                            <FormControlLabel value="csv" control={<Radio />} label="CSV" />
                            <FormControlLabel value="excel" control={<Radio />} label="Excel" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDownloadDialogClose}>Cancel</Button>
                    <Button onClick={handleExportData} variant="contained">Export</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for displaying messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DataTable;

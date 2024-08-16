import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    Snackbar,
    Alert
} from '@mui/material';
import { updateOrderStatus } from '../../redux/operationActions';
import { orderColumns } from '../../constants/orderColumns';

const OrderStatusManager = () => {
    const [orderIds, setOrderIds] = useState('');
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
    };

    const handleFetchOrders = () => {
        const orderIdArray = orderIds.split(',').map(id => id.trim());
        const fetchedOrders = orderIdArray.map(orderId => {
            const order = orderData.find(order => order.orderId === orderId);
            if (order) {
                // Extract products and total price
                const orderItems = order.products.map(product => `${product.productName} (Quantity: ${product.quantity})`).join(', ');
                const totalPrice = order.billDetails.reduce((total, detail) => total + detail.totalPrice, 0);

                // Consider orders with status "shipping" or "delivered" as verified
                const isError = !['verified', 'shipping', 'delivered'].includes(order.status);

                return { ...order, orderItems, totalPrice, error: isError };
            } else {
                return { orderId, error: true }; // Flag as error if not found
            }
        });
        setOrders(fetchedOrders);
    };

    const handleUpdateStatus = async (status) => {
        let successCount = 0;
        let failureCount = 0;
        let verificationFailure = 0;
        let updatePromises = [];

        for (let order of orders) {
            if (order && !order.error) {
                if (status === 'delivered' && order.status === 'verified') {
                    verificationFailure++;
                } else {
                    const updatePromise = dispatch(updateOrderStatus(order._id, status))
                        // eslint-disable-next-line no-loop-func
                        .then(() => {
                            successCount++;
                        })
                        .catch(() => {
                            failureCount++;
                        });
                    updatePromises.push(updatePromise);
                }
            } else {
                failureCount++;
            }
        }

        // Wait for all status updates to complete
        await Promise.all(updatePromises);

        // Set the final message after processing all orders
        let finalMessage = '';

        if (successCount > 0) {
            finalMessage += `Successfully updated ${successCount} order(s) to ${status}. `;
        }

        if (verificationFailure > 0) {
            finalMessage += `${verificationFailure} order(s) cannot be updated directly from verified to delivered. Update to shipping first. `;
        }

        if (failureCount > 0) {
            finalMessage += `Failed to update ${failureCount} order(s). Some orders were not verified or had other issues.`;
        }

        setMessage(finalMessage);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0); 
    };

    return (
        <div style={{ flex: '1 0 21%', padding: '20px' }}>
            <h3>Change Orders Status</h3>
            <Button variant="outlined" onClick={handleOpen} style={{ marginBottom: '10px' }}>
                Change Status
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Order IDs"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={orderIds}
                            onChange={(e) => setOrderIds(e.target.value)}
                            helperText="Enter multiple order IDs separated by commas"
                            style={{ flex: 1, marginRight: '10px' }}
                        />
                        <Button
                            onClick={handleFetchOrders}
                            color="primary"
                            variant="contained"
                            style={{ height: '56px', marginBottom: '18px' }}
                        >
                            Fetch Orders
                        </Button>
                    </div>
                    {orders.length > 0 && (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 395 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {orderColumns.map((column) => (
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
                                        {orders
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((order) => (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={order._id || order.orderId}
                                                    style={{
                                                        backgroundColor: order.error ? '#f8d7da' : 'inherit',
                                                    }}
                                                >
                                                    {orderColumns.map((column) => {
                                                        const value = column.id === 'orderItems' ? order.orderItems :
                                                            column.id === 'totalPrice' ? order.totalPrice :
                                                                order[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {order.error && column.id === 'orderId'
                                                                    ? `Order ID ${order.orderId} not verified`
                                                                    : column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value || 'N/A'}
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
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleUpdateStatus('shipping')} color="primary" variant="contained">
                        Update to Shipping
                    </Button>
                    <Button onClick={() => handleUpdateStatus('delivered')} color="primary" variant="contained">
                        Update to Delivered
                    </Button>
                    <Button onClick={handleClose} color="secondary" variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {message && (
                <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={message.includes('successfully') ? 'success' : 'error'} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}
        </div>
    );
};

export default OrderStatusManager;

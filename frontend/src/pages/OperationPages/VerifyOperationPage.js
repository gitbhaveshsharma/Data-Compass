import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchOrderDataById,
    updateOrderStatus,
    deleteProductFromOrder,
    updateOrder,
    updateData,
    cancelData
} from '../../redux/operationActions';
import {
    fetchProducts
} from '../../redux/productActions';
import {
    Card, CardContent, Typography, Divider, List, ListItem, ListItemText,
    CircularProgress, Box, Button, IconButton, Grid, TextField, Alert, Snackbar, MenuItem, Select, FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import UpdateBillComponent from '../../components/UpdateBillComponent'; // Import the UpdateBillComponent
import CallAttemptComponent from '../../components/CallAttemptComponent';
import Chip from '@mui/material/Chip';
import AlarmModal from '../../components/AlarmComponent';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AssignedTo from '../../components/AssignedTo';
import Header from '../../components/Header';
import dayjs from 'dayjs'

const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

const VerifyOperationPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const order = useSelector((state) => state.operation.ordersData);
    const products = useSelector((state) => state.products.products);
    const user = useSelector((state) => state.auth.user);
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(dayjs());
    const userDepartment = user ? user.department : '';
    

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [countdown, setCountdown] = useState(5);
    const [alarmModalOpen, setAlarmModalOpen] = useState(false);
    const [alarmSet, setAlarmSet] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        name: '',
        number: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        nearBy: '',
        area: '',
        altNumber: '',
        status: '',
        products: [],
        billDetails: {
            discountType: '',
            discountValue: 0,
            gstPercentage: 0,
            totalPrice: 0
        },
        expectedDeliveryDate: ''
    });

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        if (!['verify', 'admin', 'rto', 'rework'].includes(userDepartment)) {
            setMessage("You don't have access");
            setMessageType('error');
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            setTimeout(() => {
                clearInterval(timer);
                navigate(-1); // Navigate to the previous page
            }, 5000);
            return () => clearInterval(timer);
        } else if (id) {
            dispatch(fetchOrderDataById(id));
            dispatch(fetchProducts());
        } else {
            // console.error('Order ID is undefined');
        }
    }, [dispatch, id, userDepartment, navigate]);

    useEffect(() => {
        if (order && order._id === id) {
            setOrderDetails({
                name: order.name,
                number: order.number,
                address: order.address,
                city: order.city,
                state: order.state,
                zip: order.zip,
                nearBy: order.nearBy,
                area: order.area,
                altNumber: order.altNumber,
                status: order.status,
                products: order.products,
                employeeId: order.employeeId,
                customerId: order.customerId,
                orderId: order.orderId,
                billDetails: {
                    discountType: order.billDetails[0].discountType,
                    discountValue: order.billDetails[0].discountValue,
                    gstPercentage: order.billDetails[0].gstPercentage,
                    totalPrice: order.billDetails[0].totalPrice,
                    paymentMethod: order.billDetails[0].paymentMethod,
                    transactionId: order.billDetails[0].transactionId
                },
                expectedDeliveryDate: order.expectedDeliveryDate
            });
        }
    }, [order, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('billDetails.')) {
            setOrderDetails({
                ...orderDetails,
                billDetails: {
                    ...orderDetails.billDetails,
                    [name.substring('billDetails.'.length)]: value
                }
            });
        } else {
            setOrderDetails({
                ...orderDetails,
                [name]: value
            });
        }
    };

    const handleUpdateStatus = (status) => {
        dispatch(updateOrderStatus(id, status))
            .then(() => {
                setMessage(`Order status updated to ${status} successfully.`);
                setMessageType(status === 'canceled' ? 'error' : 'success');
                if (status === 'canceled') {
                handleCancel();
            }
                navigate('/');
            })
            .catch((error) => {
                setMessage(`Failed to update order status: ${error.message}`);
                setMessageType('error');
            });
    };

    const handleDeleteProduct = (productId) => {
        // console.log(`Product ID: ${productId}`);
        dispatch(deleteProductFromOrder(id, productId))
            .then(() => {
                setMessage('Product deleted successfully.');
                setMessageType('success');
            })
            .catch((error) => {
                setMessage(`Failed to delete product: ${error.message}`);
                setMessageType('error');
            });
    };
    
    const handleUpdateOrder = () => {
        dispatch(updateOrder(id, orderDetails))
            .then(() => {
                setMessage('Order updated successfully.');
                setMessageType('success');
            })
            .catch((error) => {
                setMessage(`Failed to update order: ${error.message}`);
                setMessageType('error');
            });
    };

    const handleAddProduct = () => {
        const product = products.find(p => p.name === selectedProduct);
        if (product) {
            setOrderDetails(prevDetails => ({
                ...prevDetails,
                products: [...prevDetails.products, { productName: product.name, quantity: parseInt(quantity, 10), price: product.price }]
            }));
            setSelectedProduct('');
            setQuantity('');
            // console.log('Product added:', { productName: product.name, quantity, price: product.price });
        }
    };

    const handleClose = () => {
        setMessage('');
        setMessageType('');
    };

    const handleBillingUpdate = (updatedBillDetails) => {
        setOrderDetails((prevDetails) => ({
            ...prevDetails,
            billDetails: updatedBillDetails
        }));
    };
    const handleOpenAlarmModal = () => {
        setAlarmModalOpen(true);
    };

    const handleCloseAlarmModal = () => {
        setAlarmModalOpen(false);
    };
    const handleAlarmSet = () => {
        setAlarmSet(true); // Set the alarmSet state to true when the alarm is set
    };

    const handleCallbackClick = () => {
        if (!alarmSet) {
            setMessage('Please set the alarm first.');
            setMessageType('error');
            return;
        }
        handleUpdateStatus('callback');
    };

    const handleCancel = async () => {
        try {
            const department = 'verify'; // or 'verify', 'logistics', etc. Set the appropriate department here
            await dispatch(cancelData(id, department)); // Pass the department
            setMessage('Order canceled successfully!');
            navigate('/');
        } catch (error) {
            setMessage('Failed to cancel order.');
        }
    };

    const handleAssignTo = async (employeeInfo) => {
        if (userDepartment !== employeeInfo.department) {
            setMessage('Department mismatch. Cannot assign.');
            setMessageType('error');
            return;
        }

        const updatedFormData = {
            ...orderDetails,
            assignedTo: employeeInfo._id,
        };
        try {
            if (userDepartment === 'flead') {
                await dispatch(updateData(id, updatedFormData));
            } else if (userDepartment === 'verify') {
                await dispatch(updateOrder(id, updatedFormData));
            } else {
                setMessage('Invalid department.');
                setMessageType('error');
                return;
            }
            setMessage('Assigned successfully!');
            setMessageType('success');
            navigate('/');
        } catch (error) {
            setMessage('Failed to assign.');
            setMessageType('error');
        }
    };

    if (!['verify', 'rto', 'rework'].includes(userDepartment)) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Box textAlign="center">
                    <BlockIcon color="error" style={{ fontSize: 80 }} />
                    <Typography variant="h4">You don't have access</Typography>
                    <Typography variant="h6">Redirecting in {countdown} seconds...</Typography>
                </Box>
            </Box>
        );
    }

    if (!order || order._id !== id) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
                <Typography variant="h6" component="div">
                    Order Details loading...
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Header title="Verification Page" />
            {message && (
                <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={messageType} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}

            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" padding="10px">
                <Grid container spacing={2} maxWidth="false">
                    <Grid item xs={12} sm={5} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Order Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Name"
                                            name="name"
                                            value={orderDetails.name}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Number"
                                            name="number"
                                            value={orderDetails.number}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="City"
                                            name="city"
                                            value={orderDetails.city}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="State"
                                            name="state"
                                            value={orderDetails.state}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="ZIP"
                                            name="zip"
                                            value={orderDetails.zip}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Near By"
                                            name="nearBy"
                                            value={orderDetails.nearBy}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Area"
                                            name="area"
                                            value={orderDetails.area}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Alt Number"
                                            name="altNumber"
                                            value={orderDetails.altNumber}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Address"
                                    name="address"
                                    value={orderDetails.address}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sx={{marginTop:'16px'}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Expected Delivery Date"
                                                value={expectedDeliveryDate}
                                                onChange={(newValue) => {
                                                    setExpectedDeliveryDate(newValue);
                                                    setOrderDetails(prevDetails => ({
                                                        ...prevDetails,
                                                        expectedDeliveryDate: newValue.format('YYYY-MM-DD')
                                                    }));
                                                }}
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label="Status"
                                            name="status"
                                            value={orderDetails.status}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Button variant="contained" color="success" onClick={handleUpdateOrder} sx={{ mt: 2 }}>
                                        Update Order
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleUpdateStatus('hold')} sx={{ mt: 2 }}>
                                        Order On Hold
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={7} md={5}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Products
                                </Typography>
                                <List>
                                    {orderDetails.products.map((product, index) => (
                                        <ListItem key={index} disableGutters>
                                            <ListItemText
                                                primary={`${product.productName} (x${product.quantity})`}
                                                secondary={`Price: ₹${product.price} x ${product.quantity} = ₹${product.price * product.quantity}`}
                                            />

                                            <IconButton onClick={() => handleDeleteProduct(product._id)} aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                                <FormControl fullWidth margin="normal">
                                    <Typography variant="h6" component="div">
                                        Add Product
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={7}>
                                            <Select
                                                value={selectedProduct}
                                                onChange={(e) => setSelectedProduct(e.target.value)}
                                                displayEmpty
                                                fullWidth
                                                variant="outlined"
                                            >
                                                <MenuItem value="" disabled>Select a product</MenuItem>
                                                {products.map((product) => (
                                                    <MenuItem key={product.id} value={product.name}>
                                                        {product.name} - ₹{product.price}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Quantity"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button variant="contained" color="primary" onClick={handleAddProduct} fullWidth>
                                                Add Product
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                        <IconButton
                                            color="primary"
                                            onClick={handleOpenAlarmModal}
                                        >
                                            <AddAlarmIcon />
                                        </IconButton>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleCallbackClick}
                                            disabled={!alarmSet}
                                        >
                                            Callback
                                        </Button>
                                        {userDepartment === 'verify' && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleUpdateStatus('verified')}
                                                >
                                                    Verify Order
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleUpdateStatus('canceled')}
                                                >
                                                    Cancel Order
                                                </Button>
                                            </>
                                        )}

                                        {userDepartment === 'rto' && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleUpdateStatus('re-deleivery')}
                                                >
                                                    Redelivery
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleUpdateStatus('return-canceled')}
                                                >
                                                    Return Canceled
                                                </Button>
                                            </>
                                        )}

                                        {userDepartment === 'rework' && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleUpdateStatus('rework-completed')}
                                                >
                                                    Rework Completed
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleUpdateStatus('rework-failed')}
                                                >
                                                    Rework Failed
                                                </Button>
                                            </>
                                        )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Root>
                            <Card >
                                <CardContent >
                                    <Typography variant="h6" component="div">
                                        Bill Details
                                    </Typography>
                                    <Typography variant="body1">
                                        Discount Type: {orderDetails.billDetails.discountType}
                                    </Typography>
                                    <Typography variant="body1">
                                        Discount Value:  {orderDetails.billDetails.discountValue.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body1">
                                        GST Percentage: {orderDetails.billDetails.gstPercentage}
                                    </Typography>
                                    <Typography variant="body1">
                                        Payment Method: {orderDetails.billDetails.paymentMethod}
                                    </Typography>
                                    <Typography variant="body1">
                                        Transaction Id: {orderDetails.billDetails.transactionId || 'NA'}
                                    </Typography>
                                    <Typography variant="body1">
                                        Total Price: ₹ {orderDetails.billDetails.totalPrice}
                                    </Typography>
                                    <Divider>
                                        <Chip label="Update Bill Details" size="large" />
                                    </Divider>
                                    <UpdateBillComponent
                                        billDetails={orderDetails.billDetails}
                                        products={orderDetails.products}
                                        onUpdateBilling={handleBillingUpdate}
                                    />
                                </CardContent>
                            </Card>
                        </Root>
                    </Grid>
                </Grid>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" padding="10px">
                <Grid container spacing={2} maxWidth="false">
                    <Grid item xs={12} md={3}>
                        <AssignedTo onAssign={handleAssignTo} />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <CallAttemptComponent department={userDepartment} dataId={id} mobileNumber={orderDetails.number} />
                    </Grid>
                </Grid>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AlarmModal
                    open={alarmModalOpen}
                    handleClose={handleCloseAlarmModal}
                    initialNumber={orderDetails.number}
                    initialName={orderDetails.name}
                    onAlarmSet={handleAlarmSet}
                    initialDataId={orderDetails.customerId}
                    initialDepartment={userDepartment}
                    initialEmployeeId={orderDetails.employeeId}
                />
            </LocalizationProvider>
        </>
    );
};

export default VerifyOperationPage;

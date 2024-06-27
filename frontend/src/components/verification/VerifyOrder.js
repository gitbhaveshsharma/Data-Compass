import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchOrderDataById,
    updateOrderStatus,
    deleteProductFromOrder,
    updateOrder
} from '../../redux/operationActions';
import {
    fetchProducts
} from '../../redux/productActions';
import {
    Card, CardContent, Typography, List, ListItem, ListItemText,
    CircularProgress, Box, Button, IconButton, Grid, TextField, Alert, Snackbar, MenuItem, Select, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';

const OrderCard = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const order = useSelector((state) => state.operation.ordersData);
    const products = useSelector((state) => state.products.products);
    const user = useSelector((state) => state.auth.user);
    const userDepartment = user ? user.department : '';

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [countdown, setCountdown] = useState(5);

    const [orderDetails, setOrderDetails] = useState({
        name: '',
        number: '',
        address: '',
        status: '',
        products: []
    });

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        if (!['Verify', 'admin'].includes(userDepartment)) {
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
            console.error('Order ID is undefined');
        }
    }, [dispatch, id, userDepartment, navigate]);

    useEffect(() => {
        if (order && order._id === id) {
            setOrderDetails({
                name: order.name,
                number: order.number,
                address: order.address,
                status: order.status,
                products: order.products
            });
        }
    }, [order, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({
            ...orderDetails,
            [name]: value
        });
    };

    const handleUpdateStatus = (status) => {
        dispatch(updateOrderStatus(id, status))
            .then(() => {
                setMessage(`Order status updated to ${status} successfully.`);
                setMessageType(status === 'canceled' ? 'error' : 'success');
            })
            .catch((error) => {
                setMessage(`Failed to update order status: ${error.message}`);
                setMessageType('error');
            });
    };

    const handleDeleteProduct = (productId) => {
        console.log(`Product ID: ${productId}`);
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
            console.log('Product added:', { productName: product.name, quantity, price: product.price });
        }
    };

    const handleClose = () => {
        setMessage('');
        setMessageType('');
    };

    if (!['Verify', 'admin'].includes(userDepartment)) {
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
            {message && (
                <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={messageType} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}
            
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                
                <Grid container spacing={2} maxWidth="md">
                    <Grid item xs={12} sm={5} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Order Details
                                </Typography>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Name"
                                    name="name"
                                    value={orderDetails.name}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Number"
                                    name="number"
                                    value={orderDetails.number}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Address"
                                    name="address"
                                    value={orderDetails.address}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Status"
                                    name="status"
                                    value={orderDetails.status}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                                <Button variant="contained" color="success" onClick={handleUpdateOrder} sx={{ mt: 2 }}>
                                    Update Order
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={7} md={8}>
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
                                                secondary={`Price: $${product.price}`}
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
                                                        {product.name} - ${product.price}
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
                                    <Button variant="contained" color="secondary" onClick={() => handleUpdateStatus('callback')}>
                                        Callback
                                    </Button>
                                    <Button variant="contained" color="success" onClick={() => handleUpdateStatus('verified')}>
                                        Verify Order
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleUpdateStatus('canceled')}>
                                        Cancel Order
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default OrderCard;

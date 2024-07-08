import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataById, updateData, orderData, cancelData, callbackData } from '../redux/operationActions';
import { fetchProducts } from '../redux/productActions';
import { Grid, Typography, Card, CardContent, TextField, List, ListItem, ListItemText, Button, Snackbar, Alert, Box, MenuItem, Select, CircularProgress, IconButton } from '@mui/material';
import { FormControl } from '@mui/base/FormControl';
import BillComponent from './BillComponent';
import CallAttemptComponent from './CallAttemptComponent';
import DeleteIcon from '@mui/icons-material/Delete';

const OperationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.operation.data);
    const products = useSelector(state => state.products.products);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        nearBy: '',
        area: '',
        altNumber: ''
    });
    const [message, setMessage] = useState('');
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [billingDetails, setBillingDetails] = useState({});

    useEffect(() => {
        dispatch(fetchDataById(id));
        dispatch(fetchProducts());
    }, [dispatch, id]);

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                number: data.number || '',
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                zip: data.zip || '',
                nearBy: data.nearBy || '',
                area: data.area || '',
                altNumber: data.altNumber || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            console.log(`Updating data with ID: ${id}, Data:`, formData);
            await dispatch(updateData(id, formData));
            setMessage('Data updated successfully!');
        } catch (error) {
            console.error('Update failed:', error);
            setMessage('Failed to update data.');
        }
    };

    const handleOrder = async () => {
        try {
            const orderDetails = { ...formData, products: productsInOrder, status: 'pending', billDetails: billingDetails };
            console.log(`Placing order with ID: ${id}, Order Details:`, orderDetails);
            await dispatch(orderData(id, orderDetails));
            setMessage('Order placed successfully!');
            navigate('/');
        } catch (error) {
            console.error('Order failed:', error);
            setMessage('Failed to place order.');
        }
    };

    const handleCancel = async () => {
        try {
            console.log(`Cancelling order with ID: ${id}`);
            await dispatch(cancelData(id));
            setMessage('Order canceled successfully!');
            navigate('/');
        } catch (error) {
            console.error('Cancel failed:', error);
            setMessage('Failed to cancel order.');
        }
    };

    const handleCallback = async () => {
        try {
            console.log(`Requesting callback with ID: ${id}`);
            await dispatch(callbackData(id));
            setMessage('Callback request sent successfully!');
            navigate('/');
        } catch (error) {
            console.error('Callback request failed:', error);
            setMessage('Failed to send callback request.');
        }
    };

    const handleAddProduct = () => {
        const product = products.find(p => p.name === selectedProduct);
        if (product) {
            setProductsInOrder([...productsInOrder, { productName: product.name, quantity: parseInt(quantity, 10), price: product.price }]);
            setSelectedProduct('');
            setQuantity('');
            console.log('Product added:', { productName: product.name, quantity, price: product.price });
        }
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...productsInOrder];
        updatedProducts.splice(index, 1);
        setProductsInOrder(updatedProducts);
    };

    const handleBillDetailsChange = (details) => {
        setBillingDetails(details);
    };

    const handleClose = () => {
        setMessage('');
    };

    if (!data || data._id !== id) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
            <Typography variant="h5" component="div">
                Customer Details loading...
            </Typography>
        </Box>
    );

    return (
        <>
            {message && (
                <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={message.includes('successfully') ? 'success' : 'error'} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" padding="10px">
                <Grid container spacing={2} maxWidth="false">

                    <Grid item xs={12} sm={5} md={5}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    Customer Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Number"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="State"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="ZIP"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Near By"
                                            name="nearBy"
                                            value={formData.nearBy}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Alt Number"
                                            name="altNumber"
                                            value={formData.altNumber}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} marginTop={2}>
                                    <Grid item xs={6} sm={3}>
                                        <Button variant="contained" color="primary" onClick={handleUpdate} fullWidth>Update</Button>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Button variant="contained" color="success" onClick={handleOrder} fullWidth>Order</Button>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Button variant="contained" color="error" onClick={handleCancel} fullWidth>Cancel</Button>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Button variant="contained" color="secondary" onClick={handleCallback} fullWidth>Callback</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={7} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Products
                                </Typography>
                                <List>
                                    {productsInOrder.map((product, index) => (
                                        <ListItem key={index} disableGutters>
                                            <ListItemText
                                                primary={`${product.productName} (x${product.quantity})`}
                                                secondary={`Price: ₹${product.price} x ${product.quantity} = ₹${(product.price * product.quantity).toFixed(2)}`}
                                            />
                                            <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                                <FormControl required fullWidth>
                                    <Grid container spacing={2} alignItems="center" sx={{ marginTop: '2px' }}>
                                        <Grid item xs={12} sm={6}>
                                            <Select
                                                value={selectedProduct}
                                                onChange={(e) => setSelectedProduct(e.target.value)}
                                                displayEmpty
                                                fullWidth
                                                variant="outlined"
                                                sx={{ minWidth: '150px' }}
                                            >
                                                <MenuItem value="" disabled>Select a product</MenuItem>
                                                {products.map((product) => (
                                                    <MenuItem key={product.id} value={product.name}>
                                                        {product.name} - ${product.price}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Quantity"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                placeholder="Enter quantity"
                                                sx={{ minWidth: '150px' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} container justifyContent="center">
                                            <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ width: '150px' }}>
                                                Add Product
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </FormControl>                                
                                <Grid item xs={12} md={3}>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={7} md={3}>
                        <BillComponent products={productsInOrder} onUpdateBilling={handleBillDetailsChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <CallAttemptComponent department={'flead'} dataId={id} mobileNumber={formData.number} />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default OperationPage;

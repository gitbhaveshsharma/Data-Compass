import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataById, updateData, orderData, cancelData, callbackData } from '../redux/operationActions';
import { fetchProducts } from '../redux/productActions';
import { styled } from '@mui/system';
import { Grid, Typography, Card, CardContent, TextField, Button, Snackbar, Alert, Box, MenuItem, Select, CircularProgress, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { FormControl, useFormControlContext } from '@mui/base/FormControl';

const HelperText = styled((props) => {
    const formControlContext = useFormControlContext();
    const [dirty, setDirty] = React.useState(false);

    React.useEffect(() => {
        if (formControlContext?.filled) {
            setDirty(true);
        }
    }, [formControlContext]);

    if (formControlContext === undefined) {
        return null;
    }

    const { required, filled } = formControlContext;
    const showRequiredError = dirty && required && !filled;

    return showRequiredError ? <p {...props}>This field is required.</p> : null;
})`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;

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
    });
    const [message, setMessage] = useState('');
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    useEffect(() => {
        dispatch(fetchDataById(id));
        dispatch(fetchProducts());
    }, [dispatch, id]);

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                number: data.number || '',
                address: data.address || ''
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
            const orderDetails = { ...formData, products: productsInOrder, status: 'pending' };  // Ensure 'pending' status
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
    const handleClose = () => {
        setMessage('')
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...productsInOrder];
        updatedProducts.splice(index, 1);
        setProductsInOrder(updatedProducts);
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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Grid container spacing={2} maxWidth="md">
                    <Grid item xs={12} sm={5} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Customer Details
                                </Typography>
                                <FormControl required fullWidth>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                    <HelperText />
                                </FormControl>
                                <FormControl required fullWidth>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Number"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                    <HelperText />
                                </FormControl>
                                <FormControl required fullWidth>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                    <HelperText />
                                    <Grid container spacing={2}>
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
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={7} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Products
                                </Typography>
                                <FormControl required fullWidth>
                                    <Grid container spacing={2} alignItems="center" sx={{marginTop:'2px'}}>
                                        <Grid item xs={12} sm={12}>
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
                                        <Grid item xs={12} sm={12}>
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
                                {productsInOrder.map((product, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                        <Typography>{product.productName} - {product.quantity} - ${product.price}</Typography>
                                        <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                ))}

                                <Grid item xs={12} md={3}>
                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};


export default OperationPage;

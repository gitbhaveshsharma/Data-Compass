import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataById, updateData, orderData, cancelData, callbackData } from '../redux/operationActions';
import { fetchProducts } from '../redux/productActions';
import { styled } from '@mui/system';
import { Grid, Typography, Button, Alert, MenuItem, Select, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { FormControl, useFormControlContext } from '@mui/base/FormControl';
const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const StyledInput = styled('input')(
    ({ theme }) => `
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    outline: 0;
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }
`,
);

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

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...productsInOrder];
        updatedProducts.splice(index, 1);
        setProductsInOrder(updatedProducts);
    };

    if (!data) return <div>Loading...</div>;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90vh',
            padding: '20px',
        }}>
            <Typography gutterBottom variant="h3" component="div" sx={{
                textAlign: "center",
                marginTop: '20px',
                color: 'primary.main',
                fontWeight: 'bold',
            }}>
                Operation Page
            </Typography>

            <Grid container spacing={2} style={{maxWidth: '100%', width:'500px', margin: 'auto', padding:'25px', borderRadius:'10px'}} sx={{bgcolor:'#f0f0f1'}}>
                {message && (
                    <Grid item xs={12}>
                        <Alert severity={message.includes('successfully') ? 'success' : 'error'}>{message}</Alert>
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <FormControl required fullWidth>
                        <label>Name:</label>
                        <StyledInput
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Write your name here"
                        />
                        <HelperText />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl required fullWidth>
                        <label>Number:</label>
                        <StyledInput
                            type="text"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            placeholder="Write your number here"
                        />
                        <HelperText />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                    <FormControl required fullWidth>
                        <label>Address:</label>
                        <StyledInput
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Write your address here"
                        />
                        <HelperText />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={7} >
                    <FormControl required fullWidth>
                        <label>Product:</label>
                        <Select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            displayEmpty
                            sx={{height:'39px', width:'245px'}}
                        >
                            <MenuItem value="" disabled >Select a product</MenuItem>
                            {products.map((product) => (
                                <MenuItem key={product.id} value={product.name} sx={{height:'39px', fontSize:'15px'}}>
                                    {product.name} - ${product.price}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                    <FormControl required fullWidth>
                        <label>Quantity:</label>
                        <StyledInput
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} >
                <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button variant="contained" sx={{width:'150px'}} color="primary" onClick={handleAddProduct} fullWidth>
                        Add Product
                    </Button>
                </div>
                </Grid>
                <Grid item xs={12}>
                    {productsInOrder.map((product, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <Typography>{product.productName} - {product.quantity} - ${product.price}</Typography>
                            <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    ))}
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button variant="contained" color="primary" onClick={handleUpdate} fullWidth>Update</Button>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button variant="contained" color="success" onClick={handleOrder} fullWidth>Order</Button>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button variant="contained" color="error" onClick={handleCancel} fullWidth>Cancel</Button>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button variant="contained" color="secondary" onClick={handleCallback} fullWidth>Callback</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default OperationPage;

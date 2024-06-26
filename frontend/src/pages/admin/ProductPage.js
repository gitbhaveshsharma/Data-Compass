// src/pages/ProductPage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, addProduct, removeProduct, updateProductStatus } from '../../redux/productActions';
import { Container, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';


const ProductPage = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);
    const [productName, setProductName] = useState('');
    const [productTag, setProductTag] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [message, setMessage] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAddProduct = () => {
        const product = {
            name: productName,
            tag: productTag,
            price: productPrice,
            quantity: productQuantity,
        };
        dispatch(addProduct(product))
            .then(() => {
                setMessage('Product added successfully!');
                setStatus('success');
            })
            .catch(() => {
                setMessage('Failed to add product.');
                setStatus('error');
            });
        setProductName('');
        setProductTag('');
        setProductPrice('');
        setProductQuantity('');
    };

    const handleRemoveProduct = (id) => {
        dispatch(removeProduct(id))
            .then(() => {
                setMessage('Product removed successfully!');
                setStatus('success');
            })
            .catch(() => {
                setMessage('Failed to remove product.');
                setStatus('error');
            });
    };

    const handleUpdateStatus = (id, status) => {
        dispatch(updateProductStatus(id, status))
            .then(() => {
                setMessage('Product status updated successfully!');
                setStatus('success');
            })
            .catch(() => {
                setMessage('Failed to update product status.');
                setStatus('error');
            });
    };

    const handleCloseSnackbar = () => {
        setMessage(null);
        setStatus('');
    };

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Tag</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.tag}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>{product.status}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleRemoveProduct(product._id)} color="secondary">Remove</Button>
                                            <Button 
                                                onClick={() => handleUpdateStatus(product._id, product.status === 'available' ? 'out of stock' : 'available')}
                                                sx={{ backgroundColor: product.status === 'out of stock' ? 'red' : 'primary' }}
                                            >
                                                {product.status === 'available' ? 'Set Out of Stock' : 'Set Available'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField label="Name" value={productName} onChange={(e) => setProductName(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Tag" value={productTag} onChange={(e) => setProductTag(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Quantity" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} fullWidth margin="normal" />
                    <Button onClick={handleAddProduct} variant="contained" color="primary" fullWidth>Add Product</Button>
                </Grid>
            </Grid>
            <Snackbar open={!!message} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={status}>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductPage;

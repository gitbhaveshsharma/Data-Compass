import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, addProduct, removeProduct, updateProductStatus } from '../../redux/productActions';
import { Container, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ProductPage = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);
    const [productName, setProductName] = useState('');
    const [productTag, setProductTag] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [message, setMessage] = useState(null);
    const [status, setStatus] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [productToRemove, setProductToRemove] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAddProduct = () => {
        if (productPrice <= 0 || productQuantity <= 0) {
            setMessage('Price and Quantity must be greater than zero.');
            setStatus('error');
            return;
        }

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
        setProductToRemove(id);
        setDialogOpen(true);
    };

    const handleConfirmRemove = () => {
        dispatch(removeProduct(productToRemove))
            .then(() => {
                setMessage('Product removed successfully!');
                setStatus('success');
            })
            .catch(() => {
                setMessage('Failed to remove product.');
                setStatus('error');
            })
            .finally(() => {
                setDialogOpen(false);
                setProductToRemove(null);
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
        <Container maxWidth="lg">
            <Box sx={{ flexGrow: 1, py: 0 }}>
                <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }} gutterBottom>
                    Product Management
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <TableContainer>
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
                                                        sx={{ ml: 1, backgroundColor: product.status === 'out of stock' ? 'red' : 'primary', color: 'white' }}
                                                        variant="contained"
                                                    >
                                                        {product.status === 'available' ? 'Set Out of Stock' : 'Set Available'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <TextField
                                label="Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Tag"
                                value={productTag}
                                onChange={(e) => setProductTag(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Price"
                                type="number"
                                value={productPrice}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value)); // Prevent negative numbers
                                    setProductPrice(value);
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Quantity"
                                type="number"
                                value={productQuantity}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value));
                                    setProductQuantity(value);
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                onClick={handleAddProduct}
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Add Product
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar open={!!message} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={status}>
                    {message}
                </Alert>
            </Snackbar>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this product?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmRemove} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductPage;

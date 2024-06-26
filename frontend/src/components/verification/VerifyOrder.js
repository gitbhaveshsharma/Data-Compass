import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDataById } from '../../redux/operationActions';
import {
    Card, CardContent, Typography, List, ListItem, ListItemText,
    CircularProgress, Box
} from '@mui/material';

const OrderCard = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const order = useSelector((state) => state.operation.ordersData);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderDataById(id));
        } else {
            console.error('Order ID is undefined');
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (order) {
            console.log('Order:', order); // Logging the order data
        }
    }, [order]);

    if (!order || order._id !== id) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Order Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Name:</strong> {order.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Number:</strong> {order.number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Address:</strong> {order.address}
                </Typography>
                <Typography variant="h6" component="div" mt={2}>
                    Products
                </Typography>
                <List>
                    {order.products.map((product, index) => (
                        <ListItem key={index} disableGutters>
                            <ListItemText
                                primary={`${product.productName} (x${product.quantity})`}
                                secondary={`Price: $${product.price}`}
                            />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="body2" color="text.secondary">
                    <strong>Status:</strong> {order.status}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default OrderCard;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../redux/dataActions';
import { Grid, Paper, TextField, Button, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import VerifiedIcon from '@mui/icons-material/CheckCircle';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import DeliveredIcon from '@mui/icons-material/Home';
import CallbackIcon from '@mui/icons-material/PhoneCallback';
import CanceledIcon from '@mui/icons-material/Cancel';

const statusIcons = {
    pending: <PendingIcon />,
    'under verification': <PendingIcon />,
    verified: <VerifiedIcon />,
    shipping: <ShippingIcon />,
    delivered: <DeliveredIcon />,
    callback: <CallbackIcon />,
    canceled: <CanceledIcon />,
};

const CheckOrderStatus = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data || []);
    const [customerId, setCustomerId] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        dispatch(fetchOrderData(employeeId, role));
    }, [dispatch, employeeId, role]);

    const handleSearch = () => {
        if (!customerId.trim()) {
            setError('Customer ID cannot be empty');
            setFilteredOrders([]);
            return;
        }

        const filtered = orderData.filter(order => order.customerId === customerId);
        if (filtered.length === 0) {
            setError('No orders found for the given Customer ID.');
        } else {
            setError('');
        }
        setFilteredOrders(filtered);
    };

    return (
        <div>
            <TextField
                label="Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                fullWidth
                error={Boolean(error)}
                helperText={error}
            />
            <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mt: 2 }}>
                Search
            </Button>
            {filteredOrders.length > 0 ? (
                <List>
                    {filteredOrders.map((order) => (
                        <ListItem key={order.orderId}>
                            <ListItemIcon>{statusIcons[order.status]}</ListItemIcon>
                            <ListItemText
                                primary={`Order ID: ${order.orderId}`}
                                secondary={`Status: ${order.status}`}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                !error && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        No orders found for the given Customer ID.
                    </Typography>
                )
            )}
        </div>
    );
};

export default CheckOrderStatus;

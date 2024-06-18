import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDataByEmployeeId } from '../redux/dataActions';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';

const OrderData = ({ employeeId }) => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data); 
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchOrderDataByEmployeeId(employeeId));
        }
    }, [dispatch, employeeId]);

    useEffect(() => {
        console.log("Order Data:", orderData);
    }, [orderData]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ flex: '1 0 21%', border: '1px solid #ccc', padding: '20px' }}>
            <h3>Order Data</h3>
            <p>Data Count: {Array.isArray(orderData) ? orderData.length : 0}</p>
            <Button variant="outlined" onClick={handleOpen}>
                View Order Data
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Order Data</DialogTitle>
                <DialogContent>
                    <List>
                        {Array.isArray(orderData) && orderData.map((data) => (
                            <ListItem key={data._id} button>
                                <ListItemText primary={data.name} />
                                <a href={`/data/${data._id}`}>Open</a>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OrderData;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCallbackDataByEmployeeId } from '../redux/dataActions';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';

const CallbackData = ({ employeeId }) => {
    const dispatch = useDispatch();
    const callbackData = useSelector((state) => state.data.callbackData.data); // Ensure accessing the correct state slice
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchCallbackDataByEmployeeId(employeeId));
        }
    }, [dispatch, employeeId]);

    useEffect(() => {
        console.log("Callback Data:", callbackData);
    }, [callbackData]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ flex: '1 0 21%', border: '1px solid #ccc', padding: '20px' }}>
            <h3>Call back Data</h3>
            <p>Data Count: {Array.isArray(callbackData) ? callbackData.length : 0}</p>
            <Button variant="outlined" onClick={handleOpen}>
                View Call back Data
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Call back Data</DialogTitle>
                <DialogContent>
                    <List>
                        {Array.isArray(callbackData) && callbackData.map((data) => (
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

export default CallbackData;

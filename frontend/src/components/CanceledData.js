import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCanceledDataByEmployeeId } from '../redux/dataActions';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';

const CanceledData = ({ employeeId }) => {
    const dispatch = useDispatch();
    const canceledData = useSelector((state) => state.data.canceledData.data); // Ensure accessing the correct state slice
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchCanceledDataByEmployeeId(employeeId));
        }
    }, [dispatch, employeeId]);

    useEffect(() => {
        console.log("Canceled Data:", canceledData);
    }, [canceledData]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ flex: '1 0 21%', border: '1px solid #ccc', padding: '20px' }}>
            <h3>Canceled Data</h3>
            <p>Data Count: {Array.isArray(canceledData) ? canceledData.length : 0}</p>
            <Button variant="outlined" onClick={handleOpen}>
                View Canceled Data
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Canceled Data</DialogTitle>
                <DialogContent>
                    <List>
                        {Array.isArray(canceledData) && canceledData.map((data) => (
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

export default CanceledData;

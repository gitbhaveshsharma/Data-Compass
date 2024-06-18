import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedData } from '../redux/dataActions';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';

const FreshLeadCard = ({ employeeId }) => {
    const dispatch = useDispatch();
    const assignedData = useSelector((state) => state.data.assignedData.assignedData || []); 
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchAssignedData(employeeId));
        }
    }, [dispatch, employeeId]);

    useEffect(() => {
        console.log("Assigned Data:", assignedData);
    }, [assignedData]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ flex: '1 0 21%', border: '1px solid #ccc', padding: '20px' }}>
            <h3>Frace Lead</h3>
            <p>Assigned Data: {Array.isArray(assignedData) ? assignedData.length : 0}</p>
            <Button variant="outlined" onClick={handleOpen}>
                View Assigned Data
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Assigned Data</DialogTitle>
                <DialogContent>
                    <List>
                        {Array.isArray(assignedData) && assignedData.map((data) => (
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

export default FreshLeadCard;

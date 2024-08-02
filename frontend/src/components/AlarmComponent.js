import React, { useState, useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { createAlarm } from '../redux/alarmActions';
import { Modal, TextField, Button, Typography, Grid, Snackbar } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers'; // Use MobileDateTimePicker instead of MobileTimePicker
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const AlarmModal = ({ open, handleClose, initialNumber, initialDataId, initialName, initialDepartment, initialEmployeeId, onAlarmSet }) => {
    const dispatch = useDispatch();
    const [number, setNumber] = useState('');
    const [dataId, setDataId] = useState('');
    const [department, setDepartment] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [alarmTime, setAlarmTime] = useState(dayjs());
    const [comment, setComment] = useState(''); // New state for comment
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        setNumber(initialNumber);
        setDataId(initialDataId);
        setDepartment(initialDepartment);
        setEmployeeId(initialEmployeeId);
        setCustomerName(initialName);
    }, [initialNumber, initialDataId, initialDepartment, initialEmployeeId, initialName]);

    const handleSubmit = () => {
        const localAlarmTime = dayjs(alarmTime);
        const utcAlarmTime = localAlarmTime.utc();
        const alarmData = { number, dataId, department, employeeId, customerName, alarmTime: utcAlarmTime.toDate(), comment };
        dispatch(createAlarm(alarmData));
        setSnackbarOpen(true);
        handleClose();
        onAlarmSet(); // Call the onAlarmSet callback after setting the alarm
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div style={{ padding: 20, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '50%' }}>
                <Typography variant="h6" gutterBottom>Set Alarm</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            fullWidth
                            margin="normal"
                            disabled  
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Customer Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            fullWidth
                            margin="normal"
                            disabled  
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Data ID"
                            value={dataId}
                            onChange={(e) => setDataId(e.target.value)}
                            fullWidth
                            margin="normal"
                            disabled  
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Employee ID"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            fullWidth
                            margin="normal"
                            disabled  
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Comment" 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{marginTop:'15px'}}>
                        <MobileDateTimePicker
                            label="Alarm Date and Time" 
                            value={alarmTime}
                            onChange={(newValue) => setAlarmTime(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button variant="contained" color="primary" onClick={handleSubmit} style={{ width: 'fit-content', marginTop: '16px' }}>
                            Set Alarm
                        </Button>
                    </Grid>
                </Grid>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    message="Alarm set successfully!"
                />
            </div>
        </Modal>
    );
};

export default AlarmModal;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAlarm } from '../redux/alarmActions';
import { Modal, TextField, Button, Typography, Grid, Snackbar } from '@mui/material';
import { MobileTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { LocalizationProvider } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

const AlarmModal = ({ open, handleClose, initialNumber, initialDataId, initialDepartment, initialEmployeeId, onAlarmSet }) => {
    const dispatch = useDispatch();
    const [number, setNumber] = useState('');
    const [dataId, setDataId] = useState('');
    const [department, setDepartment] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [alarmTime, setAlarmTime] = useState(dayjs());
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        setNumber(initialNumber);
        setDataId(initialDataId);
        setDepartment(initialDepartment);
        setEmployeeId(initialEmployeeId);
    }, [initialNumber, initialDataId, initialDepartment, initialEmployeeId]);

    const handleSubmit = () => {
        const localAlarmTime = dayjs(alarmTime);
        const utcAlarmTime = localAlarmTime.utc();
        const alarmData = { number, dataId, department, employeeId, alarmTime: utcAlarmTime.toDate() };
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
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Data ID"
                            value={dataId}
                            onChange={(e) => setDataId(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Employee ID"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>

                        <MobileTimePicker
                            label="Alarm Time"
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

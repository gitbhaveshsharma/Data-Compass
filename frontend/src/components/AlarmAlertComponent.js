import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Snackbar, Button, Modal, Box, Typography, Grid, TextField } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { fetchAlarmsByEmployeeId, updateAlarm, deleteAlarm } from '../redux/alarmActions';

dayjs.extend(utc);
dayjs.extend(timezone);

const AlarmAlertComponent = ({ employeeId, department }) => {
    const dispatch = useDispatch();
    const { alarms, loading, error } = useSelector((state) => state.alarms);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [currentAlarm, setCurrentAlarm] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [updatedAlarmData, setUpdatedAlarmData] = useState({
        number: '',
        customerName: '',
        status: '',
        comment: '', // Add comment field
        alarmTime: '' // Add alarmTime field
    });

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchAlarmsByEmployeeId(employeeId));
        }
    }, [dispatch, employeeId]);

    useEffect(() => {
        const checkAlarms = () => {
            if (alarms && alarms.length > 0) {
                const now = dayjs().tz(dayjs.tz.guess());
                alarms.forEach((alarm) => {
                    const alarmTime = dayjs(alarm.alarmTime);
                    const sameMinute = alarmTime.isSame(now, 'minute');
                    if (alarm.department === department && alarm.status === 'active' && sameMinute) {
                        setCurrentAlarm(alarm);
                        setOpenSnackbar(true);
                        setSnackbarMessage(`Call Back on ${alarm.number} (ID: ${alarm.dataId}) at ${alarmTime.format('HH:mm')}`);
                        setSnackbarSeverity('info');
                    } else if (alarm.department === department && alarm.status === 'active' && alarmTime.isBefore(now)) {
                        // If alarm time is missed, set severity to red
                        setCurrentAlarm(alarm);
                        setOpenSnackbar(true);
                        setSnackbarMessage(`Missed alarm for ${alarm.number} (ID: ${alarm.dataId}) at ${alarmTime.format('HH:mm')}`);
                        setSnackbarSeverity('error');
                    }
                });
            }
        };

        const intervalId = setInterval(checkAlarms, 60000); // Check every minute

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [alarms, department]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenModal = (alarm) => {
        setCurrentAlarm(alarm);
        setUpdatedAlarmData({
            number: alarm.number,
            customerName: alarm.customerName || '',
            status: alarm.status,
            comment: alarm.comment || '', // Initialize comment field
            alarmTime: dayjs(alarm.alarmTime).format('YYYY-MM-DDTHH:mm:ss') // Initialize alarmTime field
        });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleUpdateAlarm = () => {
        const updatedData = {
            number: updatedAlarmData.number,
            customerName: updatedAlarmData.customerName,
            status: updatedAlarmData.status,
            comment: updatedAlarmData.comment, // Update comment field
            alarmTime: dayjs(updatedAlarmData.alarmTime).toDate() // Update alarmTime field
        };

        dispatch(updateAlarm(currentAlarm._id, updatedData))
            .then(() => {
                setSnackbarMessage('Alarm updated successfully');
                setSnackbarSeverity('success');
            })
            .catch(() => {
                setSnackbarMessage('Failed to update alarm');
                setSnackbarSeverity('error');
            });
        setModalOpen(false);
        setOpenSnackbar(true);
    };

    const handleDeleteAlarm = (alarmId) => {
        dispatch(deleteAlarm(alarmId))
            .then(() => {
                setSnackbarMessage('Alarm deleted successfully');
                setSnackbarSeverity('success');
            })
            .catch(() => {
                setSnackbarMessage('Failed to delete alarm');
                setSnackbarSeverity('error');
            });
        setModalOpen(false);
        setOpenSnackbar(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedAlarmData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Alarm List</Typography>
            {alarms.length === 0 ? (
                <Typography variant="body1">No Call back Customer</Typography>
            ) : (
                <Grid container spacing={2}>
                    {alarms.map((alarm) => {
                        const now = dayjs().tz(dayjs.tz.guess());
                        const alarmTime = dayjs(alarm.alarmTime);
                        const isPastDue = alarmTime.isBefore(now);
                        const alertSeverity = isPastDue ? 'error' : (alarm.status === 'inactive' ? 'warning' : 'info');

                        return (
                            <Grid item xs={12} key={alarm._id}>
                                <Alert severity={alertSeverity} action={
                                    <>
                                        <Button color="inherit" size="small" onClick={() => handleOpenModal(alarm)}>Manage Alarm</Button>
                                        {/* <Button color="inherit" size="small" onClick={() => handleDeleteAlarm(alarm._id)}>Delete</Button> */}
                                    </>
                                }>
                                    <Box display="flex" alignItems="center">
                                        C_Name: {alarm.customerName}, Number: {alarm.number}, Time: {alarmTime.format('HH:mm')}
                                    </Box>
                                </Alert>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
            {currentAlarm && (
                <Snackbar open={openSnackbar} autoHideDuration={9000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            )}
            {currentAlarm && (
                <Modal open={modalOpen} onClose={handleCloseModal}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Manage Alarm
                        </Typography>
                        <TextField
                            label="Number"
                            name="number"
                            value={updatedAlarmData.number}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Customer Name"
                            name="customerName"
                            value={updatedAlarmData.customerName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Comment"
                            name="comment"
                            value={updatedAlarmData.comment}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Alarm Time"
                            name="alarmTime"
                            type="datetime-local"
                            value={dayjs(updatedAlarmData.alarmTime).format('YYYY-MM-DDTHH:mm')}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleUpdateAlarm} sx={{ mt: 2 }}>
                            Update
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteAlarm(currentAlarm._id)} sx={{ mt: 2, ml: 2 }}>
                            Delete
                        </Button>
                    </Box>
                </Modal>
            )}
        </Box>
    );
};

export default AlarmAlertComponent;

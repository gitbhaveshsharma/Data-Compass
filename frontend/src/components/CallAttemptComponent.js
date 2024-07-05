import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCallAttempts, createCallAttempt, updateCallAttempt, deleteCallAttempt } from '../redux/callAttemptActions';
import { Box, Card, CardContent, Typography, TextField, Button, Select, MenuItem, IconButton, Snackbar, Alert, Grid } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const CallAttemptComponent = ({ dataId, mobileNumber, department }) => {
    const dispatch = useDispatch();
    const callAttempts = useSelector((state) => state.callAttempts.callAttempts || []);
    const [formData, setFormData] = useState({
        attemptsNumber: '',
        callStatus: '',
        callDescription: '',
        departmentLevel: department,
        message: '',
    });
    const [message, setMessage] = useState('');

    const callStatusDescriptions = {
        NOANSWER: 'The call was not answered by the callee (dialled number).',
        ANSWER: 'The call was answered by the callee (dialled number).',
        FLOW_ANSWER: 'An incoming call landed successfully on the Flow.',
        FAILED: 'The call initiation failed.',
        BUSY: 'The callee (dialled number) was busy.',
        REJECTED: 'The call was rejected by the callee (dialled number).',
        NOROUTE: 'No dialling route was available for the ‘TO’ number.',
        BUSY_CHANNEL1: 'The first dialled number was busy when the call was initiated.',
        BUSY_CHANNEL2: 'The first dialled number was answered while the second dialled number was busy.',
        FAILED_CHANNEL1: 'The call initiation failed for the first dialled number.',
        FAILED_CHANNEL2: 'The first dialled number was answered while the call initiation failed for the second dialled number.',
        NOANSWER_CHANNEL1: 'The call was not answered by the first dialled number.',
        NOANSWER_CHANNEL2: 'The first dialled number was answered while the call was not answered by the second dialled number.',
        MAXUSE: 'The call was not initiated as the channel capacity reached its maximum limit.',
        FLOW_UNASSIGNED: 'There was no DID number assigned to the flow which was supposed to be triggered by the outbound call.',
        FLOW_PAUSED: 'The flow triggered by the outbound call is in the Pause state.',
        FLOW_NOT_PUBLISHED: 'The flow triggered by the outbound call was not published.',
        FLOW_UNREACHABLE: 'The flow triggered by the outbound call was not reachable.',
        QUEUE_TIMEOUT: 'The queued calls were not initiated due to queue timeout.',
        OBD_TIMEOUT: 'The outbound call timeout was due to set values in OBD API.',
        CANCEL: 'The call was rejected by the caller.',
        BRIDGE_UNAVAILABLE: 'The Bridge number was inactive when the call was initiated.',
        MISS_CALL: 'Miss call option is enabled for incoming calls.',
        NO_INCOMING_CLI: 'For incoming calls where the operator doesn\'t send a CLI (Caller ID, which is an alias for DID or Bridge Number).',
        INCOMING_DISCONNECTED: 'The incoming call was disconnected.',
        RING_TIMEOUT: 'The incoming call timed out while executing non-telephony widgets.',
        FLOW_EXECUTED: 'Complete execution of flows without telephony widgets.',
        OUTGOING_RESTRICTED: 'The number does not have outgoing call facilities.'
    };

    useEffect(() => {
        if (dataId) {
            dispatch(fetchCallAttempts(dataId));
        }
    }, [dispatch, dataId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'callStatus') {
            setFormData((prevData) => ({
                ...prevData,
                callDescription: callStatusDescriptions[value],
            }));
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddCallAttempt = async () => {
        try {
            await dispatch(createCallAttempt({ ...formData, number: mobileNumber, dataId }));
            setMessage('Call attempt added successfully!');
            setFormData({ attemptsNumber: '', callStatus: '', callDescription: '', departmentLevel: department, message: '' });
        } catch (error) {
            console.error('Add call attempt failed:', error);
            setMessage(error);  // Set the actual error message
        }
    };

    const handleUpdateCallAttempt = async (id) => {
        try {
            await dispatch(updateCallAttempt(id, formData));
            setMessage('Call attempt updated successfully!');
        } catch (error) {
            console.error('Update call attempt failed:', error);
            setMessage('Failed to update call attempt.');
        }
    };

    const handleDeleteCallAttempt = async (id) => {
        try {
            await dispatch(deleteCallAttempt(id));
            setMessage('Call attempt deleted successfully!');
        } catch (error) {
            console.error('Delete call attempt failed:', error);
            setMessage('Failed to delete call attempt.');
        }
    };

    const handleClose = () => {
        setMessage('');
    };

    // Filter attempts by department and sort to get the most recent ones
    const filteredCallAttempts = callAttempts.filter(attempt => attempt.departmentLevel === department);
    const sortedCallAttempts = filteredCallAttempts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    return (
        <>
            {message && (
                <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={message.includes('successfully') ? 'success' : 'error'} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div">
                        Call Attempts
                    </Typography>
                    <Grid container spacing={2}>
                        {/* Left Grid - Displaying Attempt Summary */}
                        <Grid item xs={12} md={5}>
                            {sortedCallAttempts.map((attempt) => (
                                <Box key={attempt._id} display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Typography variant="body1">
                                        {attempt.attemptsNumber} - {attempt.callStatus} - {attempt.callDescription} - {attempt.departmentLevel}
                                    </Typography>
                                    <IconButton color="error" onClick={() => handleDeleteCallAttempt(attempt._id)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Grid>
                        {/* Right Grid - Form Elements */}
                        <Grid item xs={12} md={7}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Select
                                        fullWidth
                                        margin="normal"
                                        name="attemptsNumber"
                                        value={formData.attemptsNumber}
                                        onChange={handleChange}
                                        variant="outlined"
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Attempts</MenuItem>
                                        <MenuItem value="attempt 1">attempt 1</MenuItem>
                                        <MenuItem value="attempt 2">attempt 2</MenuItem>
                                        <MenuItem value="attempt 3">attempt 3</MenuItem>
                                        <MenuItem value="attempt 4">attempt 4</MenuItem>
                                        <MenuItem value="attempt 5">attempt 5</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Select
                                        fullWidth
                                        margin="normal"
                                        name="callStatus"
                                        value={formData.callStatus}
                                        onChange={handleChange}
                                        variant="outlined"
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Call Status</MenuItem>
                                        {Object.keys(callStatusDescriptions).map(status => (
                                            <MenuItem key={status} value={status}>{status}</MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Select
                                        fullWidth
                                        margin="normal"
                                        name="departmentLevel"
                                        value={formData.departmentLevel}
                                        onChange={handleChange}
                                        variant="outlined"
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Department Level</MenuItem>
                                        <MenuItem value="flead">flead</MenuItem>
                                        <MenuItem value="verify">verify</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Call Description"
                                        name="callDescription"
                                        value={formData.callDescription}
                                        onChange={handleChange}
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button variant="contained" color="primary" onClick={handleAddCallAttempt}>
                                        Add Call Attempt
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};

export default CallAttemptComponent;

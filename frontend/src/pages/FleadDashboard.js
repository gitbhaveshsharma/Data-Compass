import React, { useEffect, useState } from 'react';
import FreshLeadCard from '../components/FleadDataCard/FreshLeadCard';
import PendingOrders from '../components/OrderCard/PendingOrders';
import CanceledDataCard from '../components/FleadDataCard/CanceledData';
import CallbackDataCard from '../components/FleadDataCard/CallbackData';
import HoldData from '../components/FleadDataCard/HoldData';
import CheckOrderStatus from '../components/CheckOrderStatus';
import YourOder from '../components/YourOrders'
import AlarmAlertComponent from '../components/AlarmAlertComponent';
import { Grid, Paper, Box, Container, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ChartCard from '../components/ChartCard';
import { fetchAssignedData } from '../redux/dataActions';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { updateEmployee } from '../redux/employeeActions';



const FieldDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const assignedData = useSelector((state) => state.data.assignedData.assignedData || []);
    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.id : '';
    const EmpId = user?.employeeId;
    console.log('a', EmpId)

    // UseEffect for Navigating to Login Page if User is not Authenticated
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(updateEmployee(employeeId, { status: 'online' }))
                .then(() => {
                    setMessage('Status updated to online successfully.');
                })
                .catch(() => {
                    setMessage('Failed to update status.');
                });
        }
    }, [user, navigate, dispatch, employeeId]);

    // UseEffect for Fetching Assigned Data
    useEffect(() => {
        if (employeeId) {
            dispatch(fetchAssignedData(employeeId));
        }
    }, [dispatch, employeeId]);

    // Process Data for Chart Display
    const processChartData = (assignedData) => {
        const groupedData = {};

        const processData = (data, type) => {
            data.forEach(item => {
                const date = dayjs(item.createdAt).startOf('day').format('YYYY-MM-DD');
                if (!groupedData[date]) {
                    groupedData[date] = { orders: 0, canceled: 0, callbacks: 0 };
                }
                groupedData[date][type] += 1;
            });
        };

        processData(assignedData.filter(item => item.status === 'order'), 'orders');
        processData(assignedData.filter(item => item.status === 'callback'), 'callbacks');
        processData(assignedData.filter(item => item.status === 'canceled'), 'canceled');

        const sortedDates = Object.keys(groupedData).sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);
        const chartData = sortedDates.map(date => ({
            date,
            ...groupedData[date]
        }));

        return chartData;
    };

    const chartData = processChartData(assignedData);

    // Handle Snackbar Close
    const handleClose = () => {
        setMessage('');
    };

    return (
        <>
            <Container maxWidth="xl">
                <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6} container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <FreshLeadCard employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <PendingOrders employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <CanceledDataCard employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <CallbackDataCard employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <HoldData employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3} >
                                    <YourOder employeeId={user?.employeeId}/>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 4 }}>
                                <Paper elevation={3}>
                                    <ChartCard data={chartData} />
                                </Paper>
                            </Box>
                            <Box>
                                <Paper elevation={3}>
                                    <AlarmAlertComponent employeeId={user?.employeeId} department={user?.department} />
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {message && (
                    <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={message.includes('successfully') ? 'success' : 'error'} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                )}
            </Container>
        </>
    );
};

export default FieldDashboard;

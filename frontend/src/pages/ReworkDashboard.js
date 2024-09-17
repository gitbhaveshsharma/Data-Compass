import React, { useEffect, useState } from 'react';
import UnderRework from '../components/Rework/UnderRework';
import ReworkCompleted from '../components/Rework/ReworkCompleted';
import ReworkFailed from '../components/Rework/ReworkFailed';
import YourOrder from '../components/YourOrders';
import AlarmAlertComponent from '../components/AlarmAlertComponent';
import { Grid, Paper, Box, Container, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ChartCard from '../components/ChartCard';
import { fetchAssignedData, fetchOrderData } from '../redux/dataActions'; // Updated to import both actions
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { updateEmployee } from '../redux/employeeActions';
import ReworkCallBack from '../components/Rework/ReworkCallBack';
import ReworkHold from '../components/Rework/ReworkHold';

const ReworkDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    // Updated selectors to fetch data for both assigned and order data
    const assignedData = useSelector((state) => state.data.assignedData.data || []);
    const orderData = useSelector((state) => state.data.orderData.data || []);

    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.id : '';

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

    // Updated useEffect to fetch data from both action files
    useEffect(() => {
        if (employeeId) {
            dispatch(fetchAssignedData(employeeId));
            dispatch(fetchOrderData(employeeId, user?.role)); 
        }
    }, [dispatch, employeeId, user?.role]);

    // Process data for chart display with the updated criteria
    const processChartData = (assignedData, orderData) => {
        const combinedData = [...assignedData, ...orderData];
        const groupedData = {};

        // Updated to filter data based on "rework completed" and "rework failed"
        const processData = (data, type) => {
            data.forEach(item => {
                const date = dayjs(item.createdAt).startOf('day').format('YYYY-MM-DD');
                if (!groupedData[date]) {
                    groupedData[date] = { reworkCompleted: 0, reworkFailed: 0 };
                }
                groupedData[date][type] += 1;
            });
        };

        processData(combinedData.filter(item => item.status === 'rework completed'), 'reworkCompleted');
        processData(combinedData.filter(item => item.status === 'rework failed'), 'reworkFailed');

        const sortedDates = Object.keys(groupedData).sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);
        const chartData = sortedDates.map(date => ({
            date,
            ...groupedData[date]
        }));

        return chartData;
    };

    const chartData = processChartData(assignedData, orderData);

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
                                    <UnderRework employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <ReworkCompleted employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <ReworkCallBack employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <ReworkFailed employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <ReworkHold employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <YourOrder employeeId={user?.employeeId}/>
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

export default ReworkDashboard;

import React, { useEffect } from 'react';
import FreshLeadCard from '../components/FleadDataCard/FreshLeadCard';
import PendingOrders from '../components/OrderCard/PendingOrders';
import CanceledDataCard from '../components/FleadDataCard/CanceledData';
import CallbackDataCard from '../components/FleadDataCard/CallbackData';
import AlarmAlertComponent from '../components/AlarmAlertComponent';
import { Grid, Paper, Box, Typography, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ChartCard from '../components/ChartCard';
import { fetchOrderData, fetchCallbackData, fetchCanceledData } from '../redux/dataActions';
import dayjs from 'dayjs';

const FieldDashboard = () => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data);
    const callbackData = useSelector((state) => state.data.callbackData.data);
    const canceledData = useSelector((state) => state.data.canceledData.data);

    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.id : '';

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchOrderData(employeeId));
            dispatch(fetchCallbackData(employeeId));
            dispatch(fetchCanceledData(employeeId));
        }
    }, [dispatch, employeeId]);

    const processChartData = (orderData, callbackData, canceledData) => {
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

        processData(orderData, 'orders');
        processData(callbackData, 'callbacks');
        processData(canceledData, 'canceled');

        const sortedDates = Object.keys(groupedData).sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);
        const chartData = sortedDates.map(date => ({
            date,
            ...groupedData[date]
        }));

        return chartData;
    };

    const chartData = processChartData(orderData, callbackData, canceledData);

    return (
        <Container maxWidth="false">
            <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }}>Flead Dashboard</Typography>
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={3}>
                                    <FreshLeadCard employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={3}>
                                    <PendingOrders employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={3}>
                                    <CanceledDataCard employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={3}>
                                    <CallbackDataCard employeeId={employeeId} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3}>
                            <ChartCard data={chartData} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3}>
                            <AlarmAlertComponent employeeId={employeeId} department={'flead'} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default FieldDashboard;

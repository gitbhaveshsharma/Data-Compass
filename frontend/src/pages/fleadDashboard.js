import React, { useEffect, useState } from 'react';
import FreshLeadCard from '../components/FreshLeadCard';
import OrderDataCard from '../components/OrderData';
import CanceledDataCard from '../components/CanceledData';
import CallbackDataCard from '../components/CallbackData';
import { Grid, Paper, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import ChartCard from '../components/ChartCard';
import { fetchOrderDataByEmployeeId, fetchCallbackDataByEmployeeId, fetchCanceledDataByEmployeeId } from '../redux/dataActions';

const FieldDashboard = () => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data); 
    const callbackData = useSelector((state) => state.data.callbackData.data); 
    const canceledData = useSelector((state) => state.data.canceledData.data); 

    // Fetch user details from Redux store
    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.id : '';

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchOrderDataByEmployeeId(employeeId));
            dispatch(fetchCallbackDataByEmployeeId(employeeId));
            dispatch(fetchCanceledDataByEmployeeId(employeeId));
        }
    }, [dispatch, employeeId]);

    useEffect(() => {
        console.log("Order Data:", orderData);
    }, [orderData]);

    // Dummy data for charts
    const chartData = [
        { quarter: 'Q1', orders: `${Array.isArray(orderData) ? orderData.length : 0}`, canceled:`${Array.isArray(canceledData) ? canceledData.length : 0}`, callbacks: `${Array.isArray(callbackData) ? callbackData.length : 0}` },
        { quarter: 'Q2', orders: 44, canceled: 6, callbacks: 25 },
        { quarter: 'Q3', orders: 24, canceled: 49, callbacks: 30 },
        { quarter: 'Q4', orders: 34, canceled: 30, callbacks: 50 },
    ];

    return (
        <Container maxWidth="false">
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={3}>
                                    <FreshLeadCard employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={3}>
                                    <OrderDataCard employeeId={employeeId} />
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
                    <Grid item xs={12} md={5}>
                        <Paper elevation={3}>
                            <ChartCard data={chartData} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default FieldDashboard;

import React, { useEffect } from 'react';
import { Grid, Paper, Box, Typography, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../redux/dataActions';
import AlarmAlertComponent from '../components/AlarmAlertComponent';
import UnderVerificationOrders from '../components/OrderCard/UnderVerificationOrders';
import CallbackOrders from '../components/OrderCard/CallbackOrders';
import CanceledOrders from '../components/OrderCard/CanceledOrders';
import CheckOrderStatus from '../components/CheckOrderStatus';
import VerifiedOrders from '../components/OrderCard/VerifiedOrders';
import HoldOrder from '../components/OrderCard/HoldOrders';
import ChartCard from '../components/ChartCard';
import LogOut from '../components/Logout';
import Profile from '../components/Profile'
import dayjs from 'dayjs';

const VerifyDashboard = () => {
    const dispatch = useDispatch();

    // Fetch user details from Redux store
    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.id : '';
    const department = user ? user.department : '';

    const orderData = useSelector((state) => state.data.orderData.data || []);

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchOrderData(employeeId));
        }
    }, [dispatch, employeeId]);

    const processChartData = (data) => {
        const groupedData = {};

        data.forEach(item => {
            const date = dayjs(item.createdAt).startOf('day').format('YYYY-MM-DD');
            if (!groupedData[date]) {
                groupedData[date] = { orders: 0, canceled: 0, callbacks: 0 };
            }
            if (item.status === 'verified') {
                groupedData[date].orders += 1;
            } else if (item.status === 'canceled') {
                groupedData[date].canceled += 1;
            } else if (item.status === 'callback') {
                groupedData[date].callbacks += 1;
            }
        });

        const sortedDates = Object.keys(groupedData).sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);
        const chartData = sortedDates.map(date => ({
            date,
            ...groupedData[date]
        }));

        return chartData;
    };

    const chartData = processChartData(orderData);

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }}>Verify Dashboard</Typography>
            <Profile 
            name={user.name}
            email={user.email}
            employeeID ={user.employeeId}
            department ={user.department}
            />
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3}>
                                <UnderVerificationOrders
                                    employeeId={employeeId}
                                    role={user.role}
                                    department={department}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3}>
                                <VerifiedOrders
                                    employeeId={employeeId}
                                    role={user.role}
                                    department={department}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3}>
                                <CanceledOrders
                                    employeeId={employeeId}
                                    role={user.role}
                                    department={department}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3}>
                                <CallbackOrders
                                    employeeId={employeeId}
                                    role={user.role}
                                    department={department}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3}>
                                <HoldOrder
                                    employeeId={employeeId}
                                    role={user.role}
                                    department={department}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
                        <CheckOrderStatus role={'admin'} />
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ mb: 4 }}>
                            <ChartCard data={chartData} />
                        </Paper>
                        <Paper elevation={3}>
                            <AlarmAlertComponent employeeId={employeeId} department={'verify'} />
                        </Paper>
                    </Grid>
                </Grid>
                  <LogOut/>
            </Box>
        </Container>
    );
};

export default VerifyDashboard;

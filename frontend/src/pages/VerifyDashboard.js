import React, { useEffect } from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import { fetchOrderData } from '../redux/dataActions';
import AlarmAlertComponent from '../components/AlarmAlertComponent';
import UnderVerificationOrders from '../components/OrderCard/UnderVerificationOrders';
import CallbackOrders from '../components/OrderCard/CallbackOrders';
import CanceledOrders from '../components/OrderCard/CanceledOrders';
import VerifiedOrders from '../components/OrderCard/VerifiedOrders';

const VerifyDashboard = () => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data);

    // Fetch user details from Redux store
    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.id : '';
    const department = user ? user.department : '';

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchOrderData(employeeId));
        }
    }, [dispatch, employeeId]);

    const filterDataByStatus = (status) => {
        return orderData.filter(order => order.status === status);
    };

    const isVerifyOrAdmin = department === 'Verify' || department === 'Admin';

    return (
        <Container maxWidth="false">
            <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }}>Verify Dashboard</Typography>
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={3}>
                                    <UnderVerificationOrders
                                        employeeId={employeeId}
                                        role={user.role}
                                        department={department} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={3}>
                                    <CanceledOrders
                                        employeeId={employeeId}
                                        role={user.role}
                                        department={department}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={3}>
                                    <CallbackOrders
                                        employeeId={employeeId}
                                        role={user.role}
                                        department={department}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={3}>
                                    <VerifiedOrders
                                        employeeId={employeeId}
                                        role={user.role}
                                        department={department}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3}>
                            <AlarmAlertComponent employeeId={employeeId} department={'verify'} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

        </Container>
    );
};

export default VerifyDashboard;

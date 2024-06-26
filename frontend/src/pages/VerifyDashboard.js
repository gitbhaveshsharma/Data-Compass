import React, { useEffect } from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import { fetchOrderData } from '../redux/dataActions';
import OrderDataCard from '../components/OrderData';
import Verify from '../components/verification/VerifyOrder';

const VerifyDashboard = () => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data);

    // Fetch user details from Redux store
    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.id : '';

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchOrderData(employeeId));
        }
    }, [dispatch, employeeId]);

    useEffect(() => {
        console.log("Order Data:", orderData);
    }, [orderData]);

    return (
        <Container maxWidth="false">
            <Typography variant="h1" sx={{ textAlign: 'center', mt: 2 }}>Verify Dashboard</Typography>
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={3}>
                                    <OrderDataCard employeeId={employeeId} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Verify/>
        </Container>
    );
};

export default VerifyDashboard;

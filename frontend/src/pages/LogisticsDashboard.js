import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import ExportVerifiedOrders from '../components/Logistics/ExportVerifiedOrders';
import UpdateOrderStatus from '../components/Logistics/UpdateOrderStatus';
import ShippingOrder from '../components/Logistics/ShippingOrder';
import DeliveredOrder from '../components/Logistics/DeliveredOrders';
import LogOut from '../components/Logout';

const LogisticsDashboard = () => {
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
                Logistics Dashboard
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <ExportVerifiedOrders />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <UpdateOrderStatus />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <ShippingOrder role={'logistics'} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <DeliveredOrder role={'logistics'} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default LogisticsDashboard;

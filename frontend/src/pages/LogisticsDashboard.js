import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import ExportVerifiedOrders from '../components/Logistics/ExportVerifiedOrders';

const LogisticsDashboard = () => {
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }}> Logistics Dashboard</Typography>
            <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '15px' }}>
                        <ExportVerifiedOrders />
                    </Paper>
                </Grid>
            </Grid>
            </Box>
        </Container>
    );
};

export default LogisticsDashboard;

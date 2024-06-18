// src/components/FieldDashboard.js
import React, { useState } from 'react';
import FreshLeadCard from '../components/FreshLeadCard';
import OrderDataCard from '../components/OrderData';
import CanceledDataCard from '../components/CanceledData';
import CallbackDataCard from '../components/CallbackData';
import { Grid, Paper, Box, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import ChartCard from '../components/ChartCard';

const FieldDashboard = () => {
    const [employeeId, setEmployeeId] = useState('');

    const handleInputChange = (e) => {
        setEmployeeId(e.target.value);
    };

    // Dummy data for charts
    const chartData = [
        { quarter: 'Q1', orders: 35, canceled: 51, callbacks: 15 },
        { quarter: 'Q2', orders: 44, canceled: 6, callbacks: 25 },
        { quarter: 'Q3', orders: 24, canceled: 49, callbacks: 30 },
        { quarter: 'Q4', orders: 34, canceled: 30, callbacks: 50 },
    ];

    return (
        <Container maxWidth="false">
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Enter Employee ID"
                    value={employeeId}
                    onChange={handleInputChange}
                    margin="normal"
                />
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


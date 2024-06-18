// src/components/ChartCard.js
import React, { useState } from 'react';
import { Tab, Tabs, Box, Paper } from '@mui/material';
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';

const ChartCard = ({ data }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const barChartData = data.map(item => ({
        quarter: item.quarter,
        orders: item.orders,
        canceled: item.canceled,
        callbacks: item.callbacks,
    }));

    const pieChartData = [
        { name: 'Orders', value: data.reduce((sum, item) => sum + item.orders, 0) },
        { name: 'Canceled', value: data.reduce((sum, item) => sum + item.canceled, 0) },
        { name: 'Callbacks', value: data.reduce((sum, item) => sum + item.callbacks, 0) },
    ];

    return (
        <Box>
            <Paper elevation={3} style={{ padding: 16 }}>
                <Tabs value={value} onChange={handleChange} aria-label="chart tabs">
                    <Tab label="Bar Chart" />
                    <Tab label="Pie Chart" />
                </Tabs>
                {value === 0 && <BarChartComponent data={barChartData} />}
                {value === 1 && <PieChartComponent data={pieChartData} />}
            </Paper>
        </Box>
    );
};

export default ChartCard;

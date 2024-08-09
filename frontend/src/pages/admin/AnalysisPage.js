import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../../redux/dataActions';
import LoginHistory from '../../components/LoginHistory';
import { Grid, Paper, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseISO, getYear, getMonth, getDate, getISOWeek } from 'date-fns';

const AnalysisPage = () => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data || []);
    const [view, setView] = useState('year');

    useEffect(() => {
        dispatch(fetchOrderData('admin'));
    }, [dispatch]);

    const filterDeliveredOrders = (data) => {
        return data.filter(order => order.status === 'delivered');
    };

    const calculateSalesData = (data, view) => {
        const filteredData = filterDeliveredOrders(data);
        const salesData = {};

        filteredData.forEach(order => {
            const date = parseISO(order.createdAt);
            const key = view === 'year' ? getYear(date)
                : view === 'month' ? `${getYear(date)}-${getMonth(date) + 1}`
                    : view === 'week' ? `${getYear(date)}-W${getISOWeek(date)}`
                        : `${getYear(date)}-${getMonth(date) + 1}-${getDate(date)}`;

            if (!salesData[key]) {
                salesData[key] = { salesCount: 0, totalAmount: 0, products: {} };
            }

            salesData[key].salesCount += 1;
            salesData[key].totalAmount += order.billDetails[0].totalPrice;

            order.products.forEach(product => {
                if (!salesData[key].products[product.productName]) {
                    salesData[key].products[product.productName] = 0;
                }
                salesData[key].products[product.productName] += product.quantity;
            });
        });

        return salesData;
    };

    const renderChartData = (salesData) => {
        return Object.keys(salesData).map(key => ({
            name: key,
            salesCount: salesData[key].salesCount,
            totalAmount: salesData[key].totalAmount,
            highestSellingProduct: Object.keys(salesData[key].products).reduce((a, b) =>
                salesData[key].products[a] > salesData[key].products[b] ? a : b, ''
            ),
            Quantity: Math.max(...Object.values(salesData[key].products)),
            productDetails: Object.keys(salesData[key].products).map(product => ({
                productName: product,
                quantity: salesData[key].products[product]
            }))
        }));
    };

    const salesData = calculateSalesData(orderData, view);
    const chartData = renderChartData(salesData);

    return (
        <Grid container spacing={2} padding={2}>
            <Grid item xs={12}>
                <Paper elevation={3} style={{ backgroundColor: 'white', padding: '16px' }}>
                    <Box padding={2}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Filter Data 
                        </Typography>
                        <RadioGroup row value={view} onChange={(e) => setView(e.target.value)}>
                            <FormControlLabel value="year" control={<Radio />} label="Year" />
                            <FormControlLabel value="month" control={<Radio />} label="Month" />
                            <FormControlLabel value="week" control={<Radio />} label="Week" />
                            <FormControlLabel value="day" control={<Radio />} label="Day" />
                        </RadioGroup>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} style={{ backgroundColor: 'white', padding: '16px' }}>
                    <Box padding={2}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Sales Count and Total Amount
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="salesCount" fill="#8884d8" />
                                <Bar dataKey="totalAmount" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} style={{ backgroundColor: 'white', padding: '16px' }}>
                    <Box padding={2}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Highest Selling Product Quantities
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Quantity" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
                <Paper elevation={3} style={{ backgroundColor: 'white', padding: '16px', marginTop: '16px' }}>
                    <Box padding={2}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Highest Selling Product Names
                        </Typography>
                        <ul>
                            {chartData.map(item => (
                                <li key={item.name}>
                                    {item.name}: {item.highestSellingProduct}
                                </li>
                            ))}
                        </ul>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}><Paper>  <LoginHistory /></Paper></Grid>
        </Grid>
    );
};

export default AnalysisPage;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../../redux/dataActions';
import { Paper, Typography, Box, Dialog, DialogTitle, DialogContent, MenuItem, Select } from '@mui/material';
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import moment from 'moment';

const CancelOrdersChart = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data || []);
    const [openDialog, setOpenDialog] = useState(false);
    const [timeFilter, setTimeFilter] = useState('month'); // Default to 'month' since 'week' is removed

    useEffect(() => {
        dispatch(fetchOrderData(employeeId, role));
    }, [dispatch, employeeId, role]);

    const filterDataByTime = (data, filter) => {
        const now = moment();
        return data.filter((order) => {
            const orderDate = moment(order.createdAt);
            if (filter === 'month') return now.subtract(1, 'months').isBefore(orderDate);
            if (filter === 'year') return now.subtract(1, 'years').isBefore(orderDate);
            return true;
        });
    };

    const calculateTotalOrders = (data) => data.length;

    const getOrdersComparison = (data, filter) => {
        const now = moment();
        const previousPeriodData = data.filter((order) => {
            const orderDate = moment(order.createdAt);
            if (filter === 'month') {
                return now.subtract(2, 'months').isBefore(orderDate) && now.subtract(1, 'months').isAfter(orderDate);
            } else if (filter === 'year') {
                return now.subtract(2, 'years').isBefore(orderDate) && now.subtract(1, 'years').isAfter(orderDate);
            }
            return false;
        });

        const previousOrders = calculateTotalOrders(previousPeriodData);
        const currentOrders = calculateTotalOrders(filterDataByTime(data, filter));

        return { previousOrders, currentOrders };
    };

    const canceledOrders = filterDataByTime(orderData.filter(order => order.status === 'canceled'), timeFilter);
    const { previousOrders, currentOrders } = getOrdersComparison(orderData.filter(order => order.status === 'canceled'), timeFilter);

    const percentageChange = previousOrders === 0 ? (currentOrders > 0 ? 100 : 0) : ((currentOrders - previousOrders) / previousOrders) * 100;
    const isIncreased = percentageChange > 0;

    const aggregateDataByDate = (data) => {
        const aggregated = data.reduce((acc, order) => {
            const date = moment(order.createdAt).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = { date, value: 0 };
            }
            acc[date].value += order.billDetails.reduce((sum, item) => sum + item.totalPrice, 0);
            return acc;
        }, {});

        return Object.values(aggregated);
    };

    const trendData = aggregateDataByDate(canceledOrders);

    const totalCanceled = canceledOrders.length;

    const handleChartClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleTimeFilterChange = (event) => {
        setTimeFilter(event.target.value);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, justifyContent: 'center', flex: 1 }}>
                <Typography variant="h6">Canceled Orders</Typography>
                <Typography variant="h4">{totalCanceled}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isIncreased ? (
                        <TrendingUpIcon sx={{ color: 'green', mr: 1 }} />
                    ) : (
                        <TrendingDownIcon sx={{ color: 'red', mr: 1 }} />
                    )}
                    <Typography variant="caption" color="textSecondary">
                        {isIncreased ? '+' : '-'}
                        {Math.abs(percentageChange.toFixed(2))}% last {timeFilter}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: '50%' }, mt: { xs: 2, sm: 0 } }} onClick={handleChartClick}>
                <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={trendData}>
                        <Line
                            type="monotoneX"
                            dataKey="value"
                            stroke={isIncreased ? "#28a745" : "#ff7300"}
                            strokeWidth={2}
                            dot={false}
                        />
                        <RechartsTooltip
                            formatter={(value) => `₹${value.toFixed(2)}`}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>
                    Canceled Orders Details
                    <Select
                        value={timeFilter}
                        onChange={handleTimeFilterChange}
                        sx={{ float: 'right' }}
                    >
                        <MenuItem value="month">Month</MenuItem>
                        <MenuItem value="year">Year</MenuItem>
                    </Select>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Total Canceled: {totalCanceled}</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <XAxis dataKey="date" />
                            <Line
                                type="monotoneX"
                                dataKey="value"
                                stroke={isIncreased ? "#28a745" : "#ff7300"}
                                strokeWidth={2}
                                dot={false}
                            />
                            <RechartsTooltip
                                formatter={(value) => `₹${value.toFixed(2)}`}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </DialogContent>
            </Dialog>
        </Paper>
    );
};

export default CancelOrdersChart;

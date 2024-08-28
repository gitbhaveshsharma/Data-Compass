import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../../redux/dataActions';
import {
    Card,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    MenuItem,
    Select,
} from '@mui/material';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis
} from 'recharts';
import moment from 'moment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const TotalSalesChart = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data || []);
    const [openDialog, setOpenDialog] = useState(false);
    const [timeFilter, setTimeFilter] = useState('month'); // Default to 'month' after removing 'week'

    useEffect(() => {
        dispatch(fetchOrderData(employeeId, role));
    }, [dispatch, employeeId, role]);

    const formatSales = (sales) => {
        if (sales >= 1e9) return `${(sales / 1e9).toFixed(2)}B+`;
        if (sales >= 1e6) return `${(sales / 1e6).toFixed(2)}M+`;
        if (sales >= 1e3) return `${(sales / 1e3).toFixed(2)}K+`;
        return sales.toFixed(2);
    };

    const filterDataByTime = (data, filter) => {
        const now = moment();
        return data.filter((order) => {
            const orderDate = moment(order.createdAt);
            if (filter === 'month') {
                return now.subtract(1, 'months').isBefore(orderDate);
            } else if (filter === 'year') {
                return now.subtract(1, 'years').isBefore(orderDate);
            }
            return true;
        });
    };

    const calculateTotalSales = (data) => {
        return data
            .filter((order) => order.status === 'delivered')
            .reduce(
                (total, order) =>
                    total + order.billDetails.reduce((sum, item) => sum + item.totalPrice, 0),
                0
            );
    };

    const getSalesComparison = (data, filter) => {
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

        const previousSales = calculateTotalSales(previousPeriodData);
        const currentSales = calculateTotalSales(filterDataByTime(data, filter));

        return { previousSales, currentSales };
    };

    const { previousSales, currentSales } = getSalesComparison(orderData, timeFilter);

    const percentageChange =
        previousSales === 0 ? (currentSales > 0 ? 100 : 0) : ((currentSales - previousSales) / previousSales) * 100;
    const isIncreased = percentageChange > 0;

    const filteredOrderData = filterDataByTime(orderData, timeFilter).filter(
        (order) => order.status === 'delivered'
    );

    const totalSales = calculateTotalSales(filteredOrderData);

    // Group and aggregate data by date
    const aggregateDataByDate = (data) => {
        const aggregatedData = {};
        data.forEach((order) => {
            const date = moment(order.createdAt).format('YYYY-MM-DD');
            const totalPrice = order.billDetails.reduce((acc, bill) => acc + bill.totalPrice, 0);
            if (aggregatedData[date]) {
                aggregatedData[date] += totalPrice;
            } else {
                aggregatedData[date] = totalPrice;
            }
        });

        // Convert aggregated data back into an array format suitable for Recharts
        return Object.keys(aggregatedData).map((date) => ({
            date,
            value: aggregatedData[date],
        }));
    };

    const trendData = aggregateDataByDate(filteredOrderData);

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
        <Card
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    justifyContent: 'center',
                    flex: 1,
                }}
            >
                <Typography variant="h6">Total Sales</Typography>
                <Typography variant="h4">₹{formatSales(totalSales)}</Typography>
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

            <Box
                sx={{ width: { xs: '100%', sm: '50%' }, mt: { xs: 2, sm: 0 } }}
                onClick={handleChartClick}
            >
                <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={trendData}>
                        {/* <XAxis dataKey="date" /> */}
                        <Line
                            type="monotoneX"
                            dataKey="value"
                            stroke="#28a745"
                            strokeWidth={2}
                            dot={false}
                        />
                        <RechartsTooltip
                            formatter={(value) => `₹${value.toFixed(2)}`}
                            labelFormatter={(label) => `Date: ${label}`} // Show formatted date in tooltip
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>
                    Total Sales Details
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
                    <Typography variant="h6">
                         ₹{totalSales.toFixed(2)}
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <XAxis dataKey="date" />
                            <Line
                                type="monotoneX"
                                dataKey="value"
                                stroke={isIncreased ? '#28a745' : '#ff7300'}
                                strokeWidth={2}
                                dot={false}
                            />
                            <RechartsTooltip
                                formatter={(value) => `₹${value.toFixed(2)}`}
                                labelFormatter={(date) => `Date: ${date}`} // Format the label to show in the tooltip
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default TotalSalesChart;

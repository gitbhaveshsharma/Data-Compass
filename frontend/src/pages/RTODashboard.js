import React, { useEffect, useState } from 'react';
import UnderRTO from '../components/RTO/UnderRTO';
import ReturnCanceled from '../components/RTO/ReturnCanceled';
import ReDelivered from '../components/RTO/ReDelivered';
import CheckOrderStatus from '../components/CheckOrderStatus';
import AlarmAlertComponent from '../components/AlarmAlertComponent';
import { Grid, Paper, Box, Container} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ChartCard from '../components/ChartCard';
import { fetchAssignedData } from '../redux/dataActions';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { updateEmployee } from '../redux/employeeActions';
import Header from '../components/Header';
import RTOCallBack from '../components/RTO/RTOCallBack';
import HoldOrders from '../components/OrderCard/HoldOrders';

const RTODashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [message, setMessage] = useState('');
    const assignedData = useSelector((state) => state.data.assignedData.assignedData || []);
    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.id : '';

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(updateEmployee(employeeId, { status: 'online' }))
                .then(() => {
                    setMessage('Status updated to online successfully.');
                })
                .catch(() => {
                    setMessage('Failed to update status.');
                });
        }
    }, [user, navigate, dispatch, employeeId]);

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchAssignedData(employeeId));
        }
    }, [dispatch, employeeId]);

    const processChartData = (assignedData) => {
        const groupedData = {};

        const processData = (data, type) => {
            data.forEach(item => {
                const date = dayjs(item.createdAt).startOf('day').format('YYYY-MM-DD');
                if (!groupedData[date]) {
                    groupedData[date] = { reDelivered: 0, returnCanceled: 0, callbacks: 0 };
                }
                groupedData[date][type] += 1;
            });
        };

        processData(assignedData.filter(item => item.status === 're-delivered'), 'reDelivered');
        processData(assignedData.filter(item => item.status === 'return canceled'), 'returnCanceled');
        processData(assignedData.filter(item => item.status === 'callback'), 'callbacks');

        const sortedDates = Object.keys(groupedData).sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);
        const chartData = sortedDates.map(date => ({
            date,
            ...groupedData[date]
        }));

        return chartData;
    };

    const chartData = processChartData(assignedData);

    return (
        <>
            <Header title="RTO Dashboard" />
            <Container maxWidth="xl">
                <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6} container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <UnderRTO employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <ReDelivered employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <ReturnCanceled employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <RTOCallBack employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3}>
                                    <HoldOrders employeeId={employeeId} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
                                    <CheckOrderStatus role={'admin'} />
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 4 }}>
                                <Paper elevation={3}>
                                    <ChartCard data={chartData} />
                                </Paper>
                            </Box>
                            <Box>
                                <Paper elevation={3}>
                                    <AlarmAlertComponent employeeId={user?.employeeId} department={user?.department} />
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default RTODashboard;

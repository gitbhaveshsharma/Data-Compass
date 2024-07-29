import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory } from '../redux/historyActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { BarChart } from '@mui/x-charts/BarChart';

const LoginHistory = () => {
    const dispatch = useDispatch();
    const { history, loading, error } = useSelector((state) => state.history);
    const [employeeId, setEmployeeId] = useState('');
    const [submittedEmployeeId, setSubmittedEmployeeId] = useState('');

    useEffect(() => {
        if (submittedEmployeeId) {
            dispatch(fetchHistory(submittedEmployeeId));
        }
    }, [dispatch, submittedEmployeeId]);

    const handleSubmit = () => {
        setSubmittedEmployeeId(employeeId);
    };

    // Extract the login history entries
    const loginHistory = history?.loginHistory || [];

    // Function to calculate working hours
    const calculateWorkingHours = (loginHistory) => {
        const workHoursPerDay = {};

        loginHistory.forEach((entry, index) => {
            const date = new Date(entry.time).toDateString();
            if (!workHoursPerDay[date]) {
                workHoursPerDay[date] = {
                    hours: 0,
                    logouts: 0,
                    logoutTypes: [],
                };
            }

            if (entry.type === 'login') {
                const nextEntry = loginHistory[index + 1];
                if (nextEntry && (nextEntry.type === 'manual-logout' || nextEntry.type === 'auto-logout' || nextEntry.type === 'inactivity-logout')) {
                    const loginTime = new Date(entry.time);
                    const logoutTime = new Date(nextEntry.time);
                    const duration = (logoutTime - loginTime) / (1000 * 60 * 60); // Convert to hours
                    workHoursPerDay[date].hours += duration;
                    workHoursPerDay[date].logouts += 1;
                    workHoursPerDay[date].logoutTypes.push(nextEntry.type);
                }
            }
        });

        return Object.entries(workHoursPerDay).map(([date, { hours, logouts, logoutTypes }]) => ({
            date,
            hours: hours.toFixed(2),
            logouts,
            logoutTypes,
        }));
    };

    const workingHoursData = calculateWorkingHours(loginHistory);

    // Determine bar color based on working hours
    const getBarColor = (hours) => {
        if (hours >= 7) return 'green';
        if (hours >= 6) return 'orange';
        return 'red';
    };

    // Prepare data for BarChart
    const xData = workingHoursData.map(entry => entry.date);
    const yData = workingHoursData.map(entry => parseFloat(entry.hours));
    const barColors = workingHoursData.map(entry => getBarColor(entry.hours));

    // Prepare data for logout bar chart
    const logoutData = workingHoursData.map(entry => entry.logouts);

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={handleSubmit} fullWidth>
                        Fetch History
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {loading && <Typography>Loading...</Typography>}
                    {error && <Typography color="error">{error}</Typography>}
                    {!loading && !error && workingHoursData.length > 0 && (
                        <>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: xData }]}
                                series={[
                                    { data: yData, label: 'Working Hours', backgroundColor: barColors },
                                    { data: logoutData, label: 'Logouts', backgroundColor: 'yellow' }
                                ]}
                                width={500}
                                height={300}
                                yAxis={[{ title: { text: 'Hours/Logouts' } }]}
                            />
                        </>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginHistory;

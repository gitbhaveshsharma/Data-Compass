import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ExportVerifiedOrders from '../components/Logistics/ExportVerifiedOrders';
import UpdateOrderStatus from '../components/Logistics/UpdateOrderStatus';
import ShippingOrder from '../components/Logistics/ShippingOrder';
import DeliveredOrder from '../components/Logistics/DeliveredOrders';
import LogOut from '../components/Logout';
import { useNavigate } from 'react-router-dom';
import { updateEmployee } from '../redux/employeeActions';
import Header from '../components/Header';



const LogisticsDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.id : '';
    // eslint-disable-next-line no-unused-vars
    const [ message, setMessage] = useState('');


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        else {
            dispatch(updateEmployee(employeeId, { status: 'online' }))
                .then(() => {
                    setMessage('Status updated to online successfully.');
                })
                .catch(() => {
                    setMessage('Failed to update status.');
                });
        }
        }, [user, navigate, dispatch, employeeId, setMessage]);

    return (
        <>
            <Header title="Logistics Dashboard" />
        <Container maxWidth="lg" sx={{mt: 4}}>
            {/* <Typography variant="h4" sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
                Logistics Dashboard
            </Typography> */}
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
            <LogOut employeeId={user?.employeeId} id={employeeId}/>
        </>
    );
};

export default LogisticsDashboard;

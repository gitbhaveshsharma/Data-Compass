import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CallbackData from '../../components/FleadDataCard/CallbackData';
import CanceledData from '../../components/FleadDataCard/CanceledData';
import HoldData from '../../components/FleadDataCard/HoldData';
import UnderVerificationOrders from '../../components/OrderCard/UnderVerificationOrders';
import CallbackOrders from '../../components/OrderCard/CallbackOrders';
import CanceledOrders from '../../components/OrderCard/CanceledOrders';
import VerifiedOrders from '../../components/OrderCard/VerifiedOrders';
import PendingOrders from '../../components/OrderCard/PendingOrders';
import CheckOrderStatus from '../../components/CheckOrderStatus';
import ShippingOrder from '../../components/Logistics/ShippingOrder';
import DeliveredOrder from '../../components/Logistics/DeliveredOrders';
import HoldOrder from '../../components/OrderCard/HoldOrders';
import LogOut from '../../components/Logout';

import { useNavigate } from 'react-router-dom';
import { updateEmployee } from '../../redux/employeeActions';


const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const department = user ? user.department : '';
  const employeeId = user ? user.id : '';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    else {
      // Update employee status to online after login
      dispatch(updateEmployee(employeeId, { status: 'online' }))
        .then(() => {
          setMessage('Status updated to online successfully.');
        })
        .catch(() => {
          setMessage('Failed to update status.');
        });
    }
  }, [employeeId, user, navigate]);


  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={4}>
          {/* Left grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <PendingOrders role={user?.role} department={department} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <CallbackData employeeId={user?._id} role={user?.role} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <CanceledData employeeId={user?._id} role={user?.role} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <HoldData employeeId={user?._id} role={user?.role} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <ShippingOrder role={user?.role} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} >
                  <DeliveredOrder role={user?.role} />
                </Paper>
              </Grid>
             
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <UnderVerificationOrders role={user?.role} department={department} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <VerifiedOrders role={user?.role} department={department} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <CallbackOrders role={user?.role} department={department} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <CanceledOrders role={user?.role} department={department} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <HoldOrder
                    role={user?.role}
                    department={department}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <CheckOrderStatus role={user?.role} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <LogOut employeeId={user?.employeeId} />
    </Container>
  );
};

export default AdminDashboard;

// src/pages/AdminDashboard.js
import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import OrderDataCard from '../../components/OrderData';
import CallbackData from '../../components/CallbackData';
import CanceledData from '../../components/CanceledData';

const AdminDashboard = () => {
  const orderData = useSelector((state) => state.data.orderData.data);
  const user = useSelector((state) => state.auth.user);
  const department = user ? user.department : '';

  const filterDataByStatus = (status) => {
    return orderData.filter(order => order.status === status);
  };

  const isVerifyOrAdmin = department === 'Verify' || department === 'admin';

  return (
    <Container maxWidth={false}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Left grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isVerifyOrAdmin ? filterDataByStatus('pending') : orderData}
                  title="Pending Order"
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CallbackData role="admin" />
              </Grid>
              <Grid item xs={12} md={6}>
                <CanceledData role="admin" />
              </Grid>
            </Grid>
          </Grid>
          {/* Right grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isVerifyOrAdmin ? filterDataByStatus('under verification') : orderData}
                  title="Under Verification Order"
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isVerifyOrAdmin ? filterDataByStatus('verified') : orderData}
                  title="Verified Order"
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isVerifyOrAdmin ? filterDataByStatus('callback') : orderData}
                  title="Call back Order"
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isVerifyOrAdmin ? filterDataByStatus('canceled') : orderData}
                  title="Canceled Order"
                  role={user.role}
                  department={department}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;

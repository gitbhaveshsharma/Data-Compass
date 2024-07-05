import React from 'react';
import { Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
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

  const isverifyOrAdmin = department === 'verify' || department === 'admin';

  return (
    <Container maxWidth={false}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Left grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isverifyOrAdmin ? filterDataByStatus('pending') : orderData}
                  title="Pending Order"
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CallbackData employeeId={user._id} role={user.role} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CanceledData employeeId={user._id} role={user.role} />
              </Grid>
            </Grid>
          </Grid>
          {/* Right grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isverifyOrAdmin ? filterDataByStatus('under verification') : orderData}
                  title="Under Verification Order"
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isverifyOrAdmin ? filterDataByStatus('verified') : orderData}
                  title="Verified Order"
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isverifyOrAdmin ? filterDataByStatus('callback') : orderData}
                  title="Call back Order"
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <OrderDataCard
                  data={isverifyOrAdmin ? filterDataByStatus('canceled') : orderData}
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

import React from 'react';
import { Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import CallbackData from '../../components/FleadDataCard/CallbackData';
import CanceledData from '../../components/FleadDataCard/CanceledData';
import UnderVerificationOrders from '../../components/OrderCard/UnderVerificationOrders';
import CallbackOrders from '../../components/OrderCard/CallbackOrders';
import CanceledOrders from '../../components/OrderCard/CanceledOrders';
import VerifiedOrders from '../../components/OrderCard/VerifiedOrders';
import PendingOrders from '../../components/OrderCard/PendingOrders';

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const department = user ? user.department : '';

  return (
    <Container maxWidth={false}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Left grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <PendingOrders
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
                <UnderVerificationOrders
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <VerifiedOrders
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CallbackOrders
                  role={user.role}
                  department={department}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CanceledOrders
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

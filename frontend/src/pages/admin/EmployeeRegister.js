import React from 'react';
import { Grid, Container, Paper } from '@mui/material';
import FetchEmployeeDetails from '../../components/EmployeeDetails';
import EmployeeRegistration from '../../components/EmployeeRegistration';

const EmployeeManagementPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <FetchEmployeeDetails />
            </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <EmployeeRegistration />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeManagementPage;

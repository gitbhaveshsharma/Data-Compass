// src/pages/AdminDashboard.js
import React from 'react';
import { styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import DataCountComponent from '../../components/DataCountComponent';
import OrderData from '../../components/OrderData';
import CallbackData from '../../components/CallbackData';
import CanceledData from '../../components/CanceledData';
import UploadComponent from '../../components/UploadComponent';
import EmployeeListComponent from '../../components/EmployeeListComponent';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AdminDashboard = () => {

  return (
    <Container maxWidth={false}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Left grid with two items in one column, each taking 3 spaces */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Item>
                  <DataCountComponent />
                </Item>
              </Grid>
              <Grid item xs={12} md={6}>
                <Item>
                  <OrderData role="admin" />
                </Item>
              </Grid>
              <Grid item xs={12} md={6}>
                <Item>
                  <CallbackData role="admin" />
                </Item>
              </Grid>
              <Grid item xs={12} md={6}>
                <Item>
                  <CanceledData role="admin" />
                </Item>
              </Grid>
            </Grid>
          </Grid>
          {/* Right grid with a single item */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Item>
                  <UploadComponent />
                </Item>
              </Grid>
              <Grid item xs={12} md={12}>
                <Item>
                  {/* <EmployeeListComponent /> */}
                </Item>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;

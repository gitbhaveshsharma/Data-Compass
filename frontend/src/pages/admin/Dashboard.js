import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Tabs, Tab, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CallbackData from '../../components/FleadDataCard/CallbackData';
import CanceledData from '../../components/FleadDataCard/CanceledData';
import HoldData from '../../components/FleadDataCard/HoldData';
import UnderVerificationOrders from '../../components/OrderCard/UnderVerificationOrders';
import CallbackOrders from '../../components/OrderCard/CallbackOrders';
import CanceledOrders from '../../components/OrderCard/CanceledOrders';
import VerifiedOrders from '../../components/OrderCard/VerifiedOrders';
import PendingOrders from '../../components/OrderCard/PendingOrders';
import UnderRwork from '../../components/Rework/UnderRework';
import ReworkCallBack from '../../components/Rework/ReworkCallBack';
import ReworkFailed from '../../components/Rework/ReworkFailed';
import ReworkHold from '../../components/Rework/ReworkHold';
import ReworkCompleted from '../../components/Rework/ReworkCompleted';
import UnderRTO from '../../components/RTO/UnderRTO';
import ReDelivered from '../../components/RTO/ReDelivered';
import RTOCallBack from '../../components/RTO/RTOCallBack';
import ReturnCanceled from '../../components/RTO/ReturnCanceled';
import ReturnedOrder from '../../components/Logistics/ReturnedOrder';
import CheckOrderStatus from '../../components/CheckOrderStatus';
import ShippingOrder from '../../components/Logistics/ShippingOrder';
import DeliveredOrder from '../../components/Logistics/DeliveredOrders';
import HoldOrder from '../../components/OrderCard/HoldOrders';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseISO, getYear, getMonth, getDate, getISOWeek } from 'date-fns';
import OrdersChart from '../../components/Analytics/OrdersChart';
import CancelOrdersChart from '../../components/Analytics/CancelOrdersChart';
import TotalSalesChart from '../../components/Analytics/TotalSalesChart';

import { useNavigate } from 'react-router-dom';
import { updateEmployee } from '../../redux/employeeActions';
import { fetchOrderData } from '../../redux/dataActions';

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const department = user ? user.department : '';
  const employeeId = user ? user.id : '';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const orderData = useSelector((state) => state.data.orderData.data || []);
  // eslint-disable-next-line no-unused-vars
  const [view, setView] = useState('week');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Update employee status to online after login
      dispatch(updateEmployee(employeeId, { status: 'online' }))
        .then(() => {
          setMessage('Status updated to online successfully.');
        })
        .catch(() => {
          setMessage('Failed to update status.');
        });
    }
  }, [employeeId, user, navigate, dispatch, setMessage]);

  useEffect(() => {
    dispatch(fetchOrderData('admin'));
  }, [dispatch]);

  const filterDeliveredOrders = (data) => {
    return data.filter(order => order.status === 'delivered');
  };

  const calculateSalesData = (data, view) => {
    const filteredData = filterDeliveredOrders(data);
    const salesData = {};

    filteredData.forEach(order => {
      const date = parseISO(order.createdAt);
      const key = view === 'year' ? getYear(date)
        : view === 'month' ? `${getYear(date)}-${getMonth(date) + 1}`
          : view === 'week' ? `${getYear(date)}-W${getISOWeek(date)}`
            : `${getYear(date)}-${getMonth(date) + 1}-${getDate(date)}`;

      if (!salesData[key]) {
        salesData[key] = { salesCount: 0, totalAmount: 0, products: {} };
      }

      salesData[key].salesCount += 1;
      salesData[key].totalAmount += order.billDetails[0].totalPrice;

      order.products.forEach(product => {
        if (!salesData[key].products[product.productName]) {
          salesData[key].products[product.productName] = 0;
        }
        salesData[key].products[product.productName] += product.quantity;
      });
    });

    return salesData;
  };

  const renderChartData = (salesData) => {
    return Object.keys(salesData).map(key => ({
      name: key,
      salesCount: salesData[key].salesCount,
      totalAmount: salesData[key].totalAmount,
      highestSellingProduct: Object.keys(salesData[key].products).reduce((a, b) =>
        salesData[key].products[a] > salesData[key].products[b] ? a : b, ''
      ),
      Quantity: Math.max(...Object.values(salesData[key].products)),
      productDetails: Object.keys(salesData[key].products).map(product => ({
        productName: product,
        quantity: salesData[key].products[product]
      }))
    }));
  };

  const salesData = calculateSalesData(orderData, view);
  const chartData = renderChartData(salesData);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };


  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid container spacing={2} >
        <Grid item xs={12} md={4}>
          <OrdersChart role={"admin"} />
        </Grid>
        <Grid item xs={12} md={4}>
          <CancelOrdersChart role={"admin"} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TotalSalesChart role={"admin"} />
        </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, mt:4}}>
        <Grid container spacing={4}>
          {/* Left grid with tabs */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab label="Flead" />
              <Tab label="Verify" />
              <Tab label="Rework" />
              <Tab label="Logistics" />
              <Tab label="RTO" />
            </Tabs>

            {/* Render content based on selected tab */}
            {tabIndex === 0 && (
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3}>
                    <PendingOrders role={user?.role} employeeId="all" />
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
              </Grid>
            )}
            {tabIndex === 1 && (
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
              </Grid>
            )}
            {tabIndex === 2 && (
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3}>
                    <UnderRwork role={user?.role} />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3}>
                    <ReworkCompleted role={user?.role} />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3}>
                    <ReworkCallBack role={user?.role} department={department} />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3}>
                    <ReworkFailed role={user?.role} department={department} />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3}>
                    <ReworkHold role={user?.role} department={department} />
                  </Paper>
                </Grid>
              </Grid>
            )}
            {tabIndex === 3 && (
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3}>
                    <ShippingOrder role={user?.role} />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3}>
                    <DeliveredOrder role={user?.role} />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3}>
                    <ReturnedOrder role={user?.role} department={department} />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <CheckOrderStatus role={user?.role} />
                  </Paper>
                </Grid>
              </Grid>
            )}
          {tabIndex === 4 && (
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <UnderRTO role={user?.role} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <ReDelivered role={user?.role} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <RTOCallBack role={user?.role} department={department} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3}>
                  <ReturnCanceled role={user?.role} department={department} />
                </Paper>
              </Grid>
            </Grid>
              )}
            </Paper>
            </Grid>

          {/* Right grid with chart placeholder */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Sales Data Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                 
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="salesCount" fill="#8884d8" />
                  <Bar dataKey="totalAmount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Highest Selling Product Names
              </Typography>
              <ul>
                {chartData.map(item => (
                  <li key={item.name}>
                    {item.name}: {item.highestSellingProduct}
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;

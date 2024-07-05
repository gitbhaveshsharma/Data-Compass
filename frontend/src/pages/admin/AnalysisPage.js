// // AnalysisPage.js
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCallbackData, fetchCanceledData, fetchOrderData } from '../../redux/dataActions';
// import Container from '@mui/material/Container';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import TextField from '@mui/material/TextField';
// import DataTable from '../../components/DataTable';
// import Chart from '../../components/data/BarChart'; // Assuming you have a Chart component

// const TabPanel = (props) => {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`tabpanel-${index}`}
//             aria-labelledby={`tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Box sx={{ p: 3 }}>
//                     <Typography>{children}</Typography>
//                 </Box>
//             )}
//         </div>
//     );
// };

// const AnalysisPage = ({ employeeId, role }) => {
//     const dispatch = useDispatch();
//     const [tabIndex, setTabIndex] = useState(0);
//     const [filter, setFilter] = useState('');

//     const orderData = useSelector((state) => state.data.orderData.data);
//     const callbackData = useSelector((state) => state.data.callbackData.data);
//     const canceledData = useSelector((state) => state.data.canceledData.data);

//     useEffect(() => {
//         dispatch(fetchOrderData(employeeId, role));
//         dispatch(fetchCallbackData(employeeId, role));
//         dispatch(fetchCanceledData(employeeId, role));
//     }, [dispatch, employeeId, role]);

//     const handleTabChange = (event, newIndex) => {
//         setTabIndex(newIndex);
//     };

//     const handleFilterChange = (event) => {
//         setFilter(event.target.value);
//     };

//     const filterData = (data) => {
//         if (!filter) return data;
//         return data.filter((item) => item.createdAt.includes(filter));
//     };

//     const columns = [
//         { id: 'id', field: '_id', headerName: 'ID', width: 90 },
//         { id: 'name', field: 'name', headerName: 'Name', width: 150 },
//         { id: 'number', field: 'number', headerName: 'Number', width: 150 },
//         { id: 'address', field: 'address', headerName: 'Address', width: 200 },
//         { id: 'status', field: 'status', headerName: 'Status', width: 120 },
//         { id: 'createdAt', field: 'createdAt', headerName: 'Created At', width: 180 },
//     ];

//     return (
//         <Container maxWidth={false}>
//             <Box sx={{ flexGrow: 1, padding: 2 }}>
//                 <Grid container spacing={2}>
//                     {/* Left Grid */}
//                     <Grid item xs={12} md={6}>
//                         <Card>
//                             <CardContent>
//                                 <TextField
//                                     label="Filter by Date (YYYY-MM-DD)"
//                                     variant="outlined"
//                                     fullWidth
//                                     value={filter}
//                                     onChange={handleFilterChange}
//                                     sx={{ marginBottom: 2 }}
//                                 />
//                                 <Tabs value={tabIndex} onChange={handleTabChange}>
//                                     <Tab label="All Data" />
//                                     <Tab label="Orders" />
//                                     <Tab label="Callbacks" />
//                                     <Tab label="Canceled" />
//                                 </Tabs>
//                                 <TabPanel value={tabIndex} index={0}>
//                                     <Typography>Total Orders: {filterData(orderData).length}</Typography>
//                                     <Typography>Total Callbacks: {filterData(callbackData).length}</Typography>
//                                     <Typography>Total Canceled: {filterData(canceledData).length}</Typography>
//                                 </TabPanel>
//                                 <TabPanel value={tabIndex} index={1}>
//                                     <DataTable columns={columns} data={filterData(orderData)} title="Orders" />
//                                 </TabPanel>
//                                 <TabPanel value={tabIndex} index={2}>
//                                     <DataTable columns={columns} data={filterData(callbackData)} title="Callbacks" />
//                                 </TabPanel>
//                                 <TabPanel value={tabIndex} index={3}>
//                                     <DataTable columns={columns} data={filterData(canceledData)} title="Canceled" />
//                                 </TabPanel>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     {/* Right Grid */}
//                     <Grid item xs={12} md={6}>
//                         <Card>
//                             <CardContent>
//                                 <Chart
//                                     orderData={filterData(orderData)}
//                                     callbackData={filterData(callbackData)}
//                                     canceledData={filterData(canceledData)}
//                                 />
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </Container>
//     );
// };

// export default AnalysisPage;


import React from 'react';
import EmployeeListComponent from '../components/EmployeeListComponent';
import UploadComponent from '../components/UploadComponent';
import DataCountComponent from '../components/DataCountComponent';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const AdminDashboard = () => {
    return (<>
        <Container fixed>
            <h1 style={{textAlign:"center"}}>Admin Dashboard</h1>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                       
                        <Item><DataCountComponent /><UploadComponent /></Item>
                </Grid>
                <Grid item xs={6} md={6}>
                        <Item> <EmployeeListComponent/></Item>
                </Grid>
            </Grid>
            </Box>
        </Container> 
    </>
       
    );
}


export default AdminDashboard;

import React from 'react';
import { Box, Grid, Paper, Container } from '@mui/material';
import UploadComponent from '../../components/UploadComponent';
import EmployeeListComponent from '../../components/EmployeeListComponent';
import DataCountComponent from '../../components/DataCountComponent';

const DataAssigned = () => {
    return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh" padding={2}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box mb={2}>
                           
                                <DataCountComponent />

                        </Box>
                        <Box mb={2}>
                            <Paper elevation={3} >
                                <UploadComponent />
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ padding: 2 }}>
                            <EmployeeListComponent />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default DataAssigned;

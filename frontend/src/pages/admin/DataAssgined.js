import React from 'react';
import { Box, Grid, Paper, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import UploadComponent from '../../components/UploadComponent';
import EmployeeListComponent from '../../components/EmployeeListComponent';
import DataCountComponent from '../../components/DataCountComponent';

const DataAssigned = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh" padding={2}>
                <Grid container spacing={isSmallScreen ? 2 : 4}>
                    <Grid item xs={12} md={4}>
                        <Box mb={2}>
                            <Paper elevation={3} sx={{ padding: 0 }}>
                                <DataCountComponent />
                            </Paper>
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

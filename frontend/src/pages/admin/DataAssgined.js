import React from 'react';
import { Box, Grid, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';
import UploadComponent from '../../components/UploadComponent';
import EmployeeListComponent from '../../components/EmployeeListComponent';
import DataCountComponent from '../../components/DataCountComponent';

const DataAssigned = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh" padding={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <DataCountComponent />
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <UploadComponent />
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <EmployeeListComponent />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DataAssigned;

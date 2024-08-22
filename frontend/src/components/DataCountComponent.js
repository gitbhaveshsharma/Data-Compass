import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataCounts } from '../redux/dataActions';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

const DataCountComponent = () => {
    const dispatch = useDispatch();
    const { assignedCount, unassignedCount, loading, error } = useSelector((state) => state.dataCounts);

    useEffect(() => {
        dispatch(fetchDataCounts());
    }, [dispatch]);

    return (
        <>
            {loading ? (
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                    </Box>
            ) : error ? (
                <Typography color="error">Error: {error}</Typography>
            ) : (
                    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                        <Paper elevation={3} sx={{ p: 2,  flex: 1, textAlign: 'center' }}>
                            <Typography variant="h5">{assignedCount}</Typography>
                            <Typography variant="body1">Assigned</Typography>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 2, ml: 1, flex: 1, textAlign: 'center' }}>
                            <Typography variant="h5">{unassignedCount}</Typography>
                            <Typography variant="body1">Unassigned</Typography>
                        </Paper>
                    </Box>
            )}
        </>
    );
};

export default DataCountComponent;

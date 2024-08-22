import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { fetchEmployees } from '../redux/employeeActions';
import { distributeData, fetchDataCounts, fetchAssignedData } from '../redux/dataActions';
import ListItem from '@mui/material/ListItem';
import { Grid, Box, Typography, Snackbar, CircularProgress,  Alert, ListItemButton, FormControlLabel, Checkbox, Button, Container } from '@mui/material';

const EmployeeListComponent = () => {
    const dispatch = useDispatch();
    const { employees, loading, error } = useSelector((state) => state.employees);
    const {unassignedCount, loading: dataCountsLoading, error: dataCountsError } = useSelector((state) => state.dataCounts);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [dataCount, setDataCount] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 

    useEffect(() => {
        dispatch(fetchEmployees());
        dispatch(fetchDataCounts());
    }, [dispatch]);

    useEffect(() => {
        employees.forEach(employee => {
            dispatch(fetchAssignedData(employee._id));
        });
    }, [dispatch, employees]);

    const handleCheckboxChange = useCallback(
        (employeeId) => {
            setSelectedEmployees((prev) =>
                prev.includes(employeeId)
                    ? prev.filter((id) => id !== employeeId)
                    : [...prev, employeeId]
            );
        },
        []
    );

    const handleDistribute = useCallback(async () => {
        if (dataCount <= 0) {
            setSnackbarMessage('The number of data to assign must be greater than zero.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        // Check if any of the selected employees belong to the 'verify' department
        const verifyDeptEmployees = selectedEmployees.filter(employeeId => {
            const employee = employees.find(emp => emp._id === employeeId);
            return employee.department === 'verify';
        });

        // Check if dataCount exceeds unassignedCount for non-verify departments only
        if (verifyDeptEmployees.length === 0 && dataCount > unassignedCount) {
            setSnackbarMessage('Cannot assign more data than unassigned data available.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const departments = selectedEmployees.map(employeeId => {
            const employee = employees.find(emp => emp._id === employeeId);
            return employee.department;
        });

        await dispatch(distributeData(selectedEmployees, dataCount, departments));
        dispatch(fetchDataCounts());

        setSnackbarMessage('Data successfully assigned.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    }, [dispatch, selectedEmployees, dataCount, employees, unassignedCount]);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const renderRow = useCallback(
        ({ index, style, data: employeesList }) => {
            const employee = employeesList[index];
            return (
                <ListItem style={style} key={employee._id} component="div" disablePadding>
                    <ListItemButton>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedEmployees.includes(employee._id)}
                                    onChange={() => handleCheckboxChange(employee._id)}
                                />
                            }
                            label={employee.name}
                        />
                    </ListItemButton>
                </ListItem>
            );
        },
        [selectedEmployees, handleCheckboxChange]
    );

    const activeEmployees = useMemo(() => employees.filter(employee => employee.status !== 'inactive'), [employees]);
    const verifyEmployees = useMemo(() => activeEmployees.filter(employee => employee.department === 'verify'), [activeEmployees]);
    const fleadEmployees = useMemo(() => activeEmployees.filter(employee => employee.department === 'flead'), [activeEmployees]);

    return (
        <Container>
            <Box textAlign="center" mb={4}>
                <Typography variant="h5" sx={{ textAlign: 'center' }} gutterBottom>Employee List</Typography>
                {loading || dataCountsLoading ? (
                     <CircularProgress />
                ) : error || dataCountsError ? (
                    <p>Error: {error || dataCountsError}</p>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            
                                <Typography variant="h6" sx={{ textAlign: 'center' }}>Verify Dept.</Typography>
                                <FixedSizeList
                                    height={300}
                                    width="100%"
                                    itemSize={46}
                                    itemCount={verifyEmployees.length}
                                    overscanCount={4}
                                    itemData={verifyEmployees}
                                >
                                    {renderRow}
                                </FixedSizeList>
                                </Grid>
                        <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ textAlign: 'center' }}>Flead Dept.</Typography>
                                <FixedSizeList
                                    height={300}
                                    width="100%"
                                    itemSize={46}
                                    itemCount={fleadEmployees.length}
                                    overscanCount={4}
                                    itemData={fleadEmployees}
                                >
                                    {renderRow}
                                </FixedSizeList>
                          
                        </Grid>
                    </Grid>
                )}
                <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={2}>
                    <input
                        type="number"
                        value={dataCount}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setDataCount(value >= 0 ? value : 0); // Prevent negative numbers
                        }}
                        placeholder="Number of data to Assign"
                        style={{ height: 32, padding: '0 8px' }}
                    />
                    <Button onClick={handleDistribute} variant="contained">
                        Assign To
                    </Button>
                </Box>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default React.memo(EmployeeListComponent);

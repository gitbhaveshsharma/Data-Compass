import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { fetchEmployees } from '../redux/employeeActions';
import { distributeData, fetchDataCounts, fetchAssignedData } from '../redux/dataActions';
import ListItem from '@mui/material/ListItem';
import { Grid, Card, Box, Typography } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const EmployeeListComponent = () => {
    const dispatch = useDispatch();
    const { employees, loading, error } = useSelector((state) => state.employees);
    const { data } = useSelector((state) => state.data);
    const assignedData = useSelector((state) => state.data.assignedData || {});
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [dataCount, setDataCount] = useState(0);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    useEffect(() => {
        if (employees.length > 0) {
            employees.forEach(employee => {
                dispatch(fetchAssignedData(employee._id));
            });
        }
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

    const handleDistribute = async () => {
        const departments = selectedEmployees.map(employeeId => {
            const employee = employees.find(emp => emp._id === employeeId);
            return employee.department;
        });
        await dispatch(distributeData(selectedEmployees, dataCount, departments));
        dispatch(fetchDataCounts());
    };

    const renderRow = useCallback(
        ({ index, style, employeesList }) => {
            const employee = employeesList[index];
            const count = assignedData[employee._id] ? assignedData[employee._id].length : 0;
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
                            label={`${employee.name} (${count})`}
                        />
                    </ListItemButton>
                </ListItem>
            );
        },
        [selectedEmployees, handleCheckboxChange, assignedData]
    );

    const verifyEmployees = employees.filter(employee => employee.department === 'Verify');
    const fleadEmployees = employees.filter(employee => employee.department === 'flead');

    return (
        <Container>
            <Box textAlign="center" mb={4}>
                <Typography variant="h5" sx={{ textAlign: 'center' }} gutterBottom>Employee List</Typography>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Typography variant="h6" sx={{ textAlign: 'center' }}> Verify Dept. </Typography>
                                <FixedSizeList
                                    height={300}
                                    width="100%"
                                    itemSize={46}
                                    itemCount={verifyEmployees.length}
                                    overscanCount={4}
                                    itemData={verifyEmployees}
                                >
                                    {({ index, style }) => renderRow({ index, style, employeesList: verifyEmployees })}
                                </FixedSizeList>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Typography variant="h6" sx={{ textAlign: 'center' }}> Flead Dept. </Typography>
                                <FixedSizeList
                                    height={300}
                                    width="100%"
                                    itemSize={46}
                                    itemCount={fleadEmployees.length}
                                    overscanCount={4}
                                    itemData={fleadEmployees}
                                >
                                    {({ index, style }) => renderRow({ index, style, employeesList: fleadEmployees })}
                                </FixedSizeList>
                            </Card>
                        </Grid>
                    </Grid>
                )}
                <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={2}>
                    <input
                        type="number"
                        value={dataCount}
                        onChange={(e) => setDataCount(Number(e.target.value))}
                        placeholder="Number of data to Assign"
                        style={{ height: 32, padding: '0 8px' }}
                    />
                    <Button onClick={handleDistribute} variant="contained">
                        Assign To
                    </Button>
                </Box>
                {data?.assignmentMessages && (
                    <Box mt={2}>
                        {data.assignmentMessages.map((message, index) => (
                            <p key={index}>{message}</p>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default EmployeeListComponent;

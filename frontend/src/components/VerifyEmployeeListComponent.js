import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { fetchEmployees } from '../redux/employeeActions';
import { fetchAssignedData, autoAssignData } from '../redux/dataActions';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

const VerifyEmployeeList = () => {
    const dispatch = useDispatch();
    const { employees, loading, error } = useSelector((state) => state.employees);
    const assignedData = useSelector((state) => state.data.assignedData || {});
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [dataCount, setDataCount] = useState(0);
    const [autoAssign, setAutoAssign] = useState(false);

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

    const handleAutoAssignToggle = () => {
        setAutoAssign(prev => !prev);
    };

    const handleDistribute = async () => {
        const departments = selectedEmployees.map(employeeId => {
            const employee = employees.find(emp => emp._id === employeeId);
            return employee.department;
        });
        await dispatch(autoAssignData('Verify', dataCount, departments));
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

    return (
        <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}> Verify Dept. </Typography>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
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
            )}
            <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={2}>
                <Switch
                    checked={autoAssign}
                    onChange={handleAutoAssignToggle}
                    inputProps={{ 'aria-label': 'Auto Assign' }}
                />
                <Typography variant="body1">Auto Assign</Typography>
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
        </Card>
    );
};

export default VerifyEmployeeList;

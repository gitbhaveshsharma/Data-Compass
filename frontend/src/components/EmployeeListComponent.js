// src/components/EmployeeListComponent.js
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { fetchEmployees } from '../redux/employeeActions';
import { distributeData, fetchDataCounts } from '../redux/dataActions';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const EmployeeListComponent = () => {
    const dispatch = useDispatch();
    const { employees, loading, error } = useSelector((state) => state.employees);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [dataCount, setDataCount] = useState(0);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleCheckboxChange = useCallback(
        (employeeId) => {
            setSelectedEmployees((prev) =>
                prev.includes(employeeId)
                    ? prev.filter((id) => id !== employeeId)
                    : [...prev, employeeId]
            );
        },
        [setSelectedEmployees]
    );

    const handleDistribute = () => {
        dispatch(distributeData(selectedEmployees, dataCount)).then(() => {
            dispatch(fetchDataCounts());
        });
    };

    const renderRow = useCallback(
        ({ index, style }) => {
            const employee = employees[index];
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
        [employees, selectedEmployees, handleCheckboxChange]
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2>Employee List</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ backgroundColor: "#d9e7ff", borderRadius: '10px', padding:10}}>
                        <FixedSizeList
                            height={390}
                            width={320}
                            itemSize={46}
                            itemCount={employees.length}
                            overscanCount={4}
                        >
                            {renderRow}
                                    </FixedSizeList>
                                    </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                            <input
                                type="number"
                                value={dataCount}
                                onChange={(e) => setDataCount(e.target.value)}
                                        placeholder="Number of data to Assigned"
                                style={{ height: 32, padding: '0 8px' }}
                            />
                            <Button onClick={handleDistribute} variant="contained">
                                Assign To
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeListComponent;

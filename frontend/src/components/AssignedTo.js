import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../redux/employeeActions';
import {
    TextField, Button, Card, CardContent, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box
} from '@mui/material';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';

const AssignedTo = ({ onAssign }) => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employees.employees);
    const [employeeId, setEmployeeId] = useState('');
    const [employeeInfo, setEmployeeInfo] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [message, setMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [inputError, setInputError] = useState(false);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleInputChange = (event) => {
        setEmployeeId(event.target.value);
        if (event.target.value !== '') {
            setInputError(false);
        }
    };

    const handleSearch = () => {
        if (employeeId === '') {
            setInputError(true);
            return;
        }

        const employee = employees.find((emp) => emp.employeeId === employeeId);
        if (employee) {
            setEmployeeInfo(employee);
        } else {
            setEmployeeInfo(null);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAssign = () => {
        if (employeeInfo) {
            onAssign(employeeInfo);
            setMessage('Assigned successfully!');
        } else {
            setMessage('Employee not found or department mismatch.');
        }
        setOpenDialog(false);
    };


    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h5">Assign To Employee</Typography>
                    <TextField
                        label="Enter Employee ID"
                        variant="outlined"
                        value={employeeId}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        error={inputError}
                        helperText={inputError ? 'Please enter employee ID' : ''}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Get Employee
                    </Button>
                    {employeeInfo && (
                        <div>
                            <Typography variant="h6">Employee Information</Typography>
                            {/* <Typography>ID: {employeeInfo._id}</Typography> */}
                            <Typography>Name: {employeeInfo.name}</Typography>
                            <Typography>Department: {employeeInfo.department}</Typography>
                            <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
                                Assign To
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <IconButton>
                            <AssignmentLateIcon style={{ fontSize: '10rem', color:'red' }} />
                        </IconButton>
                        <DialogTitle>Assign Employee</DialogTitle>
                        <Typography variant="h6">Do you want to assign {employeeInfo?.name}?</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAssign} color="secondary">
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AssignedTo;

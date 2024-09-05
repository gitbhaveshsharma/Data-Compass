import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, updateEmployee } from '../redux/employeeActions';
import { loadUser } from '../redux/authActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const departments = ['flead', 'verify', 'admin', 'rework', 'rto', 'logistics'];
const statuses = ['active', 'inactive'];

const EmployeeDetails = () => {
    const [employeeIdToFetch, setEmployeeIdToFetch] = useState('');
    const [filteredEmployee, setFilteredEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        employeeId: '',
        status: '',
    });

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const dispatch = useDispatch();
    const { employees, loading, error } = useSelector((state) => state.employees);

    const handleEmployeeIdChange = (e) => {
        const id = e.target.value;
        setEmployeeIdToFetch(id);

        // Filter the employee by ID from the fetched employees
        if (id && employees) {
            const foundEmployee = employees.find(emp => emp.employeeId === id);
            setFilteredEmployee(foundEmployee || null);
        } else {
            setFilteredEmployee(null);
        }
    };

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    useEffect(() => {
        if (filteredEmployee) {
            setFormData({
                name: filteredEmployee.name,
                email: filteredEmployee.email,
                password: '',
                department: filteredEmployee.department,
                employeeId: filteredEmployee.employeeId,
                status: filteredEmployee.status,
            });
        }
    }, [filteredEmployee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key] && key !== 'employeeId' && key !== 'password') {
                newErrors[key] = 'This field is required';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setMessage('Please fill in all required fields.');
            setSnackbarOpen(true);
            return;
        }

        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                department: formData.department,
                employeeId: formData.employeeId,
                status: formData.status,
            };

            let passwordChanged = false;
            if (formData.password) {
                userData.password = formData.password;
                passwordChanged = true;
            }

            await dispatch(updateEmployee(filteredEmployee._id, userData));
            setMessage('Employee details updated successfully!');
            setSnackbarOpen(true);

            if (passwordChanged) {
                setTimeout(() => {
                    dispatch(loadUser()); 
                }, 1000);
            }
        } catch (error) {
            setMessage('Update failed. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Typography component="h1" variant="h5">
                Fetch Employee Details
            </Typography>
            <TextField
                fullWidth
                id="employeeIdToFetch"
                label="Employee ID"
                name="employeeIdToFetch"
                value={employeeIdToFetch}
                onChange={handleEmployeeIdChange}
                sx={{ mt: 2, mb: 2 }}
            />
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h4" variant="h5">
                    Update Employee Details
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: errors.name ? 'red' : '',
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: errors.email ? 'red' : '',
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="password"
                                label="Password (Leave blank to keep current password)"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: errors.password ? 'red' : '',
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                required
                                fullWidth
                                id="department"
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                error={!!errors.department}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: errors.department ? 'red' : '',
                                        },
                                    },
                                }}
                            >
                                {departments.map((department) => (
                                    <MenuItem key={department} value={department}>
                                        {department}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                required
                                fullWidth
                                id="status"
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                error={!!errors.status}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: errors.status ? 'red' : '',
                                        },
                                    },
                                }}
                            >
                                {statuses.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="employeeId"
                                label="Employee ID (Optional)"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        Update Details
                    </Button>
                </Box>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={message.includes('successfully') ? 'success' : 'error'}>
                        {message}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default EmployeeDetails;

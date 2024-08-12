import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Avatar, Box, Snackbar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login } from '../redux/authActions';

const LoginPage = () => {
    const [formData, setFormData] = useState({ employeeId: '', password: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigateToDashboard();
        }
    }, [isAuthenticated, user]);

    const navigateToDashboard = () => {
        if (user?.role === 'admin') {
            navigate('/admin-dashboard');
        } else if (user?.role === 'employee') {
            switch (user?.department) {
                case 'flead':
                    navigate('/field-dashboard');
                    break;
                case 'verify':
                    navigate('/verify-dashboard');
                    break;
                case 'logistics':
                    navigate('/logistics-dashboard');
                    break;
                default:
                    navigate('/');
                    break;
            }
        } else {
            navigate('/');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setMessage('Please fill in all required fields.');
            return;
        }

        await dispatch(login(formData));
    };

    const handleClose = () => {
        setMessage('');
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 8,
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="employeeId"
                            label="Employee ID"
                            name="employeeId"
                            autoComplete="employeeId"
                            autoFocus
                            value={formData.employeeId}
                            onChange={handleChange}
                            error={!!errors.employeeId}
                            helperText={errors.employeeId}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: errors.employeeId ? 'red' : '',
                                    },
                                },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: errors.password ? 'red' : '',
                                    },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                    </Box>
                    {message && (
                        <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                            <Alert
                                onClose={handleClose}
                                severity={message.includes('successful') ? 'success' : 'error'}
                                sx={{ width: '100%' }}
                            >
                                {message}
                            </Alert>
                        </Snackbar>
                    )}
                </Box>
            </Container>
            <Typography
                variant="body2"
                align="center"
                sx={{ fontSize: '15px', padding: '8px 0', mt: '20px', color: '#b5b5b5' }}
            >
                This product is under development and test. If you are experiencing problems, please reach out to the admin.
                <br />
                All rights reserved © SevenZin
            </Typography>
        </>
    );
};

export default LoginPage;

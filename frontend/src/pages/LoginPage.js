import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Avatar, Box, Snackbar, Alert, Card } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login } from '../redux/authActions';

const LoginPage = () => {
    const [formData, setFormData] = useState({ employeeId: '', password: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigateToDashboard();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (error) {
            setMessage(error);
        }
    }, [error]);

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
                case 'rework':
                    navigate('/rework-dashboard');
                    break;
                case 'rto':
                    navigate('/rto-dashboard');
                    break;
                case 'IT':
                    navigate('/IT-dashboard');
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
                <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 3,
                        marginTop: 8,
                        boxShadow: 3,
                        backgroundColor: 'white',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 50, height: 50 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h4">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                </Card>
            </Container>
            <Box sx={{
                padding: '1rem',
                marginTop: 'auto',
                textAlign: 'center',
            }}>
                <Typography variant="body2">
                    This product is under development and test. If you are having problems, please reach out to the admin.
                </Typography>
                <Typography variant="body2">
                    All rights reserved © SevenZin
                </Typography>
            </Box>
        </>
    );
};

export default LoginPage;

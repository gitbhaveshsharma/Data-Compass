import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Box, Container, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authActions';
import { fetchEmployeeByEmployeeId } from '../redux/employeeActions';

const Header = ({ title }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.employeeId : '';
    const { employee, loading, error } = useSelector((state) => state.employees);

    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (employeeId && anchorEl) {
            dispatch(fetchEmployeeByEmployeeId(employeeId));
        }
    }, [employeeId, anchorEl, dispatch]);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleMenuClose();
    };

    // Define status colors
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'online':
                return '#90ee90'; // light green for online
            case 'offline':
                return '#d3d3d3'; // light gray for offline
            case 'away':
                return '#ffa500'; // orange for away
            default:
                return '#808080'; // gray for unknown statuses
        }
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#621f88', top: 0 }} elevation={3}>
            <Container maxWidth={false} sx={{ paddingLeft: 0, paddingRight: 0 }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="inherit">
                        SevenZin: {title}
                    </Typography>
                    <IconButton onClick={handleAvatarClick}>
                        <Avatar
                            alt={user?.name}
                            src={user?.avatarUrl || '/static/images/avatar/1.jpg'}
                            sx={{
                                border: `3px solid ${employee ? getStatusColor(employee.status) : 'transparent'}`,
                            }}
                        />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            elevation: 3,
                            sx: { mt: 1.5, minWidth: 200 },
                        }}
                    >
                        {loading && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                                <CircularProgress />
                            </Box>
                        )}
                        {error && (
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2" color="error">
                                    Error: {error}
                                </Typography>
                            </Box>
                        )}
                        {employee && (
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body1" color="inherit">
                                    Name: {employee.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Employee Id: {employee.employeeId}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Status:
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                                        {employee.status}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: getStatusColor(employee.status),
                                            marginRight: 1,
                                            ml: 1
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    Email: {employee.email}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Department: {employee.department}
                                </Typography>
                            </Box>
                        )}
                        <MenuItem onClick={handleLogout} sx={{ display: 'flex', justifyContent: 'center' }}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;

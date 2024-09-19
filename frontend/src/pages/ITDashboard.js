import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIPs, registerIP, updateIP, deleteIP, toggleIPStatus } from '../redux/ipActions';
import {
    Container,
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Snackbar,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

const ITDepartmentPage = () => {
    const dispatch = useDispatch();
    const { ips } = useSelector((state) => state.ips);
    const [newIP, setNewIP] = useState({ ip: '', name: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentIP, setCurrentIP] = useState(null);
    const [errors, setErrors] = useState({ ip: '', name: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        dispatch(fetchIPs());
    }, [dispatch]);

    const validateFields = () => {
        let isValid = true;
        const newErrors = { ip: '', name: '' };

        if (!newIP.ip.trim()) {
            newErrors.ip = 'IP Address is required';
            isValid = false;
        }

        if (!newIP.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegisterOrUpdate = () => {
        if (validateFields()) {
            if (editMode) {
                dispatch(updateIP(currentIP.ip, newIP));
                setSnackbarMessage('IP updated successfully.');
            } else {
                dispatch(registerIP(newIP));
                setSnackbarMessage('IP registered successfully.');
            }

            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            resetForm();
        }
    };
    const handleToggleStatus = (ip) => {
        // Determine the new status based on the current status
        const newStatus = ip.status === 'active' ? 'inactive' : 'active';

        // Dispatch the action to toggle status with the new status
        dispatch(toggleIPStatus(ip.ip, newStatus));

        setSnackbarMessage('IP status updated successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };
    const handleEdit = (ip) => {
        setEditMode(true);
        setCurrentIP(ip);
        setNewIP({ ip: ip.ip, name: ip.name });
        setErrors({ ip: '', name: '' }); // Clear any previous errors
    };

    const handleDelete = (ip) => {
        if (!ip || !ip.ip) {
            // console.error('IP object or IP address is missing:', ip); // Debugging log
            return;
        }
        dispatch(deleteIP(ip.ip)); // Correctly pass the IP address
        setSnackbarMessage('IP deleted successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };


    const resetForm = () => {
        setNewIP({ ip: '', name: '' });
        setEditMode(false);
        setCurrentIP(null);
        setErrors({ ip: '', name: '' });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Box sx={{ height: '75vh' }}>
                <Typography variant="h4" gutterBottom>
                    IT Department - Manage IP Addresses
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: '16px' }}>
                            <Typography variant="h6">Register or Update IP</Typography>
                            <TextField
                                label="IP Address"
                                value={newIP.ip}
                                onChange={(e) => setNewIP({ ...newIP, ip: e.target.value })}
                                fullWidth
                                margin="normal"
                                helperText={errors.ip}
                                error={!!errors.ip}
                            />
                            <TextField
                                label="Name"
                                value={newIP.name}
                                onChange={(e) => setNewIP({ ...newIP, name: e.target.value })}
                                fullWidth
                                margin="normal"
                                helperText={errors.name}
                                error={!!errors.name}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRegisterOrUpdate}
                                sx={{ marginTop: '16px' }}
                            >
                                {editMode ? 'Update IP' : 'Add IP'}
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: '16px', position: 'relative' }}>
                            <Tooltip title="You granted access to this IP to operate with data" placement="top">
                                <InfoIcon sx={{ position: 'absolute', top: 8, right: 8 }} />
                            </Tooltip>
                            <Typography variant="h6">Manage IPs</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>IP Address</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {ips.map((ip) => (
                                            <TableRow key={ip.ip}>
                                                <TableCell>{ip.ip}</TableCell>
                                                <TableCell>{ip.name}</TableCell>
                                                <TableCell>{ip.status === 'active' ? 'Allowed' : 'Blocked'}</TableCell>                                                <TableCell>
                                                    <IconButton color="primary" onClick={() => handleEdit(ip)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton color="secondary" onClick={() => handleDelete(ip)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <Button
                                                        variant="contained"
                                                        color={ip.status === 'active' ? 'success' : 'warning'}
                                                        onClick={() => handleToggleStatus(ip)}
                                                    >
                                                        {ip.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Snackbar for feedback messages */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default ITDepartmentPage;

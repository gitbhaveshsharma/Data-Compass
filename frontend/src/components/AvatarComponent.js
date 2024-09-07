import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, CircularProgress, Box } from '@mui/material';
import { fetchEmployeeByEmployeeId } from '../redux/employeeActions';

// Function to generate a random hex color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const stringAvatar = (name = '', color) => {
    if (!name) {
        return {
            children: '',
        };
    }

    const words = name.split(' ');

    let initials = '';
    if (words.length === 1) {
        initials = words[0][0] ? words[0][0].toUpperCase() : '';
        initials += words[0][1] ? words[0][1].toUpperCase() : '';
    } else {
        initials = words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }

    return {
        children: initials,
    };
};

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'online':
            return '#90ee90';
        case 'offline':
            return '#d3d3d3';
        case 'away':
            return '#ffa500';
        default:
            return '#808080';
    }
};

const AvatarComponent = ({ avatarUrl }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const employeeId = user ? user.employeeId : '';
    const { employee, loading } = useSelector((state) => state.employees);

    useEffect(() => {
        if (employeeId) {
            dispatch(fetchEmployeeByEmployeeId(employeeId));
        }
    }, [employeeId, dispatch]);

    const avatarColor = getRandomColor();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Avatar
            {...stringAvatar(employee?.name || 'User')}
            src={avatarUrl}
            sx={{
                bgcolor: avatarColor,
                border: `3px solid ${getStatusColor(employee?.status)}`,
                fontWeight: 800,
                width: 50, 
                height: 50, 
            }}
        />
    );
};

export default AvatarComponent;

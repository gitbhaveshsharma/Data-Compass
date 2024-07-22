import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { logout } from '../redux/authActions';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Button color="secondary" variant="contained" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default Logout;

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import { logout } from '../redux/authActions';
import { recordHistory } from '../redux/historyActions';
import { updateEmployee } from '../redux/employeeActions';

const Logout = ({ employeeId, id}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle manual logout
    const handleLogout = async (type = 'manual-logout') => {
        try {
            console.log(`Logging out employeeId: ${employeeId} with type: ${type}`);
            if (type === 'manual-logout' || 'inactivity-logout') {
                await dispatch(updateEmployee(id, { status: 'offline' }));
            }
            await dispatch(recordHistory({
                employeeId: employeeId,  
                type,  
            }));
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            // console.error('Error during logout:', error);
        }
    };

    // Set up auto-logout and inactivity logout
    useEffect(() => {
        // Auto-logout after 2 hours
        const autoLogoutTimer = setTimeout(() => {
            // console.log(`Auto-logout triggered for employeeId: ${employeeId}`);
            handleLogout('auto-logout');
        }, 12 * 60 * 60 * 1000); // 12 hours

        // Inactivity logout after 20 minutes
        let inactivityTimer;
        const resetInactivityTimer = () => {
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
            }
            inactivityTimer = setTimeout(() => {
                // console.log(`Inactivity-logout triggered for employeeId: ${employeeId}`);
                handleLogout('inactivity-logout');
            }, 20 * 60 * 1000); // 20 minutes
        };

        // Event listeners for resetting inactivity timer
        window.addEventListener('mousemove', resetInactivityTimer);
        window.addEventListener('keydown', resetInactivityTimer);

        // Initialize the inactivity timer
        resetInactivityTimer();

        // Cleanup on component unmount
        return () => {
            clearTimeout(autoLogoutTimer);
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
            }
            window.removeEventListener('mousemove', resetInactivityTimer);
            window.removeEventListener('keydown', resetInactivityTimer);
        };
    }, [employeeId]);

    return (
        <Typography
            variant="body2"
            align="center"
            sx={{ fontSize: '15px', padding: '8px 0', mt: '20px', color: '#b5b5b5' }}
        >
            This product is under development and test. If you are having problems, please reach out to the admin.
            <Link
                component="button"
                onClick={() => handleLogout('manual-logout')}
                sx={{ fontSize: '15px', padding: '0 4px' }}
            >
                Click here to logout
            </Link>
            : All rights reserved © SevenZin
        </Typography>
    );
};

export default Logout;

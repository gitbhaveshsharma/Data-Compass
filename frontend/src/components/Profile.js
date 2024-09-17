import React, { useEffect } from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeByEmployeeId } from '../redux/employeeActions';
import AvatarComponent from './AvatarComponent';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const employeeId = user ? user.employeeId : '';
  const { employee, loading, error } = useSelector((state) => state.employees);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeByEmployeeId(employeeId));
    }
  }, [employeeId, dispatch]);

  return (
    <Box
      sx={{
        height: '70vh', // Set height to 90vh
        display: 'flex',
        alignItems: 'center', // Center vertically
        justifyContent: 'center', // Center horizontally
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <AvatarComponent
            avatarUrl={employee?.avatarUrl || '/static/images/avatar/1.jpg'}
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
            Error: {error}
          </Typography>
        )}
        {employee && (
          <>
            <Typography variant="h5" align="center" sx={{ mb: 1, fontWeight: 'bold' }}>
              {employee?.name}
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 1 }}>
              Employee ID: {employee?.employeeId}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1" color="textSecondary" sx={{ mr: 0.5 }}>
                Status:
              </Typography>
              <Typography variant="body1" color="textPrimary">
                {employee?.status}
              </Typography>
            </Box>
            <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 1 }}>
              Email: {employee?.email}
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary">
              Department: {employee?.department}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;

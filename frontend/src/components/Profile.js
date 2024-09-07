import React, { useEffect } from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeByEmployeeId } from '../redux/employeeActions';
import LogOut from '../components/Logout';
import AvatarComponent from './AvatarComponent'

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
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, margin: '0 auto', mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <AvatarComponent avatarUrl={employee?.avatarUrl || '/static/images/avatar/1.jpg'}  />
      </Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2  }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography variant="body2" color="error">
          Error: {error}
        </Typography>
      )}
      {employee && (
        <>
          <Typography variant="h6" align="center">
            {employee?.name}
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary">
            Employee Id: {employee?.employeeId}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Status:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
              {employee?.status}
            </Typography>
          </Box>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 1 }}>
            Email: {employee?.email}
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 1 }}>
            Department: {employee?.department}
          </Typography>
        </>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <LogOut employeeId={user?.employeeId} id={user?.id} />
      </Box>
    </Paper>
  );
};

export default Profile;

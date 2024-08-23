import React, { useState, useEffect } from 'react';
import { IconButton, Avatar, Menu,  Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeByEmployeeId } from '../redux/employeeActions';
import LogOut from '../components/Logout';

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

  const words = name.split(' '); // Split name by space to get the words

  let initials = '';
  if (words.length === 1) {
    // If there's only one word, use the first two letters
    initials = words[0][0] ? words[0][0].toUpperCase() : '';
    initials += words[0][1] ? words[0][1].toUpperCase() : '';
  } else {
    // If there are multiple words, use the first letter of the first two words
    initials = words[0][0].toUpperCase() + words[1][0].toUpperCase();
  }

  return {
    children: initials,
  };
};

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const employeeId = user ? user.employeeId : '';
  console.log(user?.id)
  const { employee, loading, error } = useSelector((state) => state.employees);

  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [avatarColor, setAvatarColor] = useState(getRandomColor()); // State to hold random color

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
    <>
      <IconButton onClick={handleAvatarClick}>
        <Avatar
          {...stringAvatar(user?.employeeId || 'User')}
          src={employee?.avatarUrl || '/static/images/avatar/1.jpg'}
          sx={{
            bgcolor: avatarColor, // Set random background color here
            border: `3px solid ${employee ? getStatusColor(employee.status) : 'transparent'}`,
            fontWeight:800,
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
                  ml: 1,
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
        <Box sx={{ display: 'flex', justifyContent: 'center', p:1}}>
          <LogOut employeeId={user?.employeeId} id={user?.id} />
        </Box>
      </Menu>
    </>
  );
};

export default Profile;

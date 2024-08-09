import React, { useEffect, useState } from 'react';
import { IconButton, Avatar, Dialog, DialogTitle, DialogContent, Typography, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeByEmail } from '../redux/employeeActions'; // Adjust the path as needed
import LogOut from './Logout';

const Profile = ({ email }) => {
  const dispatch = useDispatch();
  const { employee, loading, error } = useSelector((state) => state.employee); // Adjust according to your state
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (email) {
      dispatch(fetchEmployeeByEmail(email));
    }
  }, [dispatch, email]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) return <Typography> Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <IconButton onClick={handleClickOpen} style={{ margin: 8, backgroundColor: '#1976d2' }}>
        <Avatar>
          <AccountCircleIcon />
        </Avatar>
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ textAlign: 'center' }}>Profile Details</DialogTitle>
        <DialogContent style={{ padding: 16 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Name: {employee?.name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Email: {employee?.email || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Employee ID: {employee?.employeeID || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Department: {employee?.department || 'N/A'}</Typography>
            </Grid>
          </Grid>
          <LogOut />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;

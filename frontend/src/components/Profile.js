import React, { useState } from 'react';
import { IconButton, Avatar, Dialog, DialogTitle, DialogContent, Typography, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogOut from './Logout';

const Profile = ({ name = 'N/A', email = 'N/A', employeeID = 'N/A', department='N/A' }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
              <Typography variant="h6">Name: {name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Email: {email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Employee ID: {employeeID}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Department: {department}</Typography>
            </Grid>
          </Grid>
          <LogOut/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;

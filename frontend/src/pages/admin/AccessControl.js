import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Stack, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import AddLinkIcon from '@mui/icons-material/AddLink';
import SendIcon from '@mui/icons-material/Send';
import { register, deleteIp, fetchIpAddresses , updateIp} from '../../redux/accessActions'; // Ensure correct import

const AccessControl = () => {
  const [open, setOpen] = useState(false);
  const [selectedIP, setSelectedIP] = useState([]);
  const ipAddresses = useSelector((state) => state.ipAccess.ipAddresses);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIpAddresses());
  }, [dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBlockIP = (e) => {
    e.preventDefault();
    if (selectedIP.length > 0) {
      selectedIP.forEach((ip) => {
        dispatch(updateIp( { id : ip._id, status: "Block" }));
      });
    }
  };

  const handleDeleteIP = (e) => {
    e.preventDefault();
    console.log(selectedIP)
    if (selectedIP.length > 0) {
      selectedIP.forEach((ip) => {
        dispatch(deleteIp(ip._id));
      });
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    dispatch(register(formJson));
    handleClose();
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 120, }, // Hidden ID column
    { field: 'IPAddress', headerName: 'IP Address', width: 180 },
    { field: 'name', headerName: 'Employee Name', width: 200 },
    { field: 'status', headerName: 'Status', width: 200 },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "75vh", gap: 5 }}>
      <Paper sx={{ height: 400, width: ['max-content', 'max-content', "60%"], alignContent: "center" }}>
        <DataGrid
          rows={ipAddresses}
          columns={columns}
          getRowId={(row) => row?._id} 
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={(selectionModel) => {
            const selectedIDs = new Set(selectionModel);
            const selectedData = ipAddresses.filter((row) => selectedIDs.has(row._id));
            setSelectedIP(selectedData);
            console.log("Selected IPs:", selectedData);
          }}
          rowSelectionModel={selectedIP.map(ip => ip._id)} // Ensure this matches the selected rows
          columnVisibilityModel={{
            _id: false,
          }}
        />
      </Paper>
      <Stack direction='row' spacing={3} alignContent="center">
        <Button variant='outlined' startIcon={<AddLinkIcon />} onClick={handleClickOpen}>Add</Button>
        <Button variant='outlined' startIcon={<BlockIcon />} onClick={handleBlockIP}>Block</Button>
        <Button variant="outlined" startIcon={<DeleteIcon />} color='error' onClick={handleDeleteIP}>Delete</Button>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle fontWeight={540}>Add New IP Address</DialogTitle>
        <DialogContent>
          <DialogContentText>To add IP, please enter new IP address here. By adding IP you allow the user to access your platform...</DialogContentText>
          <TextField
            fullWidth
            autoFocus
            required
            margin="dense"
            id="name"
            name="IPAddress"
            label="IP Address"
            variant="standard"
          />
          <TextField
            fullWidth
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Employee Name"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" endIcon={<SendIcon />}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccessControl;

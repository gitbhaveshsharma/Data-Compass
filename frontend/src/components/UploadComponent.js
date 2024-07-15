import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadExcel } from '../redux/uploadActions';
import { fetchDataCounts } from '../redux/dataActions';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

const VisuallyHiddenInput = styled('input')({
    display: 'none',
});

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // Added success state
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const { message, duplicateCount } = useSelector(state => state.admin);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        dispatch(uploadExcel(file)).then(() => {
            dispatch(fetchDataCounts());
            setFile(null);  // Reset the file state
            setSuccess(true); // Show success message
            fileInputRef.current.value = null;  // Reset the file input
        });
    };

    const handleClose = () => {
        setError('');
        setSuccess(false); // Ensure success state is reset
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleRemoveFile = () => {
        setFile(null);
        fileInputRef.current.value = null;
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, md: 5 },
            }}
        >
            <Typography variant="h5" sx={{ mb: 2 }}>
                Drop file to upload
            </Typography>
            <Box
                sx={{
                    border: '2px dashed grey',
                    borderRadius: '8px',
                    width: { xs: '100%', sm: '100%' },
                    height: '155px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    position: 'relative',
                    cursor: 'pointer',
                    flexDirection: 'column',
                    textAlign: 'center',
                }}
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
                {file ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="body1">{file.name}</Typography>
                        <IconButton size="small" onClick={handleRemoveFile}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ) : (
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'grey' }} />
                )}
            </Box>
            <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={handleUpload}
            >
                Upload file
            </Button>
            {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            )}
            {success && (
                <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        {message} {duplicateCount} duplicate entries were not stored.
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default UploadComponent;

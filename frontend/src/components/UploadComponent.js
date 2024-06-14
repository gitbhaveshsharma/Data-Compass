// src/components/UploadComponent.js
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { uploadExcel } from '../redux/uploadActions';
import { fetchDataCounts } from '../redux/dataActions';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

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
            setSuccess(true);  // Show success message
            fileInputRef.current.value = null;  // Reset the file input
        });
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleClose = () => {
        setError('');
        setSuccess(false);
    };

    return (
        <div>
            <h2>Data Upload</h2>
            {file && <p>Selected file: {file.name}</p>}
            <input type="file" onChange={handleFileChange} ref={fileInputRef}  />
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                onClick={handleUpload}
            >
                Upload
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
                        File uploaded successfully!
                    </Alert>
                </Snackbar>
            )}
        </div>
    );
};

export default UploadComponent;

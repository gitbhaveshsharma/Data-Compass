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
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const VisuallyHiddenInput = styled('input')({
    display: 'none',
});

const validHeaders = ['Name', 'Number', 'Address', 'City', 'State', 'Zip', 'NearBy', 'Area', 'AltNumber'];

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const { message, duplicateCount } = useSelector(state => state.admin);

    const validateFile = (file) => {
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.csv')) {
            // Handle CSV file
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    const headers = results.meta.fields;
                    if (headers.length !== validHeaders.length || !headers.every(header => validHeaders.includes(header))) {
                        setError('Invalid file format or structure. Please upload the correct file.');
                        return false;
                    }
                    setError('');
                    return true;
                },
                error: () => {
                    setError('Error reading the CSV file.');
                    return false;
                }
            });
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            // Handle Excel file
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

                if (headers.length !== validHeaders.length || !headers.every(header => validHeaders.includes(header))) {
                    setError('Invalid file format or structure. Please upload the correct file.');
                    return false;
                }
                setError('');
                return true;
            };
            reader.readAsArrayBuffer(file);
        } else {
            setError('Unsupported file type. Please upload a CSV or Excel file.');
            return false;
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        validateFile(selectedFile);
    };

    const handleUpload = () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        if (validateFile(file)) {
            dispatch(uploadExcel(file)).then(() => {
                dispatch(fetchDataCounts());
                setFile(null);
                setSuccess(true);
                fileInputRef.current.value = null;
            });
        }
    };

    const handleClose = () => {
        setError('');
        setSuccess(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        validateFile(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleRemoveFile = () => {
        setFile(null);
        fileInputRef.current.value = null;
    };

    const handleDownloadTemplate = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([validHeaders]);
        XLSX.utils.book_append_sheet(wb, ws, 'Template');
        XLSX.writeFile(wb, 'template.xlsx');
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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleUpload}
                >

                    Upload file
                </Button>
                <Tooltip title="Download template" arrow>
                    <IconButton
                        onClick={handleDownloadTemplate}
                        sx={{ ml: 2 }}
                    >
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
            </Box>
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

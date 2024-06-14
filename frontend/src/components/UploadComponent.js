// src/components/UploadComponent.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadExcel } from '../redux/uploadActions';

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            dispatch(uploadExcel(file));
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadComponent;

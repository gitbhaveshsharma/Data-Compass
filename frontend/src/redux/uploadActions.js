// src/redux/uploadActions.js
import axios from 'axios';

export const uploadExcel = (file) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post('http://localhost:3001/api/upload', formData);

        dispatch({ type: 'UPLOAD_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'UPLOAD_FAIL', payload: error.message });
    }
};

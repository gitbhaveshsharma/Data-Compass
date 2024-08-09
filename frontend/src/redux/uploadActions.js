import axios from 'axios';

// Environment variable for the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Function to get authentication headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Upload Excel action
export const uploadExcel = (file) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(`${API_BASE_URL}/upload`, formData, getAuthHeaders());

        dispatch({ type: 'UPLOAD_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'UPLOAD_FAIL', payload: error.message });
    }
};

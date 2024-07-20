// src/redux/employeeActions.js
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

export const fetchEmployees = () => async (dispatch) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/employees`, getAuthHeaders());
        dispatch({ type: 'FETCH_EMPLOYEES_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'FETCH_EMPLOYEES_FAIL', payload: error.message });
    }
};

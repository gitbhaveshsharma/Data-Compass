// actions/historyActions.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const recordHistory = (historyData) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/history/login`, historyData, getAuthHeaders());
        dispatch({ type: 'RECORD_HISTORY_SUCCESS', payload: response.data });
        return Promise.resolve(response.data);
    } catch (error) {
        if (error.response) {
            // console.log('Response error:', error.response.data);
            dispatch({ type: 'RECORD_HISTORY_FAILURE', payload: error.response.data.message || error.message });
        } else if (error.request) {
            // console.log('Request error:', error.request);
            dispatch({ type: 'RECORD_HISTORY_FAILURE', payload: 'No response received from the server.' });
        } else {
            // console.log('Error:', error.message);
            dispatch({ type: 'RECORD_HISTORY_FAILURE', payload: error.message });
        }
        return Promise.reject(error.message);
    }
};

export const fetchHistory = (employeeId) => async (dispatch) => {
    dispatch({ type: 'FETCH_HISTORY_REQUEST' });

    try {
        const response = await axios.get(`${API_BASE_URL}/history/${employeeId}`, getAuthHeaders());
        dispatch({ type: 'FETCH_HISTORY_SUCCESS', payload: response.data });
    } catch (error) {
        if (error.response) {
            dispatch({ type: 'FETCH_HISTORY_FAILURE', payload: error.response.data.message || error.message });
        } else if (error.request) {
            dispatch({ type: 'FETCH_HISTORY_FAILURE', payload: 'No response received from the server.' });
        } else {
            dispatch({ type: 'FETCH_HISTORY_FAILURE', payload: error.message });
        }
    }
};

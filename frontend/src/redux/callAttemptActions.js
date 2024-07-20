import axios from 'axios';

// Constants for action types
export const FETCH_CALL_ATTEMPTS_REQUEST = 'FETCH_CALL_ATTEMPTS_REQUEST';
export const FETCH_CALL_ATTEMPTS_SUCCESS = 'FETCH_CALL_ATTEMPTS_SUCCESS';
export const FETCH_CALL_ATTEMPTS_FAILURE = 'FETCH_CALL_ATTEMPTS_FAILURE';
export const CREATE_CALL_ATTEMPT_SUCCESS = 'CREATE_CALL_ATTEMPT_SUCCESS';
export const UPDATE_CALL_ATTEMPT_SUCCESS = 'UPDATE_CALL_ATTEMPT_SUCCESS';
export const DELETE_CALL_ATTEMPT_SUCCESS = 'DELETE_CALL_ATTEMPT_SUCCESS';

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

// Fetch call attempts action
export const fetchCallAttempts = (dataId) => async (dispatch) => {
    dispatch({ type: FETCH_CALL_ATTEMPTS_REQUEST });
    try {
        console.log(`Fetching call attempts for dataId: ${dataId}`); // Debug log
        const response = await axios.get(`${API_BASE_URL}/callAttempts/data/${dataId}`, getAuthHeaders());
        console.log('Fetch call attempts response:', response.data); // Debug log
        dispatch({ type: FETCH_CALL_ATTEMPTS_SUCCESS, payload: response.data });
    } catch (error) {
        console.error('Fetch call attempts error:', error.message); // Debug log
        dispatch({ type: FETCH_CALL_ATTEMPTS_FAILURE, payload: error.message });
    }
};

// Create call attempt action
export const createCallAttempt = (callAttempt) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/callAttempts`, callAttempt, getAuthHeaders());
        dispatch({ type: CREATE_CALL_ATTEMPT_SUCCESS, payload: response.data });
    } catch (error) {
        console.error('Create failed:', error.response.data.message);
        throw error.response.data.message;
    }
};

// Update call attempt action
export const updateCallAttempt = (id, callAttempt) => async (dispatch) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/callAttempts/${id}`, callAttempt, getAuthHeaders());
        dispatch({ type: UPDATE_CALL_ATTEMPT_SUCCESS, payload: response.data });
    } catch (error) {
        console.error('Update failed:', error);
    }
};

// Delete call attempt action
export const deleteCallAttempt = (id) => async (dispatch) => {
    try {
        await axios.delete(`${API_BASE_URL}/callAttempts/${id}`, getAuthHeaders());
        dispatch({ type: DELETE_CALL_ATTEMPT_SUCCESS, payload: id });
    } catch (error) {
        console.error('Delete failed:', error);
    }
};
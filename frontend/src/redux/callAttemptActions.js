import axios from 'axios';

export const FETCH_CALL_ATTEMPTS_REQUEST = 'FETCH_CALL_ATTEMPTS_REQUEST';
export const FETCH_CALL_ATTEMPTS_SUCCESS = 'FETCH_CALL_ATTEMPTS_SUCCESS';
export const FETCH_CALL_ATTEMPTS_FAILURE = 'FETCH_CALL_ATTEMPTS_FAILURE';
export const CREATE_CALL_ATTEMPT_SUCCESS = 'CREATE_CALL_ATTEMPT_SUCCESS';
export const UPDATE_CALL_ATTEMPT_SUCCESS = 'UPDATE_CALL_ATTEMPT_SUCCESS';
export const DELETE_CALL_ATTEMPT_SUCCESS = 'DELETE_CALL_ATTEMPT_SUCCESS';

export const fetchCallAttempts = (dataId) => async (dispatch) => {
    dispatch({ type: FETCH_CALL_ATTEMPTS_REQUEST });
    try {
        console.log(`Fetching call attempts for dataId: ${dataId}`); // Debug log
        const response = await axios.get(`http://localhost:3001/api/callAttempts/data/${dataId}`);
        console.log('Fetch call attempts response:', response.data); // Debug log
        dispatch({ type: FETCH_CALL_ATTEMPTS_SUCCESS, payload: response.data });
    } catch (error) {
        console.error('Fetch call attempts error:', error.message); // Debug log
        dispatch({ type: FETCH_CALL_ATTEMPTS_FAILURE, payload: error.message });
    }
};


export const createCallAttempt = (callAttempt) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:3001/api/callAttempts', callAttempt);
        dispatch({ type: 'CREATE_CALL_ATTEMPT_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Create failed:', error.response.data.message);
        throw error.response.data.message;
    }
};

export const updateCallAttempt = (id, callAttempt) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:3001/api/callAttempts/${id}`, callAttempt);
        dispatch({ type: UPDATE_CALL_ATTEMPT_SUCCESS, payload: response.data });
    } catch (error) {
        console.error('Update failed:', error);
    }
};

export const deleteCallAttempt = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:3001/api/callAttempts/${id}`);
        dispatch({ type: DELETE_CALL_ATTEMPT_SUCCESS, payload: id });
    } catch (error) {
        console.error('Delete failed:', error);
    }
};

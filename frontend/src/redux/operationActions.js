// src/redux/operationActions.js
import axios from 'axios';

export const fetchDataById = (id) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/data/${id}`);
        dispatch({ type: 'FETCH_DATA_BY_ID_SUCCESS', payload: response.data });
        console.log('Fetched data ID:', response.data);
    } catch (error) {
        dispatch({ type: 'FETCH_DATA_BY_ID_FAILURE', error: error.message });
    }
};

export const updateData = (id, data) => async (dispatch) => {
    try {
        console.log(`Updating data for ID: ${id}`);
        const response = await axios.put(`http://localhost:3001/api/data/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Data updated:', response.data);
        dispatch({ type: 'UPDATE_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Failed to update data:', error);
        dispatch({ type: 'UPDATE_DATA_FAILURE', error: error.message });
    }
};

export const orderData = (id) => async (dispatch) => {
    try {
        const response = await axios.post(`http://localhost:3001/api/data/${ id }/order`, { id });
        dispatch({ type: 'ORDER_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'ORDER_DATA_FAILURE', error: error.message });
    }
};

export const cancelData = (id) => async (dispatch) => {
    try {
        const response = await axios.post(`http://localhost:3001/api/data/${id }/cancel`, { id });
        dispatch({ type: 'CANCEL_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'CANCEL_DATA_FAILURE', error: error.message });
    }
};

export const callbackData = (id) => async (dispatch) => {
    try {
        const response = await axios.post(`http://localhost:3001/api/data/${id }/callback`, { id });
        dispatch({ type: 'CALLBACK_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'CALLBACK_DATA_FAILURE', error: error.message });
    }
};



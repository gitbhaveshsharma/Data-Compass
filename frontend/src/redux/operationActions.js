import axios from 'axios';

export const fetchDataById = (id) => async (dispatch) => {
    try {
        console.log(`Fetching data with ID: ${id}`);
        const response = await axios.get(`http://localhost:3001/api/data/${id}`);
        console.log('Fetched data:', response.data);
        dispatch({ type: 'FETCH_DATA_BY_ID_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Fetch data failed:', error);
        dispatch({ type: 'FETCH_DATA_BY_ID_FAILURE', error: error.message });
    }
};

export const updateData = (id, data) => async (dispatch) => {
    try {
        // console.log(`Updating data with ID: ${id}, Data:`, data);
        const response = await axios.put(`http://localhost:3001/api/data/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // console.log('Data updated:', response.data);
        dispatch({ type: 'UPDATE_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Update data failed:', error);
        dispatch({ type: 'UPDATE_DATA_FAILURE', error: error.message });
    }
};

export const orderData = (id, orderDetails) => async (dispatch) => {
    try {
        // console.log(`Placing order with ID: ${id}, Order Details:`, orderDetails);
        const response = await axios.post(`http://localhost:3001/api/data/${id}/order`, orderDetails, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // console.log('Order placed:', response.data);
        dispatch({ type: 'ORDER_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Order data failed:', error);
        dispatch({ type: 'ORDER_DATA_FAILURE', error: error.message });
    }
};

export const cancelData = (id) => async (dispatch) => {
    try {
        console.log(`Cancelling order with ID: ${id}`);
        const response = await axios.post(`http://localhost:3001/api/data/${id}/cancel`, { id });
        console.log('Order canceled:', response.data);
        dispatch({ type: 'CANCEL_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Cancel data failed:', error);
        dispatch({ type: 'CANCEL_DATA_FAILURE', error: error.message });
    }
};

export const callbackData = (id) => async (dispatch) => {
    try {
        console.log(`Requesting callback with ID: ${id}`);
        const response = await axios.post(`http://localhost:3001/api/data/${id}/callback`, { id });
        console.log('Callback requested:', response.data);
        dispatch({ type: 'CALLBACK_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Callback request failed:', error);
        dispatch({ type: 'CALLBACK_DATA_FAILURE', error: error.message });
    }
};

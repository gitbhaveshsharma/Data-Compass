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


export const fetchDataById = (id) => async (dispatch) => {
    try {
        console.log(`Fetching data with ID: ${id}`);
        const response = await axios.get(`${API_BASE_URL}/data/${id}`, getAuthHeaders());
        // console.log('Fetched data:', response.data);
        dispatch({ type: 'FETCH_DATA_BY_ID_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Fetch data failed:', error);
        dispatch({ type: 'FETCH_DATA_BY_ID_FAILURE', error: error.message });
    }
};

// FATCH ORDER BY ID 
export const fetchOrderDataById = (id) => async (dispatch) => {
    try {
        console.log(`Fetching order data with ID: ${id}`);
        const response = await axios.get(`${API_BASE_URL}/data/order/${id}`, getAuthHeaders());
        // console.log('Fetched order data:', response.data);
        dispatch({ type: 'FETCH_ORDERED_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Fetch order data failed:', error);
        dispatch({ type: 'FETCH_ORDERED_DATA_FAILURE', error: error.message });
    }
};

//fatch call back data by id
export const fetchCallbackDataById = (id) => async (dispatch) => {
    try {
        console.log(`Fetching callback data with ID: ${id}`);
        const response = await axios.get(`${API_BASE_URL}/data/callback/${id}`, getAuthHeaders());
        // console.log('Fetched callback data:', response.data);
        dispatch({ type: 'FETCH_CALLBACK_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Fetch callback data failed:', error);
        dispatch({ type: 'FETCH_CALLBACK_DATA_FAILURE', error: error.message });
    }
};

//fatch cancel data by id
export const fetchCancelDataById = (id) => async (dispatch) => {
    try {
        console.log(`Fetching cancel data with ID: ${id}`);
        const response = await axios.get(`${API_BASE_URL}/data/cancel/${id}`, getAuthHeaders());
        // console.log('Fetched cancel data:', response.data);
        dispatch({ type: 'FETCH_CANCELED_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Fetch cancel data failed:', error);
        dispatch({ type: 'FETCH_CANCELED_DATA_FAILURE', error: error.message });
    }
};

//fetch hold data by id
export const fetchHoldDataById = (id) => async (dispatch) => {
    try {
        console.log(`Fetching hold data with ID: ${id}`);
        const response = await axios.get(`${API_BASE_URL}/data/hold/${id}`, getAuthHeaders());
        console.log('Fetched hold data:', response.data);
        dispatch({ type: 'FETCH_HOLD_DATA_SUCCESS', payload: response.data });
    }
    catch (error) {
        console.error('Fetch hold data failed:', error);
        dispatch({ type: 'FETCH_HOLD_DATA_FAILURE', error: error.message });
    }
};


export const updateData = (id, data) => async (dispatch) => {
    try {
        // console.log(`Updating data with ID: ${id}, Data:`, data);
        const response = await axios.put(`${API_BASE_URL}/data/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                
            },
            
        },
            getAuthHeaders()
        );
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
        const response = await axios.post(`${API_BASE_URL}/data/${id}/order`, orderDetails, {
            headers: {
                'Content-Type': 'application/json',
            },
        },
            getAuthHeaders()
        );
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
        const response = await axios.post(`${API_BASE_URL}/data/${id}/cancel`, getAuthHeaders());
        console.log('Order canceled:', response.data);
        dispatch({ type: 'CANCEL_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Cancel data failed:', error);
        dispatch({ type: 'CANCEL_DATA_FAILURE', error: error.message });
    }
};


export const updateOrderStatus = (id, status) => async (dispatch) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/data/order/${id}/status`, { status }, getAuthHeaders());
        dispatch({ type: 'UPDATE_ORDER_STATUS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_ORDER_STATUS_FAILURE', error: error.message });
    }
};

export const deleteProductFromOrder = (id, productId) => async (dispatch) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/data/order/${id}/product/${productId}`, getAuthHeaders());
        dispatch({ type: 'DELETE_PRODUCT_FROM_ORDER_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'DELETE_PRODUCT_FROM_ORDER_FAILURE', error: error.message });
    }
};

export const updateOrder = (id, orderDetails) => async (dispatch) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/data/order/${id}`, orderDetails, {
            headers: {
                'Content-Type': 'application/json',
            },
        }, getAuthHeaders());
        dispatch({ type: 'UPDATE_ORDER_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_ORDER_FAILURE', error: error.message });
    }
};

export const updateDataHoldStatus = (id, status) => async (dispatch) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/data/${id}/status/hold`, { status }, getAuthHeaders());
        dispatch({ type: 'UPDATE_DATA_STATUS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_DATA_STATUS_FAILURE', error: error.message });
    }
};


export const updateDataCallbackStatus = (id, status) => async (dispatch) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/data/${id}/status/callback`, { status }, getAuthHeaders());
        dispatch({ type: 'UPDATE_DATA_STATUS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_DATA_STATUS_FAILURE', error: error.message });
    }
};


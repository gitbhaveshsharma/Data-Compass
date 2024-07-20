// Data action file
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

const fetchData = async (url, dispatch, successAction, failureAction) => {
    try {
        const response = await axios.get(url, getAuthHeaders());
        dispatch({ type: successAction, payload: response.data });
    } catch (error) {
        dispatch({ type: failureAction, payload: error.message });
    }
};

export const distributeData = (employeeIds, dataCount, departments) => async (dispatch) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/data/distribute`, { employeeIds, dataCount, departments }, getAuthHeaders());
        dispatch({ type: 'DISTRIBUTE_DATA_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'DISTRIBUTE_DATA_FAIL', payload: error.message });
    }
};

export const fetchDataCounts = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_DATA_COUNTS_REQUEST' });
        const res = await axios.get(`${API_BASE_URL}/data/counts`, getAuthHeaders());
        dispatch({ type: 'FETCH_DATA_COUNTS_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'FETCH_DATA_COUNTS_FAIL', payload: error.message });
    }
};

export const fetchAssignedData = (employeeId, role) => async (dispatch) => {
    const url = role === 'admin' ? `${API_BASE_URL}/data/assigned/all` : `${API_BASE_URL}/data/assigned/${employeeId}`;
    fetchData(url, dispatch, 'FETCH_ASSIGNED_DATA_SUCCESS', 'FETCH_ASSIGNED_DATA_FAILURE');
};

export const fetchOrderData = (employeeId, role) => async (dispatch) => {
    const url = role === 'admin' || role === 'logistics'
        ? `${API_BASE_URL}/data/orders/all`
        : `${API_BASE_URL}/data/orders/${employeeId}`;
    fetchData(url, dispatch, 'FETCH_ORDER_DATA_SUCCESS', 'FETCH_ORDER_DATA_FAILURE');
};

export const fetchVerifiedOrders = () => async (dispatch) => {
    fetchData(`${API_BASE_URL}/data/orders/status/verify`, dispatch, 'FETCH_VERIFIED_ORDERS_SUCCESS', 'FETCH_VERIFIED_ORDERS_FAILURE');
};

export const fetchCanceledData = (employeeId, role) => async (dispatch) => {
    const url = role === 'admin' ? `${API_BASE_URL}/data/canceled/all` : `${API_BASE_URL}/data/canceled/${employeeId}`;
    fetchData(url, dispatch, 'FETCH_CANCELED_DATA_SUCCESS', 'FETCH_CANCELED_DATA_FAILURE');
};

export const fetchCallbackData = (employeeId, role) => async (dispatch) => {
    const url = role === 'admin' ? `${API_BASE_URL}/data/callbacks/all` : `${API_BASE_URL}/data/callbacks/${employeeId}`;
    fetchData(url, dispatch, 'FETCH_CALLBACK_DATA_SUCCESS', 'FETCH_CALLBACK_DATA_FAILURE');
};

// Fetch hold data
export const fetchHoldData = (employeeId, role) => async (dispatch) => {
    const url = role === 'admin' ? `${API_BASE_URL}/data/hold/all` : `${API_BASE_URL}/data/hold/${employeeId}`;
    fetchData(url, dispatch, 'FETCH_HOLD_DATA_SUCCESS', 'FETCH_HOLD_DATA_FAILURE');
};
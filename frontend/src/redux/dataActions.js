import axios from 'axios';
const fetchData = async (url, dispatch, successAction, failureAction) => {
    try {
        const response = await axios.get(url);
        dispatch({ type: successAction, payload: response.data });
    } catch (error) {
        dispatch({ type: failureAction, payload: error.message });
    }
};

export const distributeData = (employeeIds, dataCount, departments) => async (dispatch) => {
    try {
        const res = await axios.post('http://localhost:3001/api/data/distribute', { employeeIds, dataCount, departments });
        dispatch({ type: 'DISTRIBUTE_DATA_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'DISTRIBUTE_DATA_FAIL', payload: error.message });
    }
};


export const fetchDataCounts = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_DATA_COUNTS_REQUEST' });
        const res = await axios.get('http://localhost:3001/api/data/counts');
        dispatch({ type: 'FETCH_DATA_COUNTS_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'FETCH_DATA_COUNTS_FAIL', payload: error.message });
    }
};

export const fetchAssignedData = (employeeId) => async (dispatch) => {
    try {
        // console.log(`Fetching data for employee ID: ${employeeId}`);
        const response = await axios.get(`http://localhost:3001/api/data/assigned/${employeeId}`);
        // console.log('Fetched data:', response.data);
        dispatch({ type: 'FETCH_ASSIGNED_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Failed to fetch assigned data:', error);
        dispatch({ type: 'FETCH_ASSIGNED_DATA_FAILURE', error: error.message });
    }
};

export const fetchOrderData = (employeeId, role) => async (dispatch) => {
    const url = role === 'admin' ? 'http://localhost:3001/api/data/orders/all' : `http://localhost:3001/api/data/orders/${employeeId}`;
    fetchData(url, dispatch, 'FETCH_ORDER_DATA_SUCCESS', 'FETCH_ORDER_DATA_FAILURE');
};

export const fetchCanceledData = (employeeId, role) => async (dispatch) => {
    const url = role === 'admin' ? 'http://localhost:3001/api/data/canceled/all' : `http://localhost:3001/api/data/canceled/${employeeId}`;
    fetchData(url, dispatch, 'FETCH_CANCELED_DATA_SUCCESS', 'FETCH_CANCELED_DATA_FAILURE');
};

export const fetchCallbackData = (employeeId, role) => async (dispatch) => {
    const url = role === 'admin' ? 'http://localhost:3001/api/data/callbacks/all' : `http://localhost:3001/api/data/callbacks/${employeeId}`;
    fetchData(url, dispatch, 'FETCH_CALLBACK_DATA_SUCCESS', 'FETCH_CALLBACK_DATA_FAILURE');
};
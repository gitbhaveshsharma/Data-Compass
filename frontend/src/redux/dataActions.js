import axios from 'axios';

export const distributeData = (employeeIds, dataCount) => async (dispatch) => {
    try {
        const res = await axios.post('http://localhost:3001/api/data/distribute', { employeeIds, dataCount });
        dispatch({ type: 'DISTRIBUTE_DATA_SUCCESS', payload: res.data.updatedData });
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
        console.log(`Fetching data for employee ID: ${employeeId}`);
        const response = await axios.get(`http://localhost:3001/api/data/assigned/${employeeId}`);
        console.log('Fetched data:', response.data);
        dispatch({ type: 'FETCH_ASSIGNED_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Failed to fetch assigned data:', error);
        dispatch({ type: 'FETCH_ASSIGNED_DATA_FAILURE', error: error.message });
    }
};

export const updateDataStatus = (dataId, status, assignedTo) => async (dispatch) => {
    try {
        const response = await axios.post('/api/data/update-status', { dataId, status, assignedTo });
        dispatch({ type: 'UPDATE_DATA_STATUS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_DATA_STATUS_FAILURE', error: error.message });
    }
};

export const fetchOrderDataByEmployeeId = (employeeId) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_ORDER_DATA_REQUEST' });
        const response = await axios.get(`http://localhost:3001/api/data/orders/${employeeId}`);
        console.log('Fetched Order data:', response.data);
        dispatch({ type: 'FETCH_ORDER_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_ORDER_DATA_FAILURE', payload: error.message });
    }
};

export const fetchCanceledDataByEmployeeId = (employeeId) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_CANCELED_DATA_REQUEST' });
        const response = await axios.get(`http://localhost:3001/api/data/canceled/${employeeId}`);
        dispatch({ type: 'FETCH_CANCELED_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_CANCELED_DATA_FAILURE', payload: error.message });
    }
};

export const fetchCallbackDataByEmployeeId = (employeeId) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_CALLBACK_DATA_REQUEST' });
        const response = await axios.get(`http://localhost:3001/api/data/callbacks/${employeeId}`);
        dispatch({ type: 'FETCH_CALLBACK_DATA_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_CALLBACK_DATA_FAILURE', payload: error.message });
    }
};

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
    dispatch({ type: 'FETCH_EMPLOYEES_REQUEST' });
    try {
        const res = await axios.get(`${API_BASE_URL}/employees`, getAuthHeaders());
        dispatch({ type: 'FETCH_EMPLOYEES_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'FETCH_EMPLOYEES_FAIL', payload: error.message });
    }
};

export const updateEmployee = (id, updatedData) => async (dispatch) => {
    try {
        // console.log('Attempting to update employee:', id, updatedData);
        const res = await axios.put(`${API_BASE_URL}/employees/${id}`, updatedData, getAuthHeaders());
        // console.log('Update successful, response:', res.data);
        dispatch({ type: 'UPDATE_EMPLOYEE_SUCCESS', payload: res.data });
    } catch (error) {
        // console.error('Update failed:', error.response ? error.response.data : error.message);
        dispatch({ type: 'UPDATE_EMPLOYEE_FAIL', payload: error.message });
    }
};

export const fetchEmployeeByEmail = (email) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_EMPLOYEE_REQUEST' });
        const res = await axios.get(`${API_BASE_URL}/employees/email?email=${email}`, getAuthHeaders());
        dispatch({
            type: 'FETCH_EMPLOYEE_SUCCESS',
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: 'FETCH_EMPLOYEE_FAILURE',
            payload: error.message,
        });
    }
};
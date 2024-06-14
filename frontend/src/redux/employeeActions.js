// src/redux/employeeActions.js
import axios from 'axios';

export const fetchEmployees = () => async (dispatch) => {
    try {
        const res = await axios.get('http://localhost:3001/api/employees');
        dispatch({ type: 'FETCH_EMPLOYEES_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'FETCH_EMPLOYEES_FAIL', payload: error.message });
    }
};

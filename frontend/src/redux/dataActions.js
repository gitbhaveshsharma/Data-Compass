// src/redux/dataActions.js
import axios from 'axios';

export const distributeData = (employeeIds, dataCount) => async (dispatch) => {
    try {
        const res = await axios.post('http://localhost:3001/api/data/distribute', { employeeIds, dataCount });
        dispatch({ type: 'DISTRIBUTE_DATA_SUCCESS', payload: res.data.updatedData });
    } catch (error) {
        dispatch({ type: 'DISTRIBUTE_DATA_FAIL', payload: error.message });
    }
};

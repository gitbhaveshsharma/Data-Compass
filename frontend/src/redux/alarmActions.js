import axios from 'axios';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const createAlarm = (alarmData) => async (dispatch) => {
    try {
        // Log the alarmData before any modification
        console.log('Original alarmData:', alarmData);

        // Convert the alarmTime to Asia/Kolkata timezone string before sending to backend
        const formattedAlarmData = {
            ...alarmData,
            alarmTime: dayjs(alarmData.alarmTime).tz('Asia/Kolkata').format(),
        };

        // Log the formatted alarmData before sending
        console.log('Formatted alarmData:', formattedAlarmData);

        const response = await axios.post('http://localhost:3001/api/alarms', formattedAlarmData);
        dispatch({ type: 'CREATE_ALARM_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'CREATE_ALARM_FAILURE', error: error.message });
    }
};

export const fetchAlarms = () => async (dispatch) => {
    try {
        const response = await axios.get('/api/alarms');
        dispatch({ type: 'FETCH_ALARMS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_ALARMS_FAILURE', error: error.message });
    }
};

export const fetchAlarmsByEmployeeId = (employeeId) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/alarms/employee/${employeeId}`);
        console.log('Fetched alarms:', response.data);
        dispatch({ type: 'FETCH_ALARMS_BY_EMPLOYEE_ID_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Error fetching alarms:', error); 
        dispatch({ type: 'FETCH_ALARMS_BY_EMPLOYEE_ID_FAILURE', error: error.message });
    }
};

export const updateAlarm = (id, alarmData) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:3001/api/alarms/${id}`, alarmData);
        dispatch({ type: 'UPDATE_ALARM_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_ALARM_FAILURE', error: error.message });
    }
};

export const deleteAlarm = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:3001/api/alarms/${id}`);
        dispatch({ type: 'DELETE_ALARM_SUCCESS', payload: id });
    } catch (error) {
        dispatch({ type: 'DELETE_ALARM_FAILURE', error: error.message });
    }
};

import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const createAlarm = (alarmData) => async (dispatch) => {
    try {

        // Convert the alarmTime to Asia/Kolkata timezone string before sending to backend
        const formattedAlarmData = {
            ...alarmData,
            alarmTime: dayjs(alarmData.alarmTime).tz('Asia/Kolkata').format(),
        };

        const response = await axios.post(`${API_BASE_URL}/alarms`, formattedAlarmData, getAuthHeaders());
        dispatch({ type: 'CREATE_ALARM_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'CREATE_ALARM_FAILURE', error: error.message });
    }
};

export const fetchAlarms = () => async (dispatch) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/alarms`, getAuthHeaders());
        dispatch({ type: 'FETCH_ALARMS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_ALARMS_FAILURE', error: error.message });
    }
};

export const fetchAlarmsByEmployeeId = (employeeId) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/alarms/employee/${employeeId}`, getAuthHeaders());
        dispatch({ type: 'FETCH_ALARMS_BY_EMPLOYEE_ID_SUCCESS', payload: response.data });
    } catch (error) {
        // console.error('Error fetching alarms:', error);
        dispatch({ type: 'FETCH_ALARMS_BY_EMPLOYEE_ID_FAILURE', error: error.message });
    }
};

export const updateAlarm = (id, alarmData) => async (dispatch) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/alarms/${id}`, alarmData, getAuthHeaders());
        dispatch({ type: 'UPDATE_ALARM_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_ALARM_FAILURE', error: error.message });
    }
};

export const deleteAlarm = (id) => async (dispatch) => {
    try {
        await axios.delete(`${API_BASE_URL}/alarms/${id}`, getAuthHeaders());
        dispatch({ type: 'DELETE_ALARM_SUCCESS', payload: id });
    } catch (error) {
        dispatch({ type: 'DELETE_ALARM_FAILURE', error: error.message });
    }
};

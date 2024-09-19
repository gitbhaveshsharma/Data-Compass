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

export const registerIP = (ipData) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/ips/register`, ipData, getAuthHeaders());
        dispatch({ type: 'REGISTER_IP_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'REGISTER_IP_FAILURE', error: error.message });
    }
};

export const updateIP = (ip, ipData) => async (dispatch) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/ips/update/${ip}`, ipData, getAuthHeaders());
        dispatch({ type: 'UPDATE_IP_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_IP_FAILURE', error: error.message });
    }
};

export const deleteIP = (ip) => async (dispatch) => {
    console.log(ip)
    try {
        await axios.delete(`http://localhost:5001/api/ips/delete/${ip}`);
        dispatch({ type: 'DELETE_IP_SUCCESS', payload: ip });
    } catch (error) {
        console.error('Error deleting IP:', error);
        dispatch({ type: 'DELETE_IP_FAILURE', payload: error.message });
    }
};

export const fetchIPs = () => async (dispatch) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ips`, getAuthHeaders());
        dispatch({ type: 'FETCH_IPS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_IPS_FAILURE', error: error.message });
    }
};

export const toggleIPStatus = (ip, status) => async (dispatch) => {
    console.log("IP:", ip, "Status:", status); // Log IP and status
    try {
        const response = await axios.put(
            `${API_BASE_URL}/ips/toggle-status/${ip}`,
            { status },  // Sending the status in the request body
            getAuthHeaders()
        );
        console.log("Response Data:", response.data); // Log response data
        dispatch({ type: 'TOGGLE_IP_STATUS_SUCCESS', payload: response.data });
    } catch (error) {
        console.error("Toggle IP Status Error:", error); // Log error details
        dispatch({ type: 'TOGGLE_IP_STATUS_FAILURE', error: error.message });
    }
};

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
export const fetchIpAddresses = () => async (dispatch) => {
    try {
       const response = await axios.get(`${API_BASE_URL}/access-control`, getAuthHeaders());
        dispatch({ type: 'FETCH_IP_SUCCESS', payload: response.data });
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        dispatch({ type: 'FETCH_IP_FAILED', payload: errorMessage });
    }
};

// Register action creator
export const register = (IpData) => async (dispatch) => {
    console.log("ip:", IpData)
    try {
        const response = await axios.post(`${API_BASE_URL}/access-control`, IpData);
        dispatch({ type: 'IP_REGISTER_SUCCESS', payload : response.data });
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        dispatch({ type: 'IP_REGISTER_FAILURE', payload: errorMessage });
    }
};

// Delete action creator
// Action creator for DELETE request
export const deleteIp = (id) => async (dispatch) => {
    try {
        
        await axios.delete(`${API_BASE_URL}/access-control/${id}`, { headers: getAuthHeaders() });
        dispatch({ type: 'IP_DELETE_SUCCESS', payload: id });
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        dispatch({ type: 'IP_DELETE_FAILURE', payload: errorMessage });
    }
};


// Update action creator
export const updateIp = (IpData) => async (dispatch) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/access-control/`, IpData, getAuthHeaders());
        dispatch({ type: 'IP_UPDATE_SUCCESS', payload: response.data });
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        dispatch({ type: 'IP_UPDATE_FAILURE', payload: errorMessage });
    }
};

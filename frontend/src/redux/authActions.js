// src/redux/authActions.js
import axios from 'axios';

export const login = (credentials) => async (dispatch) => {
    try {
        const res = await axios.post('/auth/login', credentials);
        localStorage.setItem('token', res.data.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.token });
    } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
};

export const register = (userData) => async (dispatch) => {
    try {
        await axios.post('/auth/register', userData);
        dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (error) {
        dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
};

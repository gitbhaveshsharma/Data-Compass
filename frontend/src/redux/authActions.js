// src/redux/authActions.js
import axios from 'axios';

export const login = (credentials) => async (dispatch) => {
    try {
        const res = await axios.post('http://localhost:3001/api/auth/login', credentials);
        localStorage.setItem('token', res.data.token);
        const user = res.data.user;
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token: res.data.token, user } });
    } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
};

export const register = (userData) => async (dispatch) => {
    try {
        await axios.post('http://localhost:3001/api/auth/register', userData);
        dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (error) {
        dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
};

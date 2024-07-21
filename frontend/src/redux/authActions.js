// src/redux/authActions.js
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const login = (credentials) => async (dispatch) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        localStorage.setItem('token', res.data.token);
        const user = res.data.user;
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token: res.data.token, user } });
    } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
};

export const register = (userData) => async (dispatch) => {
    console.log(userData)
    try {
        await axios.post(`${API_BASE_URL}/auth/register`, userData);
        dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (error) {
        dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
};

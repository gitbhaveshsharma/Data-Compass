import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { recordHistory } from './historyActions';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const checkTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (token && checkTokenExpiration(token)) {
    setAuthToken(token);
    const decoded = jwtDecode(token);
    dispatch({ type: 'USER_LOADED', payload: { id: decoded.id, role: decoded.role, department: decoded.department, employeeId: decoded.employeeId, } });
  } else {
    dispatch({ type: 'AUTH_ERROR' });
  }
};

export const login = (credentials) => async (dispatch) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        const token = res.data.token;
        localStorage.setItem('token', token);
        setAuthToken(token);
        dispatch(loadUser());
        // Dispatch recordHistory action after user is loaded
        // const decoded = jwtDecode(token);
        // console.log(decoded)
        // dispatch(recordHistory({ employeeId: decoded.employeeId, type: 'login' }));
    } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
};

export const register = (userData) => async (dispatch) => {
    try {
        await axios.post(`${API_BASE_URL}/auth/register`, userData);
        dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (error) {
        dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
    window.location.href = '/login';
};

